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
import { Ctf } from 'src/ctfnote';
import { useDeleteCtf } from 'src/ctfnote/ctfs';
import { getMe } from 'src/ctfnote/me';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const { result: me } = getMe();
    return { me, deleteCtf: useDeleteCtf() };
  },
  methods: {
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
