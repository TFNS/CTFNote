import { Command } from "./command";
import { CreateCtf } from "./commands/createCtf";
import { ArchiveCtf } from "./commands/archiveCtf";

export const Commands: Command[] = [ArchiveCtf, CreateCtf];
