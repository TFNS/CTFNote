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
            /> </template
        ></q-select>
      </div>
      <div class="col col-auto">
        <q-checkbox v-model="hideSolved" label="Hide solved" />
      </div>
      <q-space />
      <div class="col col-1">
        <q-select
          v-model="displayMode"
          label="display"
          :options="['classic', 'dense', 'ultradense']"
        />
      </div>
    </div>
    <div
      class="row q-gutter-sm"
      :class="{ 'q-gutter-md': displayMode == 'classic' }"
    >
      <q-intersection
        v-for="task of filteredTasks"
        v-show="showTask(task)"
        :key="task.id"
        once
        transition="fade"
        class="col col-grow item"
        :class="`display-${displayMode}`"
      >
        <task-card
          :display-mode="displayMode"
          :task="task"
          :ctf="ctf"
          @filter-category="filterCategory"
          @edit-task="editTask(task)"
          @solve-task="solveTask(task)"
          @delete-task="askDeleteTask(task)"
          @start-work-on-task="startWorkOnTasK(task)"
          @stop-work-on-task="stopWorkOnTasK(task)"
        />
      </q-intersection>
      <div v-if="filteredTasks.length == 0" class="text-center col">
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
import { Ctf, Task } from 'src/ctfnote';
import {
  openCreateTaskDialog,
  openEditTaskDialog,
  openImportTaskDialog,
} from 'src/ctfnote/dialog';
import {
  useDeleteTask,
  useStartWorkingOn,
  useStopWorkingOn,
  useUpdateTask,
} from 'src/ctfnote/tasks';
import { useStoredSettings } from 'src/extensions/storedSettings';
import { defineComponent, ref } from 'vue';
import TaskCard from './TaskCard.vue';

export default defineComponent({
  components: { TaskCard },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const { makePersistant } = useStoredSettings();
    return {
      deleteTask: useDeleteTask(),
      updateTask: useUpdateTask(),
      startWorkingOn: useStartWorkingOn(),
      stopWorkingOn: useStopWorkingOn(),
      displayMode: makePersistant('task-display-mode', ref('classic')),
      hideSolved: makePersistant('task-hide-solved', ref(false)),
      filter: ref(''),
      categoryFilter: ref<string[]>([]),
    };
  },
  computed: {
    tasks() {
      return this.ctf.tasks;
    },
    categories() {
      return [...new Set(this.tasks.map((t) => t.category))];
    },
    filteredTasks() {
      const tasks = this.tasks;
      return tasks.slice().sort((a, b) => {
        const acat = (a.category ?? '').toLowerCase();
        const bcat = (b.category ?? '').toLowerCase();
        if (acat == bcat) {
          const atitle = a.title.toLowerCase();
          const btitle = a.title.toLowerCase();
          return atitle == btitle ? 0 : atitle < btitle ? -1 : 1;
        }
        return acat < bcat ? -1 : 1;
      });
    },
  },
  methods: {
    showTask(task: Task) {
      const needle = this.filter.toLowerCase();
      // Hide solved task if hideSolved == true
      if (this.hideSolved && task.solved) return false;

      // Hide task if there is a filter and category not in filter
      const catFilter = this.categoryFilter;
      if (catFilter.length && !catFilter.includes(task.category ?? '')) {
        return false;
      }

      // Filter using needle on title, category and description
      const fields = ['title', 'category', 'description'] as const;

      const checkField = (f: typeof fields[number]): boolean =>
        task[f]?.toLowerCase().includes(needle) ?? false;

      return fields.some((name) => checkField(name));
    },
    filterCategory(category: string) {
      if (!this.categoryFilter.includes(category)) {
        this.categoryFilter.push(category);
      }
    },
    editTask(task: Task) {
      openEditTaskDialog(task);
    },
    solveTask(task: Task) {
      this.$q
        .dialog({
          title: 'Flag:',
          cancel: true,
          prompt: {
            model: task.flag ?? '',
            type: 'text',
          },
          color: 'primary',
        })
        .onOk((flag: string) => {
          void this.updateTask(task, { flag });
        });
    },
    openCreateTaskDialog(ctf: Ctf) {
      openCreateTaskDialog(ctf);
    },
    openImportTaskDialog() {
      openImportTaskDialog(this.ctf, this.tasks);
    },
    askDeleteTask(task: Task) {
      this.$q
        .dialog({
          title: `Delete ${task.title} ?`,
          color: 'negative',
          message: 'This will delete all the tasks, but not the pads.',
          ok: 'Delete',
          cancel: true,
        })
        .onOk(() => {
          void this.deleteTask(task);
        });
    },
    startWorkOnTasK(task: Task) {
      void this.startWorkingOn(task);
    },
    stopWorkOnTasK(task: Task) {
      void this.stopWorkingOn(task);
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  min-width: 200px;
  &.display-ultradense {
    min-height: 68px;
  }
  &.display-dense {
    min-height: 140px;
  }
  &.display-classic {
    min-height: 208px;
  }
}
</style>
