import { Task } from 'src/ctfnote/models';
import { InjectionKey } from 'vue';

export default {
  solveTaskPopup: <InjectionKey<(task: Task) => void>>Symbol('solveTask'),
  deleteTaskPopup: <InjectionKey<(task: Task) => void>>Symbol('deleteTask'),
  editTaskPopup: <InjectionKey<(task: Task) => void>>Symbol('editTask'),
  isTaskVisible: <InjectionKey<(task: Task) => boolean>>Symbol('isTaskVisible'),
  filterCategory: <InjectionKey<(cat: string) => void>>Symbol('filterCategory'),
};
