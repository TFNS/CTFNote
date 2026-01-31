import { Build, Context, SchemaBuilder } from "postgraphile";
import { GraphQLResolveInfoWithMessages } from "@graphile/operation-hooks";
import { mattermostHooks } from "./hooks";
import config from "../config";
import { PoolClient } from "pg";

interface CTFData {
  id: bigint;
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

interface TaskData {
  id: bigint;
  ctf_id: bigint;
  title: string;
  description: string;
  flag: string;
}

async function getCtfFromDatabase(
  ctfId: bigint,
  pgClient: PoolClient
): Promise<CTFData | null> {
  try {
    const result = await pgClient.query(
      'SELECT id, title, description, start_time as "startTime", end_time as "endTime" FROM ctfnote.ctf WHERE id = $1',
      [ctfId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  } catch (error) {
    console.error("Failed to get CTF from database:", error);
    return null;
  }
}

async function getTaskFromDatabase(
  taskId: bigint,
  pgClient: PoolClient
): Promise<TaskData | null> {
  try {
    const result = await pgClient.query(
      "SELECT id, ctf_id, title, description, flag FROM ctfnote.task WHERE id = $1",
      [taskId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  } catch (error) {
    console.error("Failed to get task from database:", error);
    return null;
  }
}

async function getTaskByCtfIdAndTitle(
  ctfId: bigint,
  title: string,
  pgClient: PoolClient
): Promise<TaskData | null> {
  try {
    const result = await pgClient.query(
      "SELECT id, ctf_id, title, description, flag FROM ctfnote.task WHERE ctf_id = $1 AND title = $2",
      [ctfId, title]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  } catch (error) {
    console.error("Failed to get task from database:", error);
    return null;
  }
}

const mattermostMutationHook =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  (_build: Build) => (fieldContext: Context<any>) => {
    const {
      scope: { isRootMutation },
    } = fieldContext;

    if (!isRootMutation) return null;

    if (!config.mattermost.enabled) return null;

    const relevantMutations = [
      "createCtf",
      "createTask",
      "updateTask",
      "startWorkingOn",
      "stopWorkingOn",
    ];

    if (!relevantMutations.includes(fieldContext.scope.fieldName)) {
      return null;
    }

    const handleMattermostMutationAfter = async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _resolveInfo: GraphQLResolveInfoWithMessages
    ) => {
      console.log(
        `Mattermost hook triggered for mutation: ${fieldContext.scope.fieldName}`
      );
      try {
        switch (fieldContext.scope.fieldName) {
          case "createCtf": {
            console.log("Processing createCtf mutation for Mattermost");

            // The CTF ID is in the returned data structure at input.data["@ctf"].id
            const ctfId = input?.data?.["@ctf"]?.id;
            if (!ctfId) {
              console.log("No CTF ID found in mutation result");
              break;
            }

            console.log(`Found CTF ID: ${ctfId}`);

            const ctf = await getCtfFromDatabase(ctfId, context.pgClient);
            if (!ctf) {
              console.log("CTF not found in database");
              break;
            }

            console.log(`Creating Mattermost channels for CTF: ${ctf.title}`);
            await mattermostHooks.handleCtfCreated({
              id: ctf.id,
              title: ctf.title,
              description: ctf.description,
              startTime: ctf.startTime,
              endTime: ctf.endTime,
            });
            break;
          }

          case "createTask": {
            const ctfId = args.input.ctfId;
            const title = args.input.title;

            if (!ctfId || !title) break;

            const task = await getTaskByCtfIdAndTitle(
              ctfId,
              title,
              context.pgClient
            );
            if (!task) break;

            const ctf = await getCtfFromDatabase(ctfId, context.pgClient);
            if (!ctf) break;

            await mattermostHooks.handleTaskCreated(
              {
                id: task.id,
                ctf_id: task.ctf_id,
                title: task.title,
                description: task.description,
                flag: task.flag,
              },
              {
                id: ctf.id,
                title: ctf.title,
                description: ctf.description,
                startTime: ctf.startTime,
                endTime: ctf.endTime,
              }
            );
            break;
          }

          case "updateTask": {
            const taskId = args.input.id;
            const newFlag = args.input.patch?.flag;

            if (!taskId) break;

            const task = await getTaskFromDatabase(taskId, context.pgClient);
            if (!task) break;

            const ctf = await getCtfFromDatabase(task.ctf_id, context.pgClient);
            if (!ctf) break;

            if (newFlag && newFlag !== "") {
              await mattermostHooks.handleTaskSolved(
                {
                  id: task.id,
                  ctf_id: task.ctf_id,
                  title: task.title,
                  description: task.description,
                  flag: newFlag,
                },
                {
                  id: ctf.id,
                  title: ctf.title,
                  description: ctf.description,
                  startTime: ctf.startTime,
                  endTime: ctf.endTime,
                }
              );
            }
            break;
          }

          case "startWorkingOn": {
            const taskId = args.input.taskId;

            if (!taskId) break;

            const task = await getTaskFromDatabase(taskId, context.pgClient);
            if (!task) break;

            const ctf = await getCtfFromDatabase(task.ctf_id, context.pgClient);
            if (!ctf) break;

            await mattermostHooks.handleTaskStarted(
              {
                id: task.id,
                ctf_id: task.ctf_id,
                title: task.title,
                description: task.description,
                flag: task.flag,
              },
              {
                id: ctf.id,
                title: ctf.title,
                description: ctf.description,
                startTime: ctf.startTime,
                endTime: ctf.endTime,
              }
            );
            break;
          }
        }
      } catch (error) {
        console.error("Mattermost hook error:", error);
      }

      return input;
    };

    return {
      after: [
        {
          priority: 500,
          callback: handleMattermostMutationAfter,
        },
      ],
    };
  };

export default async function (builder: SchemaBuilder): Promise<void> {
  if (!config.mattermost.enabled) {
    console.log("Mattermost integration is disabled in config");
    return;
  }

  console.log("Initializing Mattermost hooks...");
  await mattermostHooks.initialize();

  builder.hook("init", (_, build) => {
    console.log("Adding Mattermost operation hooks to GraphQL");
    build.addOperationHook(mattermostMutationHook(build));
    return _;
  });
}
