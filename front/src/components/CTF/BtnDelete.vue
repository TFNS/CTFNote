<template>
  <q-btn
    v-if="me.isManager"
    v-bind="$attrs"
    icon="delete"
    color="negative"
    @click="openDeleteCtfDialog"
  >
    <q-tooltip>Delete the CTF</q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { Ctf, MeKey } from 'src/ctfnote';
import { openDeleteCtfDialog } from 'src/ctfnote/dialog';
import { injectStrict } from 'src/utils';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    return { me: injectStrict(MeKey) };
  },
  methods: {
    openDeleteCtfDialog() {
      openDeleteCtfDialog(this.ctf);
    },
  },
});
</script>

<style scoped></style>
