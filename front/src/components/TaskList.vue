<template>
  <div class="q-col-gutter-md">
    <div class="row q-mb-md q-col-gutter-md items-center">
      <div class="col-12 col-md">
        <q-btn icon="add" color="positive" label="import" @click="showImportDialog = true" />
      </div>
      <q-space />

      <div class="col col-md-auto">
        <q-checkbox v-model="hideSolved" label="Hide solved" left-label></q-checkbox>
      </div>
      <div class="col col-md">
        <q-select  v-model="categoryFilter" :options="categories" multiple label="By Category" emit-value />
      </div>
      <div class="col col-md-auto">
        <q-input v-model="filter" label="search">
          <template v-slot:append> <q-icon name="search" /> </template>
        </q-input>
      </div>
    </div>

    <div class="row col-12 q-col-gutter-md">
      <Task :ctf="ctf" :task="task" :key="idx" v-for="[idx, task] in tasks.entries()" />
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
  </div>
</template>

<script>
import { colorHash, showErrors } from "../utils";
import parsers from "../utils/taskParser.js";
import Task from "./Task.vue";
export default {
  components: { Task },
  props: {
    ctf: Object
  },
  computed: {
    hint() {
      return this.currentParser ? this.currentParser.value.hint : "";
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
          const s = `${v}`.toLowerCase();
          if (s.includes(f)) {
            return true;
          }
        }
        return false;
      }
      const tasks = [...this.ctf.tasks].sort((a, b) => a.id < b.id);
      return tasks
        .filter(task => {
          if (this.hideSolved && task.solved) {
            return false;
          }

          if (!this.categoryFilter.includes(task.category)) {
            return false;
          }

          return deepFilter(task);
        })
        .sort((a, b) => {
          if (a.category == b.category) {
            return (a.title == b.title) ? 0 : ((a.title < b.title) ? -1 : 1)
          }
          return (a.category < b.category) ? -1 : 1;
        });
    }
  },
  data() {
    const hideSolved = JSON.parse(localStorage.getItem("hideSolved") || "false");

    const categories = Array.from(new Set([...this.ctf.tasks.map(t => t.category)]));
    const categoryFilter = [...categories]; // by default, everything is selected

    const parserOptions = [];
    for (const parser of parsers) {
      parserOptions.push({
        label: parser.name,
        value: parser
      });
    }
    return {
      parserOptions,
      importData: "",
      parsedTasks: [],
      categories,
      categoryFilter,
      currentParser: parserOptions[0],
      showImportDialog: false,
      hideSolved,
      filter: ""
    };
  },
  watch: {
    hideSolved(v) {
      localStorage.setItem("hideSolved", v);
    }
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  min-width: calc(min(600px, 90vw));
}
</style>
