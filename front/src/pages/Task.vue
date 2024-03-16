<template>
  <q-page class="page">
    <iframe v-if="task" :src="task.padUrl" />
    <p v-else>Unable to load task</p>
  </q-page>
</template>

<script lang="ts">
import { Ctf, Id, Task } from 'src/ctfnote/models';
import { computed, defineComponent, onMounted, watch } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    taskId: { type: Number as unknown as () => Id<Task>, required: true },
  },
  setup(props) {
    const task = computed(
      () => props.ctf.tasks.find((t) => t.id == props.taskId) ?? null
    );

    watch(
      task,
      (task) => {
        if (task) {
          document.title = `CTFNote - ${task.title}`;
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      const taskFrame = window.frames[0];
      taskFrame.addEventListener('DOMContentLoaded', () => {
        // inject hotkey script with some CTFNote code to catch hotkey for search dialog
        // and communicate that with the parent window
        const hotkeyScript = taskFrame.document.createElement('script');
        hotkeyScript.src = '/pad/js/hotkeys-iframe.js'; // this won't exist in development but will in production
        taskFrame.document.body.appendChild(hotkeyScript);
      });
    });

    return { task };
  },
});
</script>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.page {
  display: grid;
  grid-template-rows: 1fr;
}
</style>
