<template>
  <q-btn
    v-if="me.isManager"
    v-bind="$attrs"
    icon="edit"
    color="warning"
    @click="openEditCtfDialog"
  >
    <q-tooltip>Edit the CTF</q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote';
import { openEditCtfDialog } from 'src/ctfnote/dialog';
import { getMe } from 'src/ctfnote/me';
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const { result: me } = getMe();
    return { me };
  },
  methods: {
    openEditCtfDialog() {
      openEditCtfDialog(this.ctf);
    },
  },
});
</script>

<style scoped></style>
