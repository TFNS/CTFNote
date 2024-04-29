<template>
  <q-page class="page">
    <iframe v-if="task" :src="task.padUrl + '#'" @load="listenForHotkeys()" />

    <div v-else class="flex justify-center items-start q-mt-md">
      <q-card>
        <q-card-section class="q-pb-sm">
          <div class="text-h5">Task not found</div>
        </q-card-section>

        <q-card-actions class="row q-px-md q-pb-md">
          <q-btn
            type="submit"
            label="Back to tasks view"
            color="primary"
            class="full-width"
            :to="ctf.tasksLink"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import hotkeys from 'hotkeys-js';
import ctfnote from 'src/ctfnote';
import { Ctf, Id, Task } from 'src/ctfnote/models';
import { computed, defineComponent, onMounted, onUnmounted, watch } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    taskId: { type: Number as unknown as () => Id<Task>, required: true },
  },
  setup(props) {
    const task = computed(
      () => props.ctf.tasks.find((t) => t.id == props.taskId) ?? null
    );

    const solveTask = ctfnote.tasks.useSolveTaskPopup();

    const solveTaskShortcut = 'ctrl+s, command+s';

    watch(
      task,
      (task) => {
        if (task) {
          document.title = `CTFNote - ${task.title}`;
        }
      },
      { immediate: true }
    );

    let solveTaskShortcutListener: (
      this: Window,
      ev: MessageEvent<string>
    ) => void;

    onMounted(() => {
      // Listen for shortcut
      hotkeys(solveTaskShortcut, function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        if (task.value !== null) {
          solveTask(task.value);
        }
      });

      // Listen for solve task shortcut from HedgeDoc iframe
      solveTaskShortcutListener = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data === 'solveTask') {
          if (task.value !== null) {
            solveTask(task.value);
          }
        }
      };
      window.addEventListener('message', solveTaskShortcutListener);
    });

    onUnmounted(() => {
      hotkeys.unbind(solveTaskShortcut);
      window.removeEventListener('message', solveTaskShortcutListener);
    });

    return { task, solveTask };
  },
  methods: {
    listenForHotkeys() {
      const taskFrame = window.frames[0];
      if (taskFrame !== undefined) {
        // inject hotkey script with some CTFNote code to catch hotkey for search dialog
        // and communicate that with the parent window
        const hotkeyScript = taskFrame.document.createElement('script');
        hotkeyScript.src = '/pad/js/hotkeys-iframe.js'; // this won't exist in development but will in production
        taskFrame.document.body.appendChild(hotkeyScript);
      }
    },
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
