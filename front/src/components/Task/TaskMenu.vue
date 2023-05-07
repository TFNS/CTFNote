<template>
  <q-menu touch-position :context-menu="contextMenu">
    <q-list dense>
      <q-item v-ripple v-close-popup tag="label">
        <q-item-section side top>
          <q-checkbox :model-value="onIt" @update:model-value="updateOnIt" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> On it </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple v-close-popup tag="label">
        <q-item-section side top>
          <q-checkbox
            :model-value="task.solved"
            @update:model-value="solveTask(task)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> Solved </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple v-close-popup tag="label" @click="editTask(task)">
        <q-item-section side>
          <q-avatar icon="edit" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> Edit </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable @click="deleteTask(task)">
        <q-item-section side>
          <q-avatar icon="delete" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> Delete </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { Task } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    task: { type: Object as () => Task, required: true },
    contextMenu: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {
      me: ctfnote.me.injectMe(),
      startWorkingOn: ctfnote.tasks.useStartWorkingOn(),
      stopWorkingOn: ctfnote.tasks.useStopWorkingOn(),
      solveTask: ctfnote.tasks.useSolveTaskPopup(),
      deleteTask: ctfnote.tasks.useDeleteTaskPopup(),
      editTask: ctfnote.tasks.useEditTaskPopup(),
    };
  },
  computed: {
    onIt() {
      if (!this.me.profile?.id) {
        return false;
      }
      return this.task.workOnTasks.includes(this.me.profile.id);
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
