<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px">
      <q-card-section class="text-h6"> Import CTF from CTFtime </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-model="model"
          filled
          label="Id"
          hint="ctftime.org url or id"
          :rules="[validate]"
          autofocus
          @keypress.enter="submit"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          color="negative"
          outline
          label="cancel"
          @click="onDialogCancel"
        />
        <q-btn color="primary" label="import" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useImportCtf } from 'src/ctfnote/ctfs';
import { defineComponent, ref } from 'vue';

function parseCtftimeId(s: string): number | null {
  const url = s.trim();
  const idReg = new RegExp(/^\d+$/);
  const urlReg = new RegExp(/^https:\/\/ctftime\.org\/event\/(\d+)\/?$/);
  if (idReg.exec(url)) {
    return parseInt(url);
  }
  const match = urlReg.exec(url);
  if (!match) return null;
  return parseInt(match[1]);
}

export default defineComponent({
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      importCtf: useImportCtf(),
      dialogRef,
      model: ref(''),
      onDialogHide,
      onDialogOK,
      onDialogCancel,
    };
  },
  methods: {
    async submit() {
      const id = parseCtftimeId(this.model);
      if (id === null) return;
      await this.importCtf(id);
      this.onDialogOK();
    },
    validate() {
      return this.model && parseCtftimeId(this.model) === null
        ? 'Invalid url or id'
        : undefined;
    },
  },
});
</script>

<style scoped></style>
