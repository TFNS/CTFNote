<template>
  <q-menu
    v-if="me.isManager"
    :touch-position="contextMenu"
    :context-menu="contextMenu"
  >
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
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import EditCtfDialogVue from '../Dialogs/EditCtfDialog.vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    contextMenu: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      me: ctfnote.me.injectMe(),
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      deleteCtf: ctfnote.ctfs.useDeleteCtf(),
    };
  },
  methods: {
    openEditCtfDialog() {
      this.$q.dialog({
        component: EditCtfDialogVue,
        componentProps: {
          ctf: this.ctf,
        },
      });
    },
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
          const opts = {
            message: `CTF ${this.ctf.title} deleted!`,
            icon: 'delete',
          };
          void this.resolveAndNotify(this.deleteCtf(this.ctf), opts);
        });
    },
  },
});
</script>

<style scoped></style>
