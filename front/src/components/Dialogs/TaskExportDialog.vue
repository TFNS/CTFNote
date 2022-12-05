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
            v-model="currentOption"
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

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const exportOptions = ['Solved tasks only', 'All tasks'];

    return {
      model: ref(''),
      currentOption: ref(exportOptions[0]),
      teamName: ref(''),
      exportOptions,
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
        markdown = `# ${task.title} - ${task.category}\n` + markdown;
      }
      return markdown;
    },

    async exportTasks(tasks: Task[]) {
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

      template += '\n\n\n';

      // Add tasks
      template += (
        await Promise.all(
          tasks.flatMap((task) => this.downloadTaskMarkdown(task), this)
        )
      ).join('\n\n');

      // download
      const blob = new Blob([template], {
        type: 'text/markdown',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.ctf.title + '.md';
      link.click();
      URL.revokeObjectURL(link.href);
    },

    async btnClick() {
      let tasks = this.ctf.tasks;
      if (this.currentOption == 'Solved tasks only') {
        tasks = tasks.filter((t) => t.solved);
      }
      this.loading = true;
      await this.exportTasks(
        tasks
          .sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          )
          .sort((a, b) =>
            a.category.toLowerCase().localeCompare(b.category.toLowerCase())
          )
      );
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
