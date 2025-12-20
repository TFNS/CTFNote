import { mattermostClient } from "./client";
import { mattermostChannelManager } from "./channels";
import config from "../config";

export interface CTFEventData {
  id: bigint;
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface TaskEventData {
  id: bigint;
  ctf_id: bigint;
  title: string;
  description: string;
  flag: string;
}

export class MattermostHooks {
  async initialize(): Promise<void> {
    if (!config.mattermost.enabled) {
      console.log("Mattermost integration is disabled");
      return;
    }

    await mattermostClient.connect();

    if (!mattermostClient.isConnected()) {
      console.error(
        "Failed to initialize Mattermost hooks - client not connected"
      );
      return;
    }

    console.log("Mattermost hooks initialized successfully");
  }

  async handleCtfCreated(ctf: CTFEventData): Promise<void> {
    if (!mattermostClient.isConnected()) {
      return;
    }

    console.log(`Handling CTF created event: ${ctf.title}`);

    try {
      await mattermostChannelManager.createChannelsForCtf({
        id: ctf.id,
        title: ctf.title,
        description: ctf.description,
        startTime: ctf.startTime,
        endTime: ctf.endTime,
      });
    } catch (error) {
      console.error(
        `Failed to handle CTF created event for ${ctf.title}:`,
        error
      );
    }
  }

  async handleTaskCreated(
    task: TaskEventData,
    ctf: CTFEventData
  ): Promise<void> {
    if (!mattermostClient.isConnected()) {
      return;
    }

    console.log(`Handling task created event: ${task.title}`);

    try {
      await mattermostChannelManager.createChannelForTask(
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
    } catch (error) {
      console.error(
        `Failed to handle task created event for ${task.title}:`,
        error
      );
    }
  }

  async handleTaskStarted(
    task: TaskEventData,
    ctf: CTFEventData
  ): Promise<void> {
    if (!mattermostClient.isConnected()) {
      return;
    }

    console.log(`Handling task started event: ${task.title}`);

    try {
      await mattermostChannelManager.moveTaskChannel(
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
        },
        "started"
      );
    } catch (error) {
      console.error(
        `Failed to handle task started event for ${task.title}:`,
        error
      );
    }
  }

  async handleTaskSolved(
    task: TaskEventData,
    ctf: CTFEventData
  ): Promise<void> {
    if (!mattermostClient.isConnected()) {
      return;
    }

    console.log(`Handling task solved event: ${task.title}`);

    try {
      await mattermostChannelManager.moveTaskChannel(
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
        },
        "solved"
      );
    } catch (error) {
      console.error(
        `Failed to handle task solved event for ${task.title}:`,
        error
      );
    }
  }
}

export const mattermostHooks = new MattermostHooks();
