<template>
  <div class="q-gutter-sm">
    <q-btn
      round
      size="sm"
      :title="onItTitle"
      :icon="onItIcon"
      :color="onItColor"
      @click="updateOnIt(!onIt)"
    />
    <q-btn
      round
      size="sm"
      title="Enter flag"
      icon="flag"
      color="positive"
      @click="solveTask(task)"
    />
    <q-btn
      round
      size="sm"
      :title="`Edit ${task.title}`"
      icon="edit"
      color="warning"
      @click="editTask(task)"
    />
    <q-btn
      round
      size="sm"
      :title="`Delete ${task.title}`"
      icon="delete"
      color="negative"
      @click="deleteTask(task)"
    />
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { Task } from 'src/ctfnote/models';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    task: { type: Object as () => Task, required: true },
  },
  setup() {
    const me = ctfnote.me.injectMe();
    const team = ctfnote.profiles.injectTeam();

    return {
      me,
      team,
      startWorkingOn: ctfnote.tasks.useStartWorkingOn(),
      stopWorkingOn: ctfnote.tasks.useStopWorkingOn(),
      solveTask: ctfnote.tasks.useSolveTaskPopup(),
      deleteTask: ctfnote.tasks.useDeleteTaskPopup(),
      editTask: ctfnote.tasks.useEditTaskPopup(),
    };
  },

  computed: {
    onItColor() {
      return this.onIt ? 'secondary' : 'primary';
    },
    onIt() {
      if (!this.me?.profile?.id) return false;
      return this.task.workOnTasks.includes(this.me?.profile.id);
    },
    onItIcon() {
      return this.onIt ? 'person_remove' : 'person_add_alt_1';
    },
    onItTitle() {
      return `${this.onIt ? 'Stop' : 'Start'} working on ${this.task.title}`;
    },
  },
  methods: {
    updateOnIt(v: boolean) {
      if (v) {
        void this.startWorkingOn(this.task);
      } else {
        void this.stopWorkingOn(this.task);
      }
    },
  },
});
</script>

<style scoped></style>
