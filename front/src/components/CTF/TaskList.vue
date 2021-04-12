<template>
  <div>
    <div class="row col-12 q-mb-md q-gutter-md items-end">
      <div class="col col-3">
        <q-input v-model="filter" label="search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col col-3">
        <q-select v-model="categoryFilter" :options="categories" use-chips multiple label="By Category" emit-value />
      </div>
      <div class="col col-auto">
        <q-checkbox v-model="$localStorage.hideSolved" label="Hide solved" />
      </div>
      <q-space />
      <div class="col col-1">
        <q-select label="display" v-model="$localStorage.displayMode" :options="['classic', 'dense', 'ultradense']" />
      </div>
    </div>
    <div class="row col-12 q-col-gutter-sm" :class="{ 'q-col-gutter-md': $localStorage.displayMode == 'classic' }">
      <task-card
        v-on:filter-category="filterCategory"
        v-on:start-work-on-task="startWorkOnTask(task)"
        v-on:stop-work-on-task="stopWorkOnTask(task)"
        v-on:solve-task="solveTask(task)"
        v-on:delete-task="deleteTask(task)"
        v-on:edit-task="editTask(task)"
        :displayMode="$localStorage.displayMode"
        :categories="categories"
        :ctf="ctf"
        :task="task"
        :key="idx"
        v-for="[idx, task] in filteredTasks.entries()"
      />
      <div class="text-center col" v-if="filteredTasks.length ==0">No tasks :(</div>
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
        <q-fab-action color="positive" push @click="openCreateDialog" icon="add" label="Create" />
        <q-fab-action color="secondary" push @click="openImportDialog" icon="flag" label="Import " />
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import ImportTasksDialog from "../Dialogs/ImportTasksDialog.vue";
import db from "src/gql";
import TaskCard from "../TaskCard.vue";
import EditTaskDialog from "../Dialogs/EditTaskDialog.vue";

export default {
  components: { TaskCard },
  props: {
    ctf: Object,
  },
  localStorage: {
    displayMode: {
      type: String,
      default: "classic",
    },
    hideSolved: {
      type: Boolean,
      default: false,
    },
  },
  apollo: {
    tasks: {
      query: db.task.ALL,
      variables() {
        return { ctfId: this.ctf.id };
      },
      update: (data) => data.tasks.nodes,
    },
  },
  computed: {
    filteredTasks() {
      const tasks = this.tasks || [];

      const needle = this.filter.toLowerCase();

      return tasks
        .filter((task) => {
          if (this.$localStorage.hideSolved && task.solved) {
            return false;
          }

          if (this.categoryFilter.length && !this.categoryFilter.includes(task.category)) {
            return false;
          }
          const checkField = (f) => task[f]?.toLowerCase().includes(needle);

          return checkField("title") || checkField("category") || checkField("description");
        })
        .sort((a, b) => {
          if (a.category == b.category) {
            return a.title == b.title ? 0 : a.title < b.title ? -1 : 1;
          }
          return a.category < b.category ? -1 : 1;
        });
    },
    categories() {
      const tasks = this.tasks || [];
      return [...new Set(tasks.map((t) => t.category))];
    },
  },
  data() {
    return { categoryFilter: [], filter: "" };
  },
  methods: {
    openImportDialog() {
      this.$q.dialog({
        component: ImportTasksDialog,
        ctfId: this.ctf.id,
        tasks: this.tasks,
        parent: this,
      });
    },
    openCreateDialog() {
      this.$q.dialog({
        component: EditTaskDialog,
        ctfId: this.ctf.id,
        parent: this,
      });
    },
    solveTask(task) {
      this.$q
        .dialog({
          title: "Flag:",
          cancel: true,
          prompt: {
            model: task.flag,
            type: "text",
          },
          color: "primary",
        })
        .onOk((flag) => {
          this.$apollo.mutate({
            mutation: db.task.UPDATE,
            variables: { id: task.id, flag },
          });
        });
    },
    filterCategory(category) {
      this.categoryFilter = [category];
    },
    editTask(task) {
      this.$q.dialog({
        component: EditTaskDialog,
        parent: this,
        task,
      });
    },
    startWorkOnTask(task) {
      this.$apollo.mutate({
        mutation: db.task.START_WORKING,
        variables: {
          taskId: task.id,
        },
        update: (store, response) => {
          const workOn = response.data.startWorkingOn.workOnTask;
          const query = {
            query: db.task.ALL,
            variables: { ctfId: this.ctf.id },
          };
          const data = store.readQuery(query);
          const t = data.tasks.nodes.find((n) => n.id == task.id);
          t.workOnTasks.nodes.push(workOn);
          store.writeQuery({ ...query, data });
        },
      });
    },
    stopWorkOnTask(task) {
      this.$apollo.mutate({
        mutation: db.task.STOP_WORKING,
        variables: {
          taskId: task.id,
        },
        update: (store, response) => {
          const deletedNode = response.data.stopWorkingOn.workOnTask.nodeId;
          const query = {
            query: db.task.ALL,
            variables: { ctfId: this.ctf.id },
          };
          const data = store.readQuery(query);
          const t = data.tasks.nodes.find((n) => n.id == task.id);
          t.workOnTasks.nodes = task.workOnTasks.nodes.filter((n) => n.nodeId != deletedNode);
          store.writeQuery({ ...query, data });
        },
      });
    },
    deleteTask(task) {
      this.$q
        .dialog({
          title: `Delete ${task.title} ?`,
          message: `The corresponding pad will not be deleted`,
          cancel: true,
          ok: {
            label: "Delete",
            color: "negative",
          },
        })
        .onOk(async () => {
          this.$apollo.mutate({
            mutation: db.task.DELETE,
            variables: {
              id: task.id,
            },
            update: (
              store,
              {
                data: {
                  deleteTask: { deletedTaskNodeId },
                },
              }
            ) => {
              const query = {
                query: db.task.ALL,
                variables: { ctfId: this.ctf.id },
              };
              const data = store.readQuery(query);
              data.tasks.nodes = data.tasks.nodes.filter((n) => n.nodeId != deletedTaskNodeId);
              store.writeQuery({ ...query, data });
            },
          });
        });
    },
  },
};
</script>
