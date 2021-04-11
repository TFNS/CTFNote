<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="import-task-dialog">
      <q-card-section class="row">
        <div class="text-h6">Import tasks</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="parse" class="full-width">
            <div>
              <q-select class="full-width" label="Import Type" v-model="currentParser" :options="parserOptions" />
              <q-input
                label="import"
                type="textarea"
                @paste.native="onPaste"
                v-model="model"
                :hint="currentParser.value.hint"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="confirm" class="full-width">
            <q-table flat dense hide-bottom :columns="columns" :pagination="pagination" :data="parsedTasks">
              <template #body-cell-keep="{ row }">
                <q-td auto-width class="text-center"><q-checkbox v-model="row['keep']" /></q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="warning" v-if="tab == 'confirm'" label="back" @click="tab = 'parse'" />
        <q-btn color="positive" :disable="btnDisable" :label="btnLabel" @click="btnClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import parsers from "../../utils/taskParser.js";
import db from "src/gql";

export default {
  props: { tasks: Array, ctfId: Number },
  computed: {
    importCount() {
      return this.parsedTasks.reduce((keep, task) => keep + task.keep, 0);
    },
    btnDisable(){
      return this.tab == "confirm" && this.importCount == 0
    },
    btnLabel() {
      if (this.tab == "parse") {
        return "Parse";
      } else {
        return `Import (${this.importCount})`;
      }
    },
  },
  methods: {
    autoDetectParser() {
      for (const parser of parsers) {
        if (parser.isValid(this.model)) {
          this.currentParser = this.parserOptions.find((opt) => opt.value == parser);
        }
      }
    },
    onPaste(ev) {
      this.$nextTick(() => this.autoDetectParser());
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    parseTasks() {
      // Get list of task {title,category} from parse
      const parsedTasks = this.currentParser.value.parse(this.model);
      // Precompute a list set task to avoid N square operation
      const hashTask = (task) => `${task.title}${task.category}`;
      const taskSet = new Set();
      for (const task of this.tasks) {
        taskSet.add(hashTask(task));
      }
      // mark already existing tasks
      this.parsedTasks = parsedTasks.map((task) => {
        const hash = hashTask(task);
        task["keep"] = !taskSet.has(hash);
        return task;
      });
    },
    btnClick() {
      if (this.tab == "parse") {
        this.parseTasks();
        this.tab = "confirm";
      } else {
        this.importTasks(this.parsedTasks.filter((t) => t.keep));
      }
    },
    async importTasks(tasks) {
      const promises = tasks.map((task) => {
        return this.$apollo.mutate({
          mutation: db.task.CREATE,
          variables: {
            ctfId: this.ctfId,
            ...task,
          },
          update: (store, { data: { createTask } }) => {
            const task = createTask.task;
            const query = {
              query: db.task.ALL,
              variables: { ctfId: this.ctfId },
            };
            const data = store.readQuery(query);
            data.tasks.nodes.push(task);
            store.writeQuery({ ...query, data });
          },
        });
      });
      await Promise.all(promises);
      this.hide();
    },
  },
  data() {
    const parserOptions = [];
    const pagination = { rowsPerPage: 0 };
    const columns = [
      { name: "title", label: "Title", field: "title" },
      { name: "category", label: "Category", field: "category" },
      { name: "keep", label: "Import task", field: "keep" },
    ];
    for (const parser of parsers) {
      parserOptions.push({
        label: parser.name,
        value: parser,
      });
    }
    return {
      model: '',
      parsedTasks: [],
      parserOptions,
      columns,
      pagination,
      tab: "parse",
      currentParser:parserOptions[0],
    };
  },
};
</script>

<style>
.import-task-dialog {
  min-width: calc(min(600px, 90vw));
}
</style>