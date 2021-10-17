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
import { Ctf, MeKey } from 'src/ctfnote';
import { openDeleteCtfDialog, openEditCtfDialog } from 'src/ctfnote/dialog';
import { injectStrict } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    return {
      me: injectStrict(MeKey),
    };
  },
  methods: {
    openEditCtfDialog() {
      openEditCtfDialog(this.ctf);
    },
    openDeleteCtfDialog() {
      openDeleteCtfDialog(this.ctf);
    },
  },
});
</script>

<style scoped></style>
