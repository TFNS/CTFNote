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
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts">
import { getIncomingCtfs } from 'src/ctfnote/ctfs';
import { openCreateCtfDialog, openImportCtfDialog } from 'src/ctfnote/dialog';
import { MeKey } from 'src/ctfnote/symbols';
import { injectStrict } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';
import CardList from './CardList.vue';

export default defineComponent({
  components: { CardList },
  setup() {
    const { result: ctfs, loading } = getIncomingCtfs();

    return {
      ctfs,
      me: injectStrict(MeKey),
      loading,
    };
  },
  methods: {
    openCreateCtfDialog() {
      openCreateCtfDialog();
    },
    openImportCtfDialog() {
      openImportCtfDialog();
    },
  },
});
</script>

<style scoped></style>
