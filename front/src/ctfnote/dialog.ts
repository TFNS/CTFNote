import { QVueGlobals } from 'quasar';
import EditCtfDialog from 'src/components/Dialogs/EditCtfDialog.vue';
import ImportCtfDialog from 'src/components/Dialogs/ImportCtfDialog.vue';
import TaskEditDialog from 'src/components/Dialogs/TaskEditDialog.vue';
import TaskImportDialog from 'src/components/Dialogs/TaskImportDialog.vue';
import { Ctf, Task } from './models';



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
  });
}

export function openImportCtfDialog() {
  $q.dialog({
    component: ImportCtfDialog,
  });
}

export const openEditCtfDialog = (ctf: Ctf) => {
  $q.dialog({
    component: EditCtfDialog,
    componentProps: {
      ctf,
    },
  });
};


/* Tasks */

export function openCreateTaskDialog(ctf: Ctf) {
  $q.dialog({
    component: TaskEditDialog,
    componentProps: {
      ctfId: ctf.id,
    },
  });
}

export function openEditTaskDialog(task: Task) {
  $q.dialog({
    component: TaskEditDialog,
    componentProps: {
      task,
    },
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
