<template>
  <div>
    <component
      :is="group ? 'q-btn-group' : 'div'"
      :class="{ 'q-gutter-sm': !group }"
    >
      <q-btn
        v-if="showOpenTaskBtn"
        :to="openTaskRoute"
        round
        size="sm"
        :title="`Open ${task.title}`"
        icon="edit_note"
        color="accent"
      />
      <q-btn
        v-touch-hold:2000.mouse="handleOnItClick"
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
    </component>
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { Task } from 'src/ctfnote/models';
import { defineComponent } from 'vue';
import { RouteLocationRaw } from 'vue-router';

export default defineComponent({
  props: {
    group: { type: Boolean, required: false },
    showOpenTaskBtn: { type: Boolean, required: false },
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
      cancelWorkingOn: ctfnote.tasks.useCancelWorkingOn(),
    };
  },

  computed: {
    openTaskRoute(): RouteLocationRaw {
      const params: Record<string, string> = {};
      params['taskId'] = this.task.id.toString();
      params['taskSlug'] = this.task.slug;
      return { name: 'task', params };
    },
    onItColor() {
      return this.onIt ? 'secondary' : 'primary';
    },
    onIt(): boolean {
      if (!this.me?.profile?.id) return false;
      return (
        this.task.workOnTasks.filter(
          (w) => w.profileId == this.me?.profile.id && w.active
        ).length > 0
      );
    },
    workedOnIt(): boolean {
      return (
        this.task.workOnTasks.filter((w) => w.profileId == this.me?.profile.id)
          .length > 0
      );
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
    async handleOnItClick() {
      if (this.workedOnIt) {
        await this.cancelWorkingOn(this.task);
      }
    },
  },
});
</script>

<style scoped></style>
