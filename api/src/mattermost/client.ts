import { Client4 } from "@mattermost/client";
import config from "../config";

export class MattermostClient {
  private client: Client4;
  private userId: string | null = null;
  private teamId: string | null = null;
  private connected: boolean = false;

  constructor() {
    this.client = new Client4();
    if (config.mattermost.url) {
      this.client.setUrl(config.mattermost.url);
    }
  }

  async connect(): Promise<void> {
    if (!config.mattermost.enabled) {
      console.log("Mattermost integration is disabled");
      return;
    }

    if (
      !config.mattermost.url ||
      !config.mattermost.username ||
      !config.mattermost.password
    ) {
      console.error("Mattermost configuration is incomplete");
      return;
    }

    try {
      console.log("Connecting to Mattermost...");

      const user = await this.client.login(
        config.mattermost.username,
        config.mattermost.password
      );

      this.userId = user.id;

      const teamsResponse = await this.client.getTeams();
      const teams = Array.isArray(teamsResponse)
        ? teamsResponse
        : teamsResponse.teams;
      
      // Just use the first available team the user belongs to
      if (teams.length === 0) {
        throw new Error(
          `No teams found for user ${config.mattermost.username}. Please ensure the user belongs to at least one team.`
        );
      }

      const team = teams[0];
      this.teamId = team.id;
      this.connected = true;

      console.log(
        `Connected to Mattermost as ${user.username} using team ${team.display_name}`
      );
    } catch (error) {
      console.error("Failed to connect to Mattermost:", error);
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getClient(): Client4 {
    return this.client;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getTeamId(): string | null {
    return this.teamId;
  }
}

export const mattermostClient = new MattermostClient();
