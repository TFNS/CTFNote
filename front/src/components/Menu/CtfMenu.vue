<template>
  <template v-if="ctf && $q.screen.gt.xs">
    <template v-if="$q.screen.gt.sm">
      <q-separator dark vertical />
      <div class="row items-center justify-center">
        <q-btn
          class="q-mr-sm"
          type="a"
          target="_blank"
          :href="ctf.ctfUrl"
          flat
          icon="language"
          size="sm"
          round
        />
        <q-btn flat no-caps :to="ctf.tasksLink">{{ ctf.title }}</q-btn>
      </div>
    </template>
    <q-separator v-show="ctf.tasks.length" dark vertical />
    <task-list-menu v-show="ctf.tasks.length" :ctf="ctf" :task-id="taskId" />
  </template>
</template>

<script lang="ts">
import { Id, Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { Task } from 'src/generated/graphql';
import { defineComponent } from 'vue';
import TaskListMenu from '../Utils/TaskListMenu.vue';

export default defineComponent({
  components: { TaskListMenu },
  props: {
    ctfId: { type: Number as unknown as () => Id<Ctf>, required: true },
    taskId: { type: Number as unknown as () => Id<Task> | null, default: null },
  },
  setup(props) {
    const { result: ctf } = ctfnote.ctfs.getCtf(() => ({ id: props.ctfId }));
    return { ctf };
  },
});
</script>

<style scoped></style>
