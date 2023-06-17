<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-card-section class="row">
        <div class="text-h6">Export tasks</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section>
        <div>
          <q-select
            v-model="currentFormatOption"
            class="full-width"
            label="Export Format"
            :options="exportFormats"
          />
          <q-select
            v-model="currentTypeOption"
            class="full-width"
            label="Export Type"
            :options="exportOptions"
          />
          <q-input v-model="teamName" label="Team name" />
        </div>
      </q-card-section>
      <q-card-actions class="q-pr-md q-pb-md" align="right">
        <q-btn flat color="warning" label="Cancel" @click="backClick" />
        <q-btn
          color="positive"
          label="Export"
          :loading="loading"
          @click="btnClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Ctf, Task } from 'src/ctfnote/models';
import { defineComponent, ref } from 'vue';
import * as JSZip from 'jszip';
import { tagsSortFn } from 'src/ctfnote/tags';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const exportOptions = ['Solved tasks only', 'All tasks'];

    const exportFormats = ['Markdown', 'Zip'];

    return {
      model: ref(''),
      currentTypeOption: ref(exportOptions[0]),
      currentFormatOption: ref(exportFormats[0]),
      teamName: ref(''),
      exportOptions,
      exportFormats,
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      loading: ref<boolean>(false),
    };
  },
  computed: {},
  methods: {
    backClick() {
      this.onDialogCancel();
    },

    async downloadTaskMarkdown(task: Task) {
      const result = await fetch(task.padUrl + '/download/markdown');
      let markdown = await result.text();
      if (markdown.trimStart().substring(0, 1) != '#') {
        //does not start with a title, manually adding...
        let withTitle = `# ${task.title}`;
        for (const tag of task.assignedTags) {
          withTitle += ` - ${tag.tag}`;
        }
        markdown = withTitle + '\n' + markdown;
      }
      return markdown;
    },

    downloadBlob(blob: Blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      let extension = '';
      if (this.currentFormatOption == 'Markdown') {
        extension = 'md';
      } else if (this.currentFormatOption == 'Zip') {
        extension = 'zip';
      }

      link.download = `${this.ctf.title}.${extension}`;
      link.click();
      URL.revokeObjectURL(link.href);
    },

    createIntroduction(tasks: Task[]): string {
      let template = '';

      // Add CTF title
      template += `${this.ctf.title}\n===\n\n`;
      // Add CTF date
      template += `${this.ctf.startTime.toUTCString()} - ${this.ctf.endTime.toUTCString()}  \n`;
      // Add team name
      if (this.teamName != '') {
        template += `Team: ${this.teamName}\n`;
      }

      // Add flags table
      const flagTasks = tasks.filter((f) => f.flag != '');
      if (flagTasks.length > 0) {
        template += '\n| Task | Flag |\n|---|---|\n';
        template += flagTasks
          .map((flagTask) => `| ${flagTask.title} | ${flagTask.flag} |`)
          .join('\n');
      }

      return template;
    },

    async exportTasksAsMarkdown(tasks: Task[]) {
      let template = this.createIntroduction(tasks);

      template += '\n\n\n';

      // Add tasks
      template += (
        await Promise.all(
          tasks.flatMap((task) => this.downloadTaskMarkdown(task), this)
        )
      ).join('\n\n');

      const blob = new Blob([template], {
        type: 'text/markdown',
      });

      this.downloadBlob(blob);
    },

    async exportTasksAsZip(tasks: Task[]) {
      const zip = new JSZip.default();

      const files = await Promise.all(
        tasks.flatMap(async (task) => {
          return {
            title: task.title,
            content: await this.downloadTaskMarkdown(task),
          };
        }, this)
      );

      zip.file(
        `${this.ctf.title} - Overview.md`,
        this.createIntroduction(tasks)
      );

      for (const f of files) {
        zip.file(f.title + '.md', f.content);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      this.downloadBlob(zipBlob);
    },

    async btnClick() {
      let tasks = this.ctf.tasks;
      if (this.currentTypeOption == 'Solved tasks only') {
        tasks = tasks.filter((t) => t.solved);
      }
      this.loading = true;

      const sortedTasks = tasks
        .sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        )
        .sort(tagsSortFn);

      if (this.currentFormatOption == 'Markdown') {
        await this.exportTasksAsMarkdown(sortedTasks);
      } else if (this.currentFormatOption == 'Zip') {
        await this.exportTasksAsZip(sortedTasks);
      }

      this.loading = false;
      this.onDialogOK();
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
