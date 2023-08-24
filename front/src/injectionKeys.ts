import { Profile, Task } from 'src/ctfnote/models';
import { InjectionKey, Ref } from 'vue';

export default {
  solveTaskPopup: <InjectionKey<(task: Task) => void>>Symbol('solveTask'),
  deleteTaskPopup: <InjectionKey<(task: Task) => void>>Symbol('deleteTask'),
  editTaskPopup: <InjectionKey<(task: Task) => void>>Symbol('editTask'),
  isTaskVisible: <InjectionKey<(task: Task) => boolean>>Symbol('isTaskVisible'),
  filterTag: <InjectionKey<(cat: string) => void>>Symbol('filterTag'),
  team: <InjectionKey<Ref<Profile[]>>>Symbol('team'),
};
