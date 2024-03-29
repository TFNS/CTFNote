<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="ctfnote-dialog">
      <q-form @submit="submit">
        <q-card-section class="row">
          <div class="text-h6">
            {{ title }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="form.title" required label="Title" />
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
        <q-card-actions class="q-gutter-md q-pr-md q-pb-md" align="right">
          <q-btn v-close-popup flat color="warning" label="Cancel" />
          <q-btn color="positive" type="submit" :label="editText" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Id, Task, Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  props: {
    ctfId: { type: Number as unknown as () => Id<Ctf> | null, default: null },
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
      onDialogOK,
      updateTask: ctfnote.tasks.useUpdateTask(),
      createTask: ctfnote.tasks.useCreateTask(),
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
  methods: {
    submit() {
      if (this.ctfId) {
        void this.createTask(this.ctfId, this.form);
      } else if (this.task) {
        void this.updateTask(this.task, { ...this.form });
      }
      this.onDialogOK();
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
