<template>
  <div>
    <div class="row q-mb-md q-gutter-md items-center">
      <div class="col col-3">
        <q-input v-model="filter" label="search">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col col-3 col-grow">
        <q-select
          v-model="categoryFilter"
          :options="categories"
          use-chips
          multiple
          label="Filter by category"
          emit-value
        >
          <template v-if="categoryFilter.length" #append>
            <q-icon
              name="cancel"
              class="cursor-pointer"
              @click.stop="categoryFilter = []"
            />
          </template>
        </q-select>
      </div>
      <div class="col col-auto">
        <q-checkbox v-model="hideSolved" label="Hide solved" />
        <q-checkbox v-model="myTasks" label="Show my tasks" />
      </div>
      <q-space />
      <div class="col col-1">
        <q-select
          v-model="displayMode"
          label="Display"
          :options="displayOptions"
        />
      </div>
    </div>

    <template v-if="sortedTasks.length">
      <task-cards
        v-if="useCard"
        :ctf="ctf"
        :tasks="sortedTasks"
        :display-mode="displayMode"
      />
      <task-table v-else :ctf="ctf" :tasks="sortedTasks" />
    </template>
    <div v-else class="text-center col">
      <div class="row q-gutter-md justify-center">
        <q-btn
          icon="add"
          label="Create Task"
          color="positive"
          @click="openCreateTaskDialog(ctf)"
        />
        <q-btn
          icon="flag"
          label="Import Task"
          color="secondary"
          @click="openImportTaskDialog"
        />
      </div>
    </div>

    <q-page-sticky position="top-right" :offset="[18, 8]">
      <q-fab
        class="ctfs-action-btn shadow-2"
        padding="10px"
        color="positive"
        icon="add"
        direction="down"
        vertical-actions-align="right"
        push
      >
        <q-fab-action
          color="positive"
          push
          icon="add"
          label="Create"
          @click="openCreateTaskDialog(ctf)"
        />
        <q-fab-action
          color="secondary"
          push
          icon="flag"
          label="Import "
          @click="openImportTaskDialog"
        />
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script lang="ts">
import { Ctf, Task } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { useStoredSettings } from 'src/extensions/storedSettings';
import { defineComponent, ref, provide } from 'vue';
import TaskEditDialogVue from '../Dialogs/TaskEditDialog.vue';
import TaskImportDialogVue from '../Dialogs/TaskImportDialog.vue';
import TaskCards from './TaskCards.vue';
import TaskTable from './TaskTable.vue';
import { useQuasar } from 'quasar';
import keys from '../../injectionKeys';

const displayOptions = ['classic', 'dense', 'ultradense', 'table'] as const;

export type DisplayMode = typeof displayOptions[number];

export default defineComponent({
  components: { TaskCards, TaskTable },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const $q = useQuasar();
    const { makePersistant } = useStoredSettings();

    const updateTask = ctfnote.tasks.useUpdateTask();
    const deleteTask = ctfnote.tasks.useDeleteTask();
    const me = ctfnote.me.injectMe();

    provide(keys.solveTaskPopup, (task: Task) => {
      $q.dialog({
        title: 'Flag:',
        color: 'primary',
        cancel: {
          label: 'cancel',
          color: 'warning',
          flat: true,
        },
        prompt: {
          model: task.flag ?? '',
          type: 'text',
        },
        ok: {
          color: 'positive',
          label: 'save',
        },
      }).onOk((flag: string) => {
        void updateTask(task, { flag });
      });
    });

    provide(keys.deleteTaskPopup, (task: Task) => {
      $q.dialog({
        title: `Delete ${task.title} ?`,
        color: 'negative',
        message: 'This will delete the task, but not the pads.',
        ok: 'Delete',
        cancel: true,
      }).onOk(() => {
        void deleteTask(task);
      });
    });

    provide(keys.editTaskPopup, (task: Task) => {
      $q.dialog({
        component: TaskEditDialogVue,
        componentProps: {
          task,
        },
      });
    });

    const filter = ref('');
    const categoryFilter = ref<string[]>([]);
    const hideSolved = makePersistant('task-hide-solved', ref(false));
    const myTasks = makePersistant('task-my-tasks', ref(false));

    provide(keys.isTaskVisible, (task: Task) => {
      const needle = filter.value.toLowerCase();
      // Hide solved task if hideSolved == true
      if (hideSolved.value && task.solved) return false;

      if (myTasks.value && task.workOnTasks.indexOf(me.value.profile.id) === -1)
        return false;

      // Hide task if there is a filter and category not in filter
      const catFilter = categoryFilter.value;
      if (catFilter.length && !catFilter.includes(task.category ?? '')) {
        return false;
      }

      // Filter using needle on title, category and description
      const fields = ['title', 'category', 'description'] as const;

      const checkField = (f: typeof fields[number]): boolean =>
        task[f]?.toLowerCase().includes(needle) ?? false;

      return fields.some((name) => checkField(name));
    });

    provide(keys.filterCategory, (category: string) => {
      if (!categoryFilter.value.includes(category)) {
        categoryFilter.value.push(category);
      }
    });

    return {
      displayMode: makePersistant('task-display-mode', ref('classic')),
      hideSolved,
      myTasks,
      filter,
      categoryFilter,
      displayOptions,
      me,
    };
  },
  computed: {
    tasks() {
      return this.ctf.tasks;
    },
    useCard() {
      return this.displayMode != 'table';
    },
    categories() {
      return [...new Set(this.tasks.map((t) => t.category))];
    },
    sortedTasks() {
      const tasks = this.tasks;
      return tasks
        .slice()
        .sort((a, b) => {
          const acat = (a.category ?? '').toLowerCase();
          const bcat = (b.category ?? '').toLowerCase();
          if (acat == bcat) {
            const atitle = a.title.toLowerCase();
            const btitle = a.title.toLowerCase();
            return atitle == btitle ? 0 : atitle < btitle ? -1 : 1;
          }
          return acat < bcat ? -1 : 1;
        })
        .sort((a, b) => {
          return a.solved ? 1 : -1;
        });
    },
  },
  methods: {
    openCreateTaskDialog(ctf: Ctf) {
      this.$q.dialog({
        component: TaskEditDialogVue,
        componentProps: {
          ctfId: ctf.id,
        },
      });
    },
    openImportTaskDialog() {
      this.$q.dialog({
        component: TaskImportDialogVue,
        componentProps: {
          ctf: this.ctf,
        },
      });
    },
  },
});
</script>
