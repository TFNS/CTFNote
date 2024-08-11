import { DiscordButtonInteraction } from "../interfaces/interaction";
import { HandleArchiveCtfInteraction } from "./commands/archiveCtf";
import { HandleCreateCtfInteraction } from "./commands/createCtf";
import { HandleDeleteCtfInteraction } from "./commands/deleteCtf";

export const Interactions: DiscordButtonInteraction[] = [
  HandleCreateCtfInteraction,
  HandleDeleteCtfInteraction,
  HandleArchiveCtfInteraction,
];
