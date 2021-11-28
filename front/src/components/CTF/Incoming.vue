<template>
  <div>
    <card-list v-if="ctfs.length" :ctfs="ctfs" />
    <div v-else-if="!loading">
      <div>No ctfs :(</div>
      <div v-if="me.isManager" class="row q-gutter-sm q-mt-md">
        <q-btn
          color="positive"
          label="Create a ctf"
          icon="add"
          @click="openCreateCtfDialog"
        />
        <q-btn
          color="secondary"
          label="Import a ctf"
          icon="flag"
          @click="openImportCtfDialog"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import EditCtfDialogVue from '../Dialogs/EditCtfDialog.vue';
import ImportCtfDialogVue from '../Dialogs/ImportCtfDialog.vue';
import CardList from './CardList.vue';

export default defineComponent({
  components: { CardList },
  setup() {
    const { result: ctfs, loading } = ctfnote.ctfs.getIncomingCtfs();

    return {
      me: ctfnote.me.injectMe(),
      ctfs,
      loading,
    };
  },
  methods: {
    openCreateCtfDialog() {
      this.$q.dialog({
        component: EditCtfDialogVue,
      });
    },
    openImportCtfDialog() {
      this.$q.dialog({
        component: ImportCtfDialogVue,
      });
    },
  },
});
</script>

<style scoped></style>
