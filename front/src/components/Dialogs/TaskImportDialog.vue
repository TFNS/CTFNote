<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-card-section class="row">
        <div class="text-h6">Import tasks</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="parse" class="full-width">
            <div>
              <q-select
                v-model="currentParser"
                class="full-width"
                label="Import Type"
                :options="parserOptions"
              />
              <q-input
                v-model="model"
                label="import"
                type="textarea"
                :hint="currentParser.value.hint"
                @paste="onPaste"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="confirm" class="full-width">
            <q-table
              flat
              style="height: 400px"
              dense
              :columns="columns"
              :rows-per-page-options="[0]"
              :rows="parsedTasks"
            >
              <template #body-cell-keep="{ row }">
                <q-td auto-width class="text-center">
                  <q-checkbox v-model="row['keep']" />
                </q-td>
              </template>
              <template #body-cell-tags="{ row }">
                <q-td auto-width lass="text-center">
                  {{ row['tags'].join(', ') }}
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions class="q-pr-md q-pb-md" align="right">
        <q-btn flat color="warning" :label="backLabel" @click="backClick" />
        <q-btn
          color="positive"
          :disable="btnDisable"
          :label="btnLabel"
          :loading="loading"
          @click="btnClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import ctfnote from 'src/ctfnote';
import { Ctf, makeId } from 'src/ctfnote/models';
import parsers, { ParsedTask } from 'src/ctfnote/parsers';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const parserOptions = parsers.map((p) => ({ label: p.name, value: p }));

    const columns = [
      { name: 'title', label: 'Title', field: 'title' },
      { name: 'tags', label: 'Tags', field: 'tags' },
      { name: 'keep', label: 'Import task', field: 'keep' },
    ];
    return {
      createTask: ctfnote.tasks.useCreateTask(),
      addTagsForTask: ctfnote.tags.useAddTagsForTask(),
      model: ref(''),
      currentParser: ref(parserOptions[0]),
      parsedTasks: ref<ParsedTask[]>([]),
      tab: ref<'parse' | 'confirm'>('parse'),
      columns,
      parserOptions,
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      loading: ref<boolean>(false),
    };
  },
  computed: {
    backLabel() {
      return this.tab == 'confirm' ? 'Back' : 'cancel';
    },
    importCount() {
      return this.parsedTasks.filter((t) => t.keep).length;
    },
    btnDisable() {
      return this.tab == 'confirm' && this.importCount == 0;
    },
    btnLabel() {
      if (this.tab == 'parse') {
        return 'Parse';
      } else {
        return `Import (${this.importCount})`;
      }
    },
  },
  methods: {
    backClick() {
      if (this.tab == 'confirm') {
        this.tab = 'parse';
      } else {
        this.onDialogCancel();
      }
    },
    autoDetectParser() {
      for (const parser of parsers) {
        if (parser.isValid(this.model)) {
          const p = this.parserOptions.find((opt) => opt.value == parser);
          if (p) this.currentParser = p;
        }
      }
    },
    onPaste() {
      void this.$nextTick(() => this.autoDetectParser());
    },
    parseTasks(v: string): ParsedTask[] {
      // Get list of task {title,category} from parse
      const parsedTasks = this.currentParser.value.parse(v);
      // Precompute a set of task to avoid N square operation
      const hashTask = (title: string, tags: string[]): string =>
        title.concat(...tags);
      const taskSet = new Set();
      for (const task of this.ctf.tasks) {
        taskSet.add(
          hashTask(
            task.title,
            task.assignedTags.map((t) => t.tag)
          )
        );
      }
      // mark already existing tasks
      return parsedTasks.map((task) => {
        const hash = hashTask(task.title, task.tags);
        return { ...task, keep: !taskSet.has(hash) };
      });
    },
    async btnClick() {
      if (this.tab == 'parse') {
        this.parsedTasks = this.parseTasks(this.model);
        this.tab = 'confirm';
      } else {
        this.loading = true;
        const result = this.parsedTasks
          .filter((t) => t.keep)
          .map(async (task) => {
            const r = await this.createTask(this.ctf.id, task);
            const newTask = r?.data?.createTask?.task;
            if (newTask) {
              await this.addTagsForTask(task.tags, makeId(newTask.id));
            }
          });
        await Promise.all(result);
        this.loading = false;
        this.onDialogOK();
      }
    },
  },
});
</script>

<style scoped>
.q-dialog-plugin {
  width: 800px;
  max-width: 90vw !important;
}
</style>
