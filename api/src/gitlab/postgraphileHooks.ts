import { Build, Context, SchemaBuilder } from "postgraphile";
import { GraphQLResolveInfoWithMessages } from "@graphile/operation-hooks";
import { gitlabClient } from "./client";
import { gitlabRepositoryManager } from "./repositories";
import config from "../config";
import { PoolClient } from "pg";

interface TaskData {
  id: bigint;
  ctf_id: bigint;
  title: string;
  description: string;
  flag: string;
}

interface CTFData {
  id: bigint;
  title: string;
  description?: string;
  start_time?: Date;
  end_time?: Date;
}

async function getCtfFromDatabase(
  ctfId: bigint,
  pgClient: PoolClient
): Promise<CTFData | null> {
  const result = await pgClient.query(
    "SELECT * FROM ctfnote.ctf WHERE id = $1",
    [ctfId]
  );
  return result.rows[0] || null;
}

async function getTaskFromDatabase(
  ctfId: bigint,
  title: string,
  pgClient: PoolClient
): Promise<TaskData | null> {
  try {
    const result = await pgClient.query(
      "SELECT id, ctf_id, title, description, flag FROM ctfnote.task WHERE ctf_id = $1 AND title = $2 ORDER BY id DESC LIMIT 1",
      [ctfId, title]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  } catch (error) {
    console.error("Failed to get task from database:", error);
    return null;
  }
}

const gitlabMutationHook =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_build: Build) => (fieldContext: Context<unknown>) => {
    const {
      scope: { isRootMutation },
    } = fieldContext;

    if (!isRootMutation) return null;

    if (!config.gitlab.enabled) return null;

    const relevantMutations = ["createTask"];

    if (!relevantMutations.includes(fieldContext.scope.fieldName)) {
      return null;
    }

    const gitlabMutationHandler = async (
      input: unknown,
      args: Record<string, unknown>,
      context: { pgClient: PoolClient },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _resolveInfo: GraphQLResolveInfoWithMessages
    ) => {
      console.log(
        `GitLab hook triggered for mutation: ${fieldContext.scope.fieldName}`
      );
      try {
        switch (fieldContext.scope.fieldName) {
          case "createTask": {
            console.log("Processing createTask mutation for GitLab");

            const taskArgs = args as {
              input: { ctfId: number; title: string };
            };
            const ctfId = taskArgs.input.ctfId;
            const title = taskArgs.input.title;

            console.log(
              `Looking for task with title: ${title} in CTF ${ctfId}`
            );

            // Get task from database (it should exist after the mutation)
            const task = await getTaskFromDatabase(
              BigInt(ctfId),
              title,
              context.pgClient
            );
            if (!task) {
              console.error(`Task not found in database: ${title}`);
              break;
            }

            const ctf = await getCtfFromDatabase(task.ctf_id, context.pgClient);
            if (!ctf) {
              console.error(`CTF not found for task: ${task.title}`);
              break;
            }

            console.log(
              `Creating GitLab repository for task: ${task.title} in CTF: ${ctf.title}`
            );

            // Create repository asynchronously to not block the mutation
            gitlabRepositoryManager
              .createRepositoryForTask(
                {
                  id: task.id,
                  ctf_id: task.ctf_id,
                  title: task.title,
                  description: task.description || "",
                  flag: task.flag || "",
                },
                {
                  id: ctf.id,
                  title: ctf.title,
                  description: ctf.description,
                  startTime: ctf.start_time,
                  endTime: ctf.end_time,
                }
              )
              .catch((error) => {
                console.error("Failed to create GitLab repository:", error);
              });

            break;
          }
        }
      } catch (error) {
        console.error("GitLab hook error:", error);
      }

      return input;
    };

    return {
      after: [
        {
          priority: 500,
          callback: gitlabMutationHandler,
        },
      ],
    };
  };

export default async function gitlabPostgraphileHooks(
  builder: SchemaBuilder
): Promise<void> {
  if (!config.gitlab.enabled) {
    console.log("GitLab integration is disabled");
    return;
  }

  console.log("Initializing GitLab hooks...");
  await gitlabClient.connect();

  if (!gitlabClient.isConnected()) {
    console.error("Failed to initialize GitLab hooks - client not connected");
    return;
  }

  builder.hook("init", (_, build) => {
    console.log("Adding GitLab operation hooks to GraphQL");
    build.addOperationHook(gitlabMutationHook(build));
    return _;
  });
}
