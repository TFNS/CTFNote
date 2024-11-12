import { CreateCtf } from "./commands/createCtf";
import { ArchiveCtf } from "./commands/archiveCtf";
import { SolveTask } from "./commands/solveTask";
import { LinkUser } from "./commands/linkUser";
import { StartWorking, StopWorking } from "./commands/workingOn";
import { DeleteCtf } from "./commands/deleteCtf";
import { Register } from "./commands/register";

export default [
  ArchiveCtf,
  CreateCtf,
  SolveTask,
  LinkUser,
  StartWorking,
  StopWorking,
  DeleteCtf,
  Register,
];
