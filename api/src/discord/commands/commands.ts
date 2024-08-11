import { Command } from "./command";
import { CreateCtf } from "./createCtf";
import { ArchiveCtf } from "./archiveCtf";
import { SolveTask } from "./solveTask";
import { LinkUser } from "./linkUser";
import { StartWorking, StopWorking } from "./workingOn";
import { DeleteCtf } from "./deleteCtf";
import { Register } from "./register";

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
