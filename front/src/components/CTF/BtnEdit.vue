<template>
  <q-btn
    v-if="me.isManager"
    v-bind="$attrs"
    padding="6px"
    icon="edit"
    color="warning"
    @click="editCtf"
  >
    <q-tooltip>Edit the CTF</q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import EditCtfDialogVue from '../Dialogs/EditCtfDialog.vue';
export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    return { me: ctfnote.me.injectMe() };
  },
  methods: {
    editCtf() {
      this.$q.dialog({
        component: EditCtfDialogVue,
        componentProps: {
          ctf: this.ctf,
        },
      });
    },
  },
});
</script>

<style scoped></style>
