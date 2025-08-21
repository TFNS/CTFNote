import { Client4 } from "@mattermost/client";
import type { Team } from "@mattermost/types/teams";
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
      const team = teams.find(
        (t: Team) => t.name === config.mattermost.teamName
      );

      if (!team) {
        throw new Error(`Team ${config.mattermost.teamName} not found`);
      }

      this.teamId = team.id;
      this.connected = true;

      console.log(
        `Connected to Mattermost as ${user.username} in team ${team.display_name}`
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
