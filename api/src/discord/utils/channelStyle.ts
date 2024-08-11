import config from "../../config";
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
