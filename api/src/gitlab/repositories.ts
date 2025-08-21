import { gitlabClient } from "./client";
import config from "../config";
import { safeSlugify } from "../utils/utils";

export interface CTF {
  id: bigint;
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface Task {
  id: bigint;
  ctf_id: bigint;
  title: string;
  description: string;
  flag: string;
}

export interface GitLabRepository {
  id: number;
  name: string;
  path: string;
  web_url: string;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
}

export class GitLabRepositoryManager {
  private normalizeRepoName(name: string): string {
    return safeSlugify(name)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 100);
  }

  private getRepoName(ctf: CTF, task: Task): string {
    const ctfName = this.normalizeRepoName(ctf.title);
    const taskName = this.normalizeRepoName(task.title);
    return `${ctfName}-${taskName}`.substring(0, 100);
  }

  private generateReadmeContent(ctf: CTF, task: Task): string {
    const ctfnoteUrl = this.getTaskUrl(ctf, task);

    return `# ${task.title}

## CTF: ${ctf.title}

${task.description || "No description provided"}

## Task Information

- **CTF**: ${ctf.title}
- **Task**: ${task.title}
- **Created**: ${new Date().toISOString()}
${ctf.startTime ? `- **CTF Start**: ${ctf.startTime.toISOString()}` : ""}
${ctf.endTime ? `- **CTF End**: ${ctf.endTime.toISOString()}` : ""}

## CTFNote Link

[View in CTFNote](${ctfnoteUrl})

## Getting Started

1. Clone this repository
2. Work on the challenge
3. Document your findings
4. Share solutions with your team

## Directory Structure

\`\`\`
.
├── README.md          # This file
├── challenge/         # Challenge files
├── solution/          # Your solution
├── notes/            # Working notes
└── scripts/          # Helper scripts
\`\`\`

---
*This repository was automatically created by CTFNote*
`;
  }

  async createRepositoryForTask(
    task: Task,
    ctf: CTF
  ): Promise<GitLabRepository | null> {
    if (!gitlabClient.isConnected()) {
      console.error("GitLab client is not connected");
      return null;
    }

    try {
      console.log(`Creating GitLab repository for task: ${task.title}`);

      const repoName = this.getRepoName(ctf, task);
      const client = gitlabClient.getClient();
      const groupId = gitlabClient.getGroupId();

      // Check if repository already exists
      const existingRepo = await this.findRepository(repoName, groupId);
      if (existingRepo) {
        console.log(`Repository ${repoName} already exists`);
        return existingRepo;
      }

      // Prepare repository data
      const repoData: Record<string, unknown> = {
        name: repoName,
        description: `Task: ${task.title} | CTF: ${ctf.title}`,
        visibility: config.gitlab.visibility,
        initialize_with_readme: true,
        default_branch: config.gitlab.defaultBranch,
      };

      // Add namespace_id if we have a group
      if (groupId) {
        repoData.namespace_id = groupId;
      }

      // Create the repository
      const response = await client.post("/projects", repoData);
      const repository = response.data;

      console.log(`Created repository: ${repository.path_with_namespace}`);

      // Update README with detailed content
      try {
        const readmeContent = this.generateReadmeContent(ctf, task);
        await this.updateFile(
          repository.id,
          "README.md",
          readmeContent,
          "Update README with task details"
        );

        // Create directory structure
        await this.createDirectoryStructure(repository.id);
      } catch (error) {
        console.error("Failed to update repository content:", error);
        // Don't fail the whole operation if we can't update the README
      }

      console.log(`Successfully created repository for task: ${task.title}`);
      console.log(`Repository URL: ${repository.web_url}`);

      return repository;
    } catch (error) {
      console.error(
        `Failed to create repository for task ${task.title}:`,
        error
      );

      const err = error as { response?: { status?: number } };
      if (err.response?.status === 400) {
        console.error("Bad request - check repository name and parameters");
      } else if (err.response?.status === 401) {
        console.error(
          "Authentication failed - check GitLab personal access token"
        );
      } else if (err.response?.status === 403) {
        console.error("Permission denied - check token has 'api' scope");
      }

      return null;
    }
  }

  private async findRepository(
    name: string,
    groupId: number | null
  ): Promise<GitLabRepository | null> {
    try {
      const client = gitlabClient.getClient();

      // Search within the group if specified
      const searchParams = {
        search: name,
        simple: true,
      };

      if (groupId) {
        const response = await client.get(`/groups/${groupId}/projects`, {
          params: searchParams,
        });

        const repos = response.data as GitLabRepository[];
        const repo = repos.find((r) => r.path === name);
        return repo || null;
      } else {
        // Search in user's projects
        const response = await client.get("/projects", {
          params: { ...searchParams, owned: true },
        });

        const repos = response.data as GitLabRepository[];
        const repo = repos.find((r) => r.path === name);
        return repo || null;
      }
    } catch (error) {
      // Repository doesn't exist, which is fine
      return null;
    }
  }

  private async updateFile(
    projectId: number,
    filePath: string,
    content: string,
    commitMessage: string
  ): Promise<void> {
    try {
      const client = gitlabClient.getClient();
      const encodedContent = Buffer.from(content).toString("base64");

      await client.put(
        `/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
        {
          branch: config.gitlab.defaultBranch,
          content: encodedContent,
          commit_message: commitMessage,
          encoding: "base64",
        }
      );
    } catch (error) {
      console.error(`Failed to update file ${filePath}:`, error);
      throw error;
    }
  }

  private async createDirectoryStructure(projectId: number): Promise<void> {
    const directories = ["challenge", "solution", "notes", "scripts"];
    const client = gitlabClient.getClient();

    for (const dir of directories) {
      try {
        // Create a .gitkeep file in each directory
        const filePath = `${dir}/.gitkeep`;
        const encodedContent = Buffer.from("").toString("base64");

        await client.post(
          `/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
          {
            branch: config.gitlab.defaultBranch,
            content: encodedContent,
            commit_message: `Create ${dir} directory`,
            encoding: "base64",
          }
        );
      } catch (error) {
        console.error(`Failed to create directory ${dir}:`, error);
        // Continue with other directories even if one fails
      }
    }
  }

  private getTaskUrl(ctf: CTF, task: Task): string {
    if (!config.pad.domain) return "";

    const ssl = config.pad.useSSL === "false" ? "" : "s";
    return `http${ssl}://${config.pad.domain}/#/ctf/${ctf.id}-${safeSlugify(
      ctf.title
    )}/task/${task.id}`;
  }
}

export const gitlabRepositoryManager = new GitLabRepositoryManager();
