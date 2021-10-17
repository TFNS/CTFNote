import { QVueGlobals } from 'quasar';
import EditCtfDialog from 'src/components/Dialogs/EditCtfDialog.vue';
import TaskEditDialog from 'src/components/Dialogs/TaskEditDialog.vue';
import TaskImportDialog from 'src/components/Dialogs/TaskImportDialog.vue';
import { CreateTaskInput, CtfPatch, TaskPatch } from 'src/generated/graphql';
import {
  createCtf, deleteCtf, importCtf,
  updateCtf, updateCtfCredentials
} from './ctfs';
import { Ctf, Task } from './models';
import { createTask, deleteTask, updateTask } from './tasks';

function parseCtftimeId(s: string): number | null {
  const url = s.trim();
  const idReg = new RegExp(/^\d+$/);
  const urlReg = new RegExp(/^https:\/\/ctftime\.org\/event\/(\d+)\/?$/);
  if (idReg.exec(url)) {
    return parseInt(url);
  }
  const match = urlReg.exec(url);
  if (!match) return null;
  return parseInt(match[1]);
}

let $q = {} as QVueGlobals;

export function provideQuasar(quasar: QVueGlobals) {
  $q = quasar;
}

/* Notify */

type Position =
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | undefined;

export function notify(
  message: string,
  color = 'positive',
  position: Position = 'top-right'
) {
  $q.notify({
    message,
    color,
    timeout: 2500,
    position,
    actions: [{ icon: 'close', color: 'white' }],
  });
}

export function notifyError(err: Error) {
  notify(err.message, 'negative', 'top');
}

/* CTF */

export function openCreateCtfDialog() {
  $q.dialog({
    component: EditCtfDialog,
  }).onOk((ctf: Ctf) => {
    void createCtf(ctf);
  });
}

export function openImportCtfDialog() {
  $q.dialog({
    title: 'Import CTF',
    color: 'secondary',
    message: 'Enter CTF Time url or id',
    prompt: {
      model: '',
      isValid: (val: string) => parseCtftimeId(val) != null,
    },
    cancel: true,
  }).onOk((data: string) => {
    const ctfId = parseCtftimeId(data);
    if (ctfId === null) return;
    void importCtf(ctfId);
  });
}

export const openEditCtfDialog = (ctf: Ctf) => {
  $q.dialog({
    component: EditCtfDialog,
    componentProps: {
      ctf,
    },
  }).onOk((patch: CtfPatch) => {
    void updateCtf(ctf, patch);
  });
};

export function openDeleteCtfDialog(ctf: Ctf) {
  $q.dialog({
    title: `Delete ${ctf.title} ?`,
    color: 'negative',
    message: 'This will delete all the tasks, but not the pads.',
    ok: 'Delete',
    cancel: true,
  }).onOk(() => {
    void deleteCtf(ctf);
  });
}

export function openEditCtfCredentials(ctf: Ctf, credentials: string) {
  $q.dialog({
    title: 'Edit credentials',
    color: 'primary',
    prompt: {
      model: credentials,
      type: 'textarea',
    },
    cancel: true,
  }).onOk((credentials: string) => {
    void updateCtfCredentials(ctf, credentials);
  });
}

/* Tasks */

export function openCreateTaskDialog(ctf: Ctf) {
  $q.dialog({
    component: TaskEditDialog,
    componentProps: {
      ctfId: ctf.id,
    },
  }).onOk((task: CreateTaskInput) => {
    void createTask(ctf, task);
  });
}

export function openEditTaskDialog(task: Task) {
  $q.dialog({
    component: TaskEditDialog,
    componentProps: {
      task,
    },
  }).onOk((patch: TaskPatch) => {
    void updateTask(task, patch);
  });
}

export function openDeleteTaskDialog(task: Task) {
  $q.dialog({
    title: `Delete ${task.title} ?`,
    color: 'negative',
    message: 'This will delete all the tasks, but not the pads.',
    ok: 'Delete',
    cancel: true,
  }).onOk(() => {
    void deleteTask(task);
  });
}

export function openImportTaskDialog(ctf: Ctf, tasks: readonly Task[] = []) {
  $q.dialog({
    component: TaskImportDialog,
    componentProps: {
      ctf: ctf,
      tasks: tasks,
    },
  });
}

export function openFlagTaskDialog(task: Task) {
  $q.dialog({
    title: 'Flag:',
    cancel: true,
    prompt: {
      model: task.flag ?? '',
      type: 'text',
    },
    color: 'primary',
  }).onOk((flag: string) => {
    void updateTask(task, { flag });
  });
}
