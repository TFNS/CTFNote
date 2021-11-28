import {
  CreateTaskInput,
  TaskPatch,
  useCreateTaskForCtfIdMutation,
  useDeleteTaskMutation,
  useStartWorkingOnMutation,
  useStopWorkingOnMutation,
  useUpdateTaskMutation,
} from 'src/generated/graphql';
import { Ctf, Id, Task } from './models';

/* Mutations */
export function useCreateTask() {
  const { mutate: doCreateTask } = useCreateTaskForCtfIdMutation({});
  return (ctfId: Id<Ctf>, task: Omit<CreateTaskInput, 'ctfId'>) =>
    doCreateTask({ ...task, ctfId });
}

export function useDeleteTask() {
  const { mutate: doDeleteTask } = useDeleteTaskMutation({});
  return (task: Task) => doDeleteTask({ id: task.id });
}

export function useUpdateTask() {
  const { mutate: doUpdateTask } = useUpdateTaskMutation({});
  return (task: Task, patch: TaskPatch) =>
    doUpdateTask({ id: task.id, ...patch });
}

export function useStartWorkingOn() {
  const { mutate: doStartWorking } = useStartWorkingOnMutation({});
  return (task: Task) => doStartWorking({ taskId: task.id });
}

export function useStopWorkingOn() {
  const { mutate: doStopWorking } = useStopWorkingOnMutation({});
  return (task: Task) => doStopWorking({ taskId: task.id });
}
