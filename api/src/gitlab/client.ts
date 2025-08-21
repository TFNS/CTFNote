import axios, { AxiosInstance } from "axios";
import config from "../config";

export interface GitLabGroup {
  id: number;
  name: string;
  path: string;
  full_path: string;
}

export class GitLabClient {
  private client: AxiosInstance;
  private groupId: number | null = null;
  private connected: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: `${config.gitlab.url}/api/v4`,
      headers: {
        "PRIVATE-TOKEN": config.gitlab.personalAccessToken,
        "Content-Type": "application/json",
      },
    });
  }

  async connect(): Promise<void> {
    if (!config.gitlab.enabled) {
      console.log("GitLab integration is disabled");
      return;
    }

    if (!config.gitlab.url || !config.gitlab.personalAccessToken) {
      console.error("GitLab configuration is incomplete");
      return;
    }

    try {
      console.log("Connecting to GitLab...");

      // Test authentication by getting current user
      const userResponse = await this.client.get("/user");
      const user = userResponse.data;

      console.log(`Authenticated as GitLab user: ${user.username}`);

      // Find or create the group
      if (config.gitlab.groupPath) {
        try {
        const groupResponse = await this.client.get(
          `/groups/${encodeURIComponent(config.gitlab.groupPath)}`
        );
        const group = groupResponse.data;
        this.groupId = group.id;
        console.log(`Using GitLab group: ${group.full_path} (ID: ${group.id})`);
        } catch (error) {
          const err = error as { response?: { status?: number } };
          if (err.response?.status === 404) {
            // Group doesn't exist, try to create it
            console.log(`Group '${config.gitlab.groupPath}' not found, attempting to create it...`);
            
            // Parse the group path to determine if it's a subgroup
            const pathParts = config.gitlab.groupPath.split('/');
            
            if (pathParts.length === 1) {
              // Top-level group
              try {
                const createResponse = await this.client.post('/groups', {
                  path: pathParts[0],
                  name: pathParts[0],
                  visibility: 'private'
                });
                const newGroup = createResponse.data;
                this.groupId = newGroup.id;
                console.log(`✓ Created GitLab group: ${newGroup.full_path} (ID: ${newGroup.id})`);
              } catch (createError) {
                console.error("Failed to create GitLab group:", createError);
                throw createError;
              }
            } else {
              // Subgroup - need to find parent and create subgroup
              const parentPath = pathParts.slice(0, -1).join('/');
              const subgroupName = pathParts[pathParts.length - 1];
              
              try {
                // Get parent group
                const parentResponse = await this.client.get(
                  `/groups/${encodeURIComponent(parentPath)}`
                );
                const parentGroup = parentResponse.data;
                
                // Create subgroup
                const createResponse = await this.client.post('/groups', {
                  path: subgroupName,
                  name: subgroupName,
                  parent_id: parentGroup.id,
                  visibility: 'private'
                });
                const newGroup = createResponse.data;
                this.groupId = newGroup.id;
                console.log(`✓ Created GitLab subgroup: ${newGroup.full_path} (ID: ${newGroup.id})`);
              } catch (createError) {
                console.error("Failed to create GitLab subgroup:", createError);
                throw createError;
              }
            }
          } else {
            throw error;
          }
        }
      } else {
        console.log(
          "No GitLab group specified, repositories will be created in user namespace"
        );
      }

      this.connected = true;
    } catch (error) {
      console.error("Failed to connect to GitLab:", error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        console.error(
          "Authentication failed - check your personal access token"
        );
      } else if (err.response?.status === 404) {
        console.error("Group not found - check GITLAB_GROUP_PATH");
      }
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  getGroupId(): number | null {
    return this.groupId;
  }
}

export const gitlabClient = new GitLabClient();
