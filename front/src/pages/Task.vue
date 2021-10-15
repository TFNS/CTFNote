<template>
  <q-page class="page">
    <iframe v-if="task" :src="task.padUrl" />
    <p v-else>Unable to load task</p>
  </q-page>
</template>

<script lang="ts">
import { Ctf, Id, Task } from 'src/ctfnote';
import { openTask } from 'src/ctfnote/menu';
import { computed, defineComponent, watch } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    taskId: { type: Object as () => Id<Task>, required: true },
  },
  setup(props) {
    const task = computed(
      () => props.ctf.tasks.find((t) => t.id == props.taskId) ?? null
    );

    watch(
      task,
      (task) => {
        if (task) openTask(task);
      },
      { immediate: true }
    );
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
