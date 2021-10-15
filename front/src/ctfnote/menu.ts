import { ref } from 'vue';
import { Ctf, Task } from './models';

export interface CtfNoteMenu {
  openCtf: (ctf: Ctf) => void;
  openTask: (task: Task) => void;
  onMenuChange: (handler: OnMenuChangeHandler, immediate?: boolean) => void;
}

type OnMenuChangeHandler = (ctf: Ctf | null, task: Task | null) => void;

const callbacks: OnMenuChangeHandler[] = [];

const currentCtf = ref<Ctf | null>(null);
const currentTask = ref<Task | null>(null);

export function onMenuChange(handler: OnMenuChangeHandler, immediate = false) {
  callbacks.push(handler);
  if (immediate) {
    handler(currentCtf.value, currentTask.value);
  }
}

export function openCtf(ctf: Ctf) {
  currentCtf.value = ctf;
  callbacks.forEach((c) => c(ctf, currentTask.value));
}

export function openTask(task: Task) {
  currentTask.value = task;
  callbacks.forEach((c) => c(currentCtf.value, task));
}
