import config from "../../config";
import { Hooks } from "../interfaces/hooks";
import { Command } from "../interfaces/command";
import { DiscordButtonInteraction } from "../interfaces/interaction";

const channelStyle = config.discord.channelHandleStyle;

export async function getChannelHandleStyleInteractions(): Promise<
  DiscordButtonInteraction[]
> {
  switch (channelStyle) {
    case "agile": {
      const { default: Interactions } = await import("../agile/interactions");
      return Interactions;
    }
    default:
      throw new Error(
        `Unknown channel style ${channelStyle}. Please check your configuration.`
      );
  }
}

export async function getChannelHandleStyleCommands(): Promise<Command[]> {
  switch (channelStyle) {
    case "agile": {
      const { default: Interactions } = await import("../agile/commands");
      return Interactions;
    }
    default:
      throw new Error(
        `Unknown channel style ${channelStyle}. Please check your configuration.`
      );
  }
}

export async function getChannelHandleStyleHooks(): Promise<Hooks> {
  switch (channelStyle) {
    case "agile": {
      const { default: Hooks } = await import("../agile/hooks");
      return Hooks;
    }
    default:
      throw new Error(
        `Unknown channel style ${channelStyle}. Please check your configuration.`
      );
  }
}
