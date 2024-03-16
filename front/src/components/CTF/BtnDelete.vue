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
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
    };
  },
  methods: {
    openDeleteCtfDialog() {
      this.$q
        .dialog({
          title: `Delete ${this.ctf.title}?`,
          color: 'primary',
          class: 'compact-dialog',
          message: 'This will delete all the tasks, but not the pads.',
          cancel: {
            label: 'Cancel',
            flat: true,
          },
          ok: {
            color: 'negative',
            label: 'Delete',
            flat: true,
          },
        })
        .onOk(() => {
          const title = this.ctf.title;
          void this.resolveAndNotify(
            this.deleteCtf(this.ctf).then(() => this.$router.push('/')),
            {
              message: `CTF ${title} deleted!`,
              icon: 'delete',
            }
          );
        });
    },
  },
});
</script>

<style scoped></style>
