import { Command } from "./command";
import { CreateCtf } from "./commands/createCtf";
import { ArchiveCtf } from "./commands/archiveCtf";
import { SolveTask } from "./commands/solveTask";
import { LinkUser } from "./commands/linkUser";
import { StartWorking, StopWorking } from "./commands/workingOn";
import { DeleteCtf } from "./commands/deleteCtf";
import { Register } from "./commands/register";

export const Commands: Command[] = [
  ArchiveCtf,
  CreateCtf,
  SolveTask,
  LinkUser,
  StartWorking,
  StopWorking,
  DeleteCtf,
  Register,
];
