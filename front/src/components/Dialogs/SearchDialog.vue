<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px">
      <q-card-section class="text-h6"> Search for CTF/Task </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-model="searchText"
          filled
          label="What are you searching for ?"
          hint="search for title or description"
          debounce="500"
          autofocus
          :loading="loading"
          @update:model-value="onSearchChange"
          @keypress.enter="submit"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-gutter-md q-px-md q-pb-sm">
        <q-btn color="warning" flat label="cancel" @click="onDialogCancel" />
        <q-btn color="positive" label="import" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      searchText: ref(''),
      onDialogHide,
      onDialogOK,
      onDialogCancel,
    };
  },
  methods: {
    onSearchChange() {
      console.log('change', this);
    },
    submit() {
      console.log('submit');
    },
  },
});
</script>

<style scoped></style>
