<template>
  <q-menu touch-position context-menu>
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
            @update:model-value="$emit('solve-task')"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> Solved </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple v-close-popup tag="label" @click="$emit('edit-task')">
        <q-item-section side>
          <q-avatar icon="edit" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-px-md"> Edit </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-close-popup clickable @click="$emit('delete-task')">
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
import { Task } from 'src/ctfnote';
import { getMe } from 'src/ctfnote/me';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    task: { type: Object as () => Task, required: true },
  },
  emits: [
    'solve-task',
    'edit-task',
    'delete-task',
    'start-work-on-task',
    'stop-work-on-task',
    'filter-category',
  ],
  setup() {
    const { result: me } = getMe();
    return {
      me,
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
        this.$emit('start-work-on-task');
      } else {
        this.$emit('stop-work-on-task');
      }
    },
  },
});
</script>

<style scoped></style>
