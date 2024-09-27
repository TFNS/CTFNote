import { HandleArchiveCtfInteraction } from "./commands/archiveCtf";
import { HandleCreateCtfInteraction } from "./commands/createCtf";
import { HandleDeleteCtfInteraction } from "./commands/deleteCtf";

export default [
  HandleCreateCtfInteraction,
  HandleDeleteCtfInteraction,
  HandleArchiveCtfInteraction,
];
