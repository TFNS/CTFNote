<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-card-section class="row">
        <div class="text-h6">
          {{ title }}
        </div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="form.title" label="Title" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="form.category" label="Category" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model="form.description"
          label="Description"
          type="textarea"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="form.flag" label="Flag" />
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn v-close-popup color="warning" label="Cancel" />
        <q-btn
          color="positive"
          type="submit"
          :label="editText"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Task } from 'src/ctfnote';
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  props: {
    ctfId: { type: Number as () => number | null, default: null },
    task: { type: Object as () => Task | null, default: null },
  },
  emits: useDialogPluginComponent.emits,
  setup(props) {
    const form = reactive({
      title: props.task?.title ?? '',
      category: props.task?.category ?? '',
      description: props.task?.description ?? '',
      flag: props.task?.flag ?? '',
    });
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

    return {
      dialogRef,
      form,
      onDialogHide,
      submit() {
        if (props.ctfId) {
          return onDialogOK({ ...form, ctfId: props.ctfId });
        } else if (props.task) {
          return onDialogOK({ ...form, id: props.task.id });
        }
      },
    };
  },
  computed: {
    editText() {
      return this.task ? 'Edit' : 'Create';
    },
    title() {
      return this.task ? `Edit ${this.task.title}` : 'Create Task';
    },
  },
});
</script>

<style scoped>
.q-dialog-plugin {
  width: 800px;
  max-width: 90vw !important;
}
</style>
