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
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    return {
      me: ctfnote.me.injectMe(),
      deleteCtf: ctfnote.ctfs.useDeleteCtf(),
      wrapNotify: ctfnote.ui.useWrapNotify(),
    };
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
          const title = this.ctf.title;
          void this.wrapNotify(() => this.deleteCtf(this.ctf), {
            message: `CTF ${title} deleted!`,
            icon: 'delete',
          });
        });
    },
  },
});
</script>

<style scoped></style>
