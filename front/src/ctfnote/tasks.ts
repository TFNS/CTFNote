import {
  CreateTaskInput,
  TaskPatch,
  useCreateTaskForCtfIdMutation,
  useDeleteTaskMutation,
  useStartWorkingOnMutation,
  useStopWorkingOnMutation,
  useSubscribeToTaskSubscription,
  useUpdateTaskMutation,
} from 'src/generated/graphql';
import { Ctf, Task } from '.';

/* Mutations */
export async function createTask(
  ctf: Ctf,
  task: Omit<CreateTaskInput, 'ctfId'>
) {
  const { mutate: doCreateTask } = useCreateTaskForCtfIdMutation({});
  return doCreateTask({ ...task, ctfId: ctf.id });
}

export async function deleteTask(task: Task) {
  const { mutate: doDeleteTask } = useDeleteTaskMutation({});
  return doDeleteTask({ id: task.id });
}

export async function updateTask(task: Task, patch: TaskPatch) {
  const { mutate: doUpdateTask } = useUpdateTaskMutation({});
  return doUpdateTask({ id: task.id, ...patch });
}


export async function startWorkingOn(task:Task){
  const {mutate: doStartWorking} = useStartWorkingOnMutation({})
  return doStartWorking({taskId: task.id})
}

export async function stopWorkingOn(task:Task){
  const {mutate: doStopWorking} = useStopWorkingOnMutation({})
  return doStopWorking({taskId: task.id})
}

/* Subscriptions  */

export function watchTask(task: Task) {
  useSubscribeToTaskSubscription({ topic: `update:tasks:${task.id}` });
}
