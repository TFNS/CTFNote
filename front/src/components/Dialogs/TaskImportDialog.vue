<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-card-section class="row">
        <div class="text-h6">Import tasks</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel
            name="parse"
            class="full-width q-pt-none"
            style="height: 401px"
          >
            <div class="q-gutter-sm">
              <q-select
                v-model="currentParser"
                filled
                dense
                label="Type"
                options-dense
                :options="parserOptions"
              >
                <template #prepend>
                  <q-icon name="data_object" />
                </template>
              </q-select>

              <q-input
                v-model="model"
                filled
                dense
                label="Data"
                type="textarea"
                spellcheck="false"
                :input-style="{
                  height: '317px',
                  resize: 'none',
                  'font-family': 'monospace',
                }"
                :hint="currentParser.value.hint"
                @paste="onPaste"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="confirm" class="full-width no-padding">
            <q-separator />
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
                  <q-checkbox v-model="row['keep']" dense />
                </q-td>
              </template>
              <template #body-cell-tags="{ row }">
                <q-td auto-width style="padding-right: 12px">
                  <task-tags-list
                    class="no-wrap justify-end"
                    :tags="computeTags(row['tags'])"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat color="primary" :label="backLabel" @click="backClick" />
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
import TaskTagsList from 'src/components/Task/TaskTagsList.vue';

export default defineComponent({
  components: {
    TaskTagsList,
  },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const parserOptions = parsers.map((p) => ({ label: p.name, value: p }));

    const columns = [
      { name: 'keep', label: '', field: 'keep' },
      { name: 'title', label: 'Title', field: 'title', align: 'left' },
      {
        name: 'tags',
        label: 'Tags',
        field: 'tags',
        align: 'right',
        headerStyle: 'padding-right: 28px;',
      },
    ];
    return {
      createTask: ctfnote.tasks.useCreateTask(),
      addTagsForTask: ctfnote.tags.useAddTagsForTask(),
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      notifySuccess: ctfnote.ui.useNotify().notifySuccess,
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
        return 'Next';
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
    normalizeTags(tags: string[]): string[] {
      if (tags.length == 0) return [];
      return Array.from(new Set(tags.map((t) => t.trim().toLowerCase())));
    },
    parseTasks(v: string): ParsedTask[] {
      // Get list of task {title,category} from parse
      const parsedTasks = this.currentParser.value.parse(v);
      // Precompute a set of task to avoid N square operation
      const hashTask = (title: string, tags: string[]): string =>
        title + this.normalizeTags(tags).sort().join('');
      const taskSet = new Set();
      for (const task of this.ctf.tasks) {
        taskSet.add(
          hashTask(
            task.title,
            this.normalizeTags(task.assignedTags.map((t) => t.tag))
          )
        );
      }
      // mark already existing tasks
      return parsedTasks.map((task) => {
        const hash = hashTask(task.title, task.tags);
        return {
          ...task,
          tags: this.normalizeTags(task.tags),
          keep: !taskSet.has(hash),
        };
      });
    },
    computeTags(tags: { nodeId: number; tag: string }[]) {
      return tags.map((tag, index) => ({
        nodeId: index,
        tag: tag,
      }));
    },
    async createTasks(tasks: ParsedTask[]) {
      for (const task of tasks) {
        const r = await this.createTask(this.ctf.id, task);
        const newTask = r?.data?.createTask?.task;
        if (newTask) {
          await this.addTagsForTask(task.tags, makeId(newTask.id));
        }
      }
    },

    async btnClick() {
      if (this.tab == 'parse') {
        this.parsedTasks = this.parseTasks(this.model);
        this.tab = 'confirm';
      } else {
        this.loading = true;
        const result = this.parsedTasks.filter((t) => t.keep);
        this.onDialogOK();

        this.notifySuccess({
          message: `Importing ${result.length} tasks. This may take a while...`,
          icon: 'flag',
        });
        return this.resolveAndNotify(this.createTasks(result), {
          message: `Imported ${result.length} tasks`,
          icon: 'flag',
        });
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
