import { Command } from "./command";
import { CreateCtf } from "./commands/createCtf";
import { ArchiveCtf } from "./commands/archiveCtf";
import { SolveTask } from "./commands/solveTask";

export const Commands: Command[] = [ArchiveCtf, CreateCtf, SolveTask];
