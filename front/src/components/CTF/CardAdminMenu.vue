<template>
  <q-menu v-if="me.isManager" touch-position context-menu>
    <q-list dense>
      <q-item v-close-popup clickable @click="openEditCtfDialog">
        <q-item-section side>
          <q-avatar icon="create" />
        </q-item-section>
        <q-item-section class="q-px-md"> Edit </q-item-section>
      </q-item>
      <q-item v-close-popup clickable @click="openDeleteCtfDialog">
        <q-item-section side>
          <q-avatar icon="delete" />
        </q-item-section>
        <q-item-section class="q-px-md"> Delete </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote';
import { useDeleteCtf } from 'src/ctfnote/ctfs';
import { openEditCtfDialog } from 'src/ctfnote/dialog';
import { getMe } from 'src/ctfnote/me';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const { result: me } = getMe();
    return {
      me,
      deleteCtf: useDeleteCtf(),
    };
  },
  methods: {
    openEditCtfDialog() {
      openEditCtfDialog(this.ctf);
    },
    openDeleteCtfDialog() {
      this.$q
        .dialog({
          title: `Delete ${this.ctf.title} ?`,
          color: 'negative',
          message: 'This will delete all the tasks, but not the pads.',
          ok: 'Delete',
          cancel: true,
        })
        .onOk(() => {
          void this.deleteCtf(this.ctf);
        });
    },
  },
});
</script>

<style scoped></style>
