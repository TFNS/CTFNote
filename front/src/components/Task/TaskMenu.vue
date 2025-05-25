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
      <q-item
        v-if="me?.isAdmin || me?.isManager"
        v-close-popup
        clickable
        @click="assignTask(task)"
      >
        <q-item-section side>
          <q-avatar icon="group" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> Assign </q-item-label>
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
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    task: { type: Object as () => Task, required: true },
    contextMenu: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const me = ctfnote.me.injectMe();
    const startWorkingOn = ctfnote.tasks.useStartWorkingOn();
    const stopWorkingOn = ctfnote.tasks.useStopWorkingOn();
    const solveTask = ctfnote.tasks.useSolveTaskPopup();
    const deleteTask = ctfnote.tasks.useDeleteTaskPopup();
    const editTask = ctfnote.tasks.useEditTaskPopup();
    const assignTask = ctfnote.tasks.useAssignTaskPopup();

    return {
      me,
      startWorkingOn,
      stopWorkingOn,
      solveTask,
      deleteTask,
      editTask,
      assignTask,
      onIt: computed(() => {
        const meValue = me.value;
        if (!meValue || !meValue.profile || !('id' in meValue.profile))
          return false;
        const myId = (meValue.profile as { id: number }).id;
        return (
          props.task.workOnTasks.filter(
            (w: { profileId: number; active: boolean }) =>
              w.profileId === myId && w.active,
          ).length > 0
        );
      }),
      updateOnIt(v: boolean) {
        if (v) {
          void startWorkingOn(props.task);
        } else {
          void stopWorkingOn(props.task);
        }
      },
    };
  },
});
</script>

<style scoped></style>
