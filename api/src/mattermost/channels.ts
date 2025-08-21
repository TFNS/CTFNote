import { mattermostClient } from "./client";
import type { Channel } from "@mattermost/types/channels";
import type { Team } from "@mattermost/types/teams";
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

export class MattermostChannelManager {
  private channelPrefixes = {
    new: "new-",
    started: "started-",
    solved: "solved-",
  };

  private normalizeChannelName(name: string): string {
    return safeSlugify(name)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "")
      .substring(0, 64);
  }

  private getChannelName(
    ctf: CTF,
    type: "new" | "started" | "solved",
    task?: Task
  ): string {
    const prefix = this.channelPrefixes[type];
    const ctfName = this.normalizeChannelName(ctf.title);
    if (task) {
      const taskName = this.normalizeChannelName(task.title);
      return `${prefix}${ctfName}-${taskName}`.substring(0, 64);
    }
    return `${prefix}${ctfName}`.substring(0, 64);
  }

  private getTaskChannelName(
    ctf: CTF,
    task: Task,
    type: "new" | "started" | "solved"
  ): string {
    return this.getChannelName(ctf, type, task);
  }

  async createChannelsForCtf(ctf: CTF): Promise<void> {
    if (!mattermostClient.isConnected()) {
      console.error("Mattermost client is not connected");
      return;
    }

    try {
      console.log(`Creating Mattermost team and channels for CTF: ${ctf.title}`);
      
      // Create a new team for this CTF
      const team = await this.createTeamForCtf(ctf);
      
      if (!team) {
        console.error(`Failed to create team for CTF: ${ctf.title}`);
        return;
      }
      
      const teamId = team.id;
      const createdChannels: string[] = [];
      const failedChannels: string[] = [];

      // Create main discussion channel
      const challengesTalkName = this.normalizeChannelName(`talk`);
      const talkChannel = await this.createChannel(
        teamId,
        challengesTalkName,
        `Talk`,
        "O",
        `General discussion for ${ctf.title}`
      );

      if (talkChannel) {
        createdChannels.push(challengesTalkName);
      } else {
        failedChannels.push(challengesTalkName);
      }

      // Create voice channels if enabled
      if (config.mattermost.createVoiceChannels) {
        for (let i = 0; i < config.mattermost.voiceChannelsCount; i++) {
          const voiceChannelName = this.normalizeChannelName(
            `voice-${i}`
          );
          const voiceChannel = await this.createChannel(
            teamId,
            voiceChannelName,
            `Voice ${i}`,
            "O",
            `Voice channel ${i} for ${ctf.title}`
          );

          if (voiceChannel) {
            createdChannels.push(voiceChannelName);
          } else {
            failedChannels.push(voiceChannelName);
          }
        }
      }

      if (failedChannels.length > 0) {
        console.error(
          `Failed to create channels for CTF ${ctf.title}: ${failedChannels.join(", ")}`
        );
      }

      if (createdChannels.length > 0) {
        console.log(
          `Successfully created channels for CTF ${ctf.title}: ${createdChannels.join(", ")}`
        );
      }
    } catch (error) {
      console.error(`Failed to create channels for CTF ${ctf.title}:`, error);
    }
  }

  async createChannelForTask(task: Task, ctf: CTF): Promise<void> {
    if (!mattermostClient.isConnected()) {
      console.error("Mattermost client is not connected");
      return;
    }

    // Get the team for this CTF
    const team = await this.getTeamForCtf(ctf);
    
    if (!team) {
      console.error(`Team not found for CTF: ${ctf.title}`);
      return;
    }
    
    const teamId = team.id;

    try {
      console.log(`Creating Mattermost channel for task: ${task.title}`);

      let channelType: "new" | "started" | "solved" = "new";
      if (task.flag && task.flag !== "") {
        channelType = "solved";
      }

      const channelName = this.getTaskChannelName(ctf, task, channelType);
      const displayName = `${task.title}`;
      const description = `Task: ${task.title}\n${task.description}\n\nCTFNote: ${this.getTaskUrl(ctf, task)}`;

      await this.createChannel(
        teamId,
        channelName,
        displayName,
        "O",
        description
      );

      console.log(`Successfully created channel for task: ${task.title}`);
    } catch (error) {
      console.error(`Failed to create channel for task ${task.title}:`, error);
    }
  }

  async moveTaskChannel(
    task: Task,
    ctf: CTF,
    targetType: "started" | "solved"
  ): Promise<void> {
    if (!mattermostClient.isConnected()) {
      console.error("Mattermost client is not connected");
      return;
    }

    const client = mattermostClient.getClient();
    
    // Get the team for this CTF
    const team = await this.getTeamForCtf(ctf);
    
    if (!team) {
      console.error(`Team not found for CTF: ${ctf.title}`);
      return;
    }
    
    const teamId = team.id;

    try {
      // Find existing channel with any prefix
      const existingChannels = await Promise.all([
        this.findChannel(teamId, this.getTaskChannelName(ctf, task, "new")),
        this.findChannel(teamId, this.getTaskChannelName(ctf, task, "started")),
        this.findChannel(teamId, this.getTaskChannelName(ctf, task, "solved")),
      ]);

      const existingChannel = existingChannels.find((c) => c !== null);

      if (!existingChannel) {
        console.error(`Channel not found for task: ${task.title}`);
        return;
      }

      // Update channel name to reflect new status
      const newChannelName = this.getTaskChannelName(ctf, task, targetType);

      await client.patchChannel(existingChannel.id, {
        name: newChannelName,
        display_name: `[${targetType.toUpperCase()}] ${task.title}`,
      });

      console.log(`Moved task ${task.title} to ${targetType} status`);
    } catch (error) {
      console.error(`Failed to move task channel ${task.title}:`, error);
    }
  }

  private async createChannel(
    teamId: string,
    name: string,
    displayName: string,
    type: "O" | "P" = "O",
    purpose?: string
  ): Promise<Channel | null> {
    try {
      const client = mattermostClient.getClient();

      // Check if channel already exists
      const existingChannel = await this.findChannel(teamId, name);

      if (existingChannel) {
        console.log(`Channel ${name} already exists`);
        return existingChannel;
      }

      const channel = await client.createChannel({
        team_id: teamId,
        name: name,
        display_name: displayName,
        type: type,
        purpose: purpose || displayName,
      });

      console.log(
        `Created channel: ${name} (ID: ${channel.id}, Display: ${channel.display_name})`
      );
      return channel;
    } catch (error) {
      console.error(`Failed to create channel ${name}:`, error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
      }

      // Check for Mattermost API error structure
      const mattermostError = error as {
        server_error_id?: string;
        status_code?: number;
        message?: string;
      };

      if (mattermostError.server_error_id) {
        console.error(
          `Mattermost error ID: ${mattermostError.server_error_id}`
        );
      }
      if (mattermostError.status_code) {
        console.error(`HTTP status code: ${mattermostError.status_code}`);

        // Common issues
        if (mattermostError.status_code === 401) {
          console.error("Authentication failed - check Mattermost credentials");
        } else if (mattermostError.status_code === 403) {
          console.error(
            "Permission denied - user may not have permission to create channels"
          );
        } else if (mattermostError.status_code === 404) {
          console.error(
            "Team not found - check MATTERMOST_TEAM_NAME configuration"
          );
        }
      }

      return null;
    }
  }

  private async findChannel(
    teamId: string,
    name: string
  ): Promise<Channel | null> {
    try {
      const client = mattermostClient.getClient();
      const channel = await client.getChannelByName(teamId, name);
      return channel;
    } catch (error) {
      // Channel doesn't exist, which is fine
      return null;
    }
  }

  private getTaskUrl(ctf: CTF, task: Task): string {
    if (!config.pad.domain) return "";

    const ssl = config.pad.useSSL === "false" ? "" : "s";
    return `http${ssl}://${config.pad.domain}/#/ctf/${ctf.id}-${safeSlugify(
      ctf.title
    )}/task/${task.id}`;
  }
  
  private async createTeamForCtf(ctf: CTF): Promise<Team | null> {
    try {
      const client = mattermostClient.getClient();
      const teamName = this.normalizeChannelName(ctf.title);
      
      // Check if team already exists
      const existingTeam = await this.getTeamForCtf(ctf);
      if (existingTeam) {
        console.log(`Team ${teamName} already exists for CTF: ${ctf.title}`);
        return existingTeam;
      }
      
      // Create new team
      const team = await client.createTeam({
        name: teamName,
        display_name: ctf.title,
        type: 'O' as const, // Open team
        description: ctf.description || `Team for CTF: ${ctf.title}`,
      } as Team);
      
      console.log(`Created team: ${team.name} (ID: ${team.id})`);
      return team;
    } catch (error) {
      console.error(`Failed to create team for CTF ${ctf.title}:`, error);
      return null;
    }
  }
  
  private async getTeamForCtf(ctf: CTF): Promise<Team | null> {
    try {
      const client = mattermostClient.getClient();
      const teamName = this.normalizeChannelName(ctf.title);
      
      // Try to get the team by name
      const team = await client.getTeamByName(teamName);
      return team;
    } catch (error) {
      // Team doesn't exist
      return null;
    }
  }
}

export const mattermostChannelManager = new MattermostChannelManager();
