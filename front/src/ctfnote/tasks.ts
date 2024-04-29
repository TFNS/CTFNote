import {
  CreateTaskInput,
  TaskPatch,
  WorkingOnFragment,
  useCancelWorkingOnMutation,
  useCreateTaskForCtfIdMutation,
  useDeleteTaskMutation,
  useStartWorkingOnMutation,
  useStopWorkingOnMutation,
  useUpdateTaskMutation,
} from 'src/generated/graphql';

import { Ctf, Id, Task, WorkingOn, makeId } from './models';
import { Dialog } from 'quasar';
import TaskEditDialogVue from '../components/Dialogs/TaskEditDialog.vue';
import TaskSolveDialogVue from '../components/Dialogs/TaskSolveDialog.vue';
import { ref, computed } from 'vue';

export function buildWorkingOn(w: WorkingOnFragment): WorkingOn {
  return {
    ...w,
    taskId: makeId(w.taskId),
    profileId: makeId(w.profileId),
  };
}

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

export function useCancelWorkingOn() {
  const { mutate: doCancelWorking } = useCancelWorkingOnMutation({});
  return (task: Task) => doCancelWorking({ taskId: task.id });
}

export function useSolveTaskPopup() {
  // Used to force opening at most one dialog at a time
  const openedSolveTaskPopup = ref(false);

  const lock = () => (openedSolveTaskPopup.value = true);
  const unlock = () => (openedSolveTaskPopup.value = false);
  const locked = computed(() => openedSolveTaskPopup.value);

  return (task: Task) => {
    // If the dialog is already opened, don't do anything
    if (locked.value) return;

    lock();

    Dialog.create({
      component: TaskSolveDialogVue,
      componentProps: {
        task,
      },
    })
      .onOk(unlock)
      .onCancel(unlock)
      .onDismiss(unlock);
  };
}

export function useDeleteTaskPopup() {
  const deleteTask = useDeleteTask();
  return (task: Task) => {
    Dialog.create({
      title: `Delete ${task.title}?`,
      color: 'primary',
      class: 'compact-dialog',
      message: 'This will delete the task, but not the pads.',
      cancel: {
        label: 'Cancel',
        flat: true,
      },
      ok: {
        color: 'negative',
        label: 'Delete',
        flat: true,
      },
    }).onOk(() => {
      void deleteTask(task);
    });
  };
}

export function useEditTaskPopup() {
  return (task: Task) => {
    Dialog.create({
      component: TaskEditDialogVue,
      componentProps: {
        task,
      },
    });
  };
}
