import { Command } from "./command";
import { Hello } from "./commands/hello";
import { CreateCtf } from "./commands/createCtf";

export const Commands: Command[] = [Hello, CreateCtf];