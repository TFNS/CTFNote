<template>
  <template v-if="ctf">
    <q-separator v-if="$q.screen.gt.xs" ctdark vertical />

    <div
      class="row items-center justify-center"
      :class="{ 'no-left-margin': $q.screen.xs }"
    >
      <logo-link flat dense class="q-mx-sm logo-link" :ctf="ctf" />

      <q-btn
        v-if="$q.screen.gt.sm"
        flat
        no-caps
        style="padding-left: 12px; padding-right: 12px"
        :to="ctf.tasksLink"
      >
        <q-tooltip :delay="400">Open tasks view</q-tooltip>
        <div class="ellipsis" style="max-width: 285px">
          {{ ctf.title }}
        </div>
      </q-btn>
      <q-btn
        v-else
        flat
        round
        dense
        icon="toc"
        class="q-mr-xs"
        :to="ctf.tasksLink"
      >
        <q-tooltip>Open tasks view</q-tooltip>
      </q-btn>
    </div>

    <q-separator
      v-if="$q.screen.gt.xs"
      v-show="ctf.tasks.length"
      dark
      vertical
    />

    <task-list-menu
      v-show="ctf.tasks.length"
      :class="{ 'no-left-margin': $q.screen.xs }"
      :ctf="ctf"
      :task-id="taskId"
    />
  </template>
</template>

<script lang="ts">
import { Id, Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { Task } from 'src/generated/graphql';
import { defineComponent } from 'vue';
import LogoLink from '../CTF/LogoLink.vue';
import TaskListMenu from '../Utils/TaskListMenu.vue';

export default defineComponent({
  components: { LogoLink, TaskListMenu },
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

<style scoped>
.logo-link >>> .q-icon {
  transform: scale(0.8);
}

.no-left-margin {
  margin-left: 0px;
}
</style>
