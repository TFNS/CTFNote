<template>
  <div class="q-col-gutter-md">
    <div class="row q-mb-md q-col-gutter-md items-center">
      <div class="col-12 col-md">
        <q-btn icon="add" color="positive" label="import" @click="showImportDialog = true" />
      </div>
      <q-space />

      <div class="col col-md-auto">
        <q-checkbox v-model="denseMode" label="Dense" left-label></q-checkbox>
      </div>
      <div class="col col-md-auto">
        <q-checkbox v-model="hideSolved" label="Hide solved" left-label></q-checkbox>
      </div>
      <div class="col col-md">
        <q-select v-model="categoryFilter" :options="categories" use-chips multiple label="By Category" emit-value />
      </div>
      <div class="col col-md-auto">
        <q-input v-model="filter" label="search">
          <template v-slot:append> <q-icon name="search" /> </template>
        </q-input>
      </div>
    </div>

    <div class="row col-12 q-col-gutter-sm" :class="{ 'q-col-gutter-md': !denseMode }">
      <Task
        v-on:delete-task="askForDelete(task)"
        v-on:edit-task="editTask(task)"
        v-on:filter-category="c => filterCategory(c)"
        :denseMode="denseMode"
        :categories="categories"
        :ctf="ctf"
        :task="task"
        :key="idx"
        v-for="[idx, task] in tasks.entries()"
      />
    </div>
    <q-dialog v-model="showImportDialog">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">Import tasks</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select label="Import Type" v-model="currentParser" :options="parserOptions" />
        </q-card-section>

        <q-card-section>
          <q-input label="import" type="textarea" v-model="importData" :hint="hint" />
        </q-card-section>
        <q-card-section>
          <q-btn label="parse" color="positive" @click="parseTasks" />
        </q-card-section>
        <q-card-section v-if="parsedTasks.length">
          <q-table dense hide-bottom :pagination="{ rowsPerPage: 0 }" :data="parsedTasks"></q-table>
        </q-card-section>
        <q-card-actions class="row justify-end">
          <q-btn color="positive" :disabled="parsedTasks.length == 0" label="import" @click="importTasks" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showEditTask">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">Edit {{ editForm.originalTitle }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input label="Title" v-model="editForm.title" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <AutoCompleteInput label="Category" v-model="editForm.category" :choices="categories" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input  label="Description" v-model="editForm.description" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-checkbox label="Solved" left-label v-model="editForm.solved" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input label="Flag" :disable="!editForm.solved" v-model="editForm.flag" />
        </q-card-section>
        <q-card-actions class="row justify-end">
          <q-btn color="warning" label="Cancel" v-close-popup />
          <q-btn color="positive" label="Edit" @click="doEditTask(editForm)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { colorHash, showErrors } from "../utils";
import parsers from "../utils/taskParser.js";
import Task from "./Task.vue";
import AutoCompleteInput from "./AutoCompleteInput.vue";
export default {
  components: { Task, AutoCompleteInput },
  props: {
    ctf: Object
  },
  computed: {
    hint() {
      return this.currentParser ? this.currentParser.value.hint : "";
    },
    categories() {
      return [...new Set(this.ctf.tasks.map(t => t.category))];
    },
    categoryShadowText() {
      return "test";
    },
    tasks() {
      const f = this.filter.toLowerCase();

      function deepFilter(obj) {
        if (!obj) return false;

        for (const v of Object.values(obj)) {
          if (typeof v == "object") {
            if (deepFilter(v)) {
              return true;
            }
          }
          if (`${v}`.toLowerCase().includes(f)) {
            return true;
          }
        }
        return false;
      }
      return this.ctf.tasks
        .filter(task => {
          if (this.hideSolved && task.solved) {
            return false;
          }

          if (this.categoryFilter.length && !this.categoryFilter.includes(task.category)) {
            return false;
          }

          return deepFilter(task);
        })
        .sort((a, b) => {
          if (a.category == b.category) {
            return a.title == b.title ? 0 : a.title < b.title ? -1 : 1;
          }
          return a.category < b.category ? -1 : 1;
        });
    }
  },
  data() {
    const hideSolved = JSON.parse(localStorage.getItem("hideSolved") || "false");
    const denseMode = JSON.parse(localStorage.getItem("denseMode") || "false");

    const parserOptions = [];
    for (const parser of parsers) {
      parserOptions.push({
        label: parser.name,
        value: parser
      });
    }
    return {
      showEditTask: false,
      parserOptions,
      denseMode,
      importData: "",
      parsedTasks: [],
      categoryFilter: [],
      currentParser: parserOptions[0],
      showImportDialog: false,
      hideSolved,
      filter: "",
      editForm: {}
    };
  },
  watch: {
    hideSolved(v) {
      localStorage.setItem("hideSolved", v);
    },
    denseMode(v) {
      localStorage.setItem("denseMode", v);
    }
  },
  methods: {
    filterCategory(cat){
      console.log(cat)
      this.categoryFilter = [cat]
    },
    processCategoryShadow() {},
    editTask(task) {
      this.editForm = {
        slug: task.slug,
        originalTitle: task.title,
        title: task.title,
        description: task.description,
        category: task.category,
        flag: task.flag,
        solved: task.solved
      };
      this.showEditTask = true;
    },
    async doEditTask(taskForm) {
      const errors = await this.$store.dispatch("updateTask", [taskForm.slug, taskForm]);
      if (errors) {
        showErrors(this, errors);
      } else {
        this.showEditTask = false;
      }
    },
    parseTasks() {
      const parsedTasks = this.currentParser.value.parse(this.importData);
      for (const task of parsedTasks) {
        task["Exists already"] = Boolean(this.ctf.tasks.find(t => t.title == task.title));
      }
      this.parsedTasks = parsedTasks;
    },
    async importTasks() {
      const errors = await this.$store.dispatch("importTasks", this.parsedTasks);
      if (!errors) {
        this.showImportDialog = false;
      }
      showErrors(this, errors);
    },
    async askForDelete(task) {
      this.$q
        .dialog({
          title: `Delete ${task.title} ?`,
          message: `The corresponding pad will not be deleted`,
          cancel: true,
          ok: {
            label: "Delete",
            color: "negative"
          }
        })
        .onOk(async () => {
          const errors = await this.$store.dispatch("deleteTask", task.slug);
          showErrors(this, errors);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  min-width: calc(min(600px, 90vw));
}
</style>
