<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin ctfnote-dialog">
      <q-form @submit="submit">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ title }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>

        <q-separator />
        <q-card-section>
          <div class="col q-col-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input v-model="form.title" required label="Title" />
              </div>
              <div class="col-auto">
                <q-input
                  v-model.number="form.weight"
                  step="0.01"
                  type="number"
                  label="Weight"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input v-model="form.ctfUrl" label="CTF link" />
              </div>
              <div class="col">
                <q-input v-model="form.ctftimeUrl" label="CTFTime Link" />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <logo-field v-model="form.logoUrl" />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col">
                <datetime-input v-model="form.startTime" label="Start on" />
              </div>
              <div class="col">
                <datetime-input v-model="form.endTime" label="End on" />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input
                  v-model="form.description"
                  type="textarea"
                  label="Description"
                  hint="markdown"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-gutter-md q-px-md q-pb-md justify-end">
          <q-btn color="warning" flat label="Cancel" @click="onCancelClick" />
          <q-btn color="positive" type="submit" :label="editText" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Ctf } from 'src/ctfnote';
import { useCreateCtf, useUpdateCtf } from 'src/ctfnote/ctfs';
import { defineComponent, reactive } from 'vue';
import DatetimeInput from '../Utils/DatetimeInput.vue';
import LogoField from '../Utils/LogoField.vue';

export default defineComponent({
  components: { DatetimeInput, LogoField },
  props: {
    ctf: { type: Object as () => Ctf | null, default: null },
  },
  emits: useDialogPluginComponent.emits,
  setup(props) {
    const now = new Date();
    const form = reactive(
      Object.assign(
        {
          title: '',
          description: '',
          startTime: now,
          endTime: now,
          weight: 0,
          ctfUrl: null,
          ctftimeUrl: null,
          logoUrl: null,
        },
        props.ctf
      )
    );
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      updateCtf: useUpdateCtf(),
      createCtf: useCreateCtf(),
      dialogRef,
      form,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
    };
  },
  computed: {
    editText() {
      return this.ctf ? 'Save' : 'Create';
    },
    title() {
      return this.ctf ? `Edit ${this.ctf.title}` : 'Create CTF';
    },
  },
  methods: {
    submit() {
      if (this.ctf) {
        void this.updateCtf(this.ctf, {
          ...this.form,
          startTime: this.form.startTime.toISOString(),
          endTime: this.form.endTime.toISOString(),
        });
      } else {
        void this.createCtf({
          ...this.form,
          startTime: this.form.startTime.toISOString(),
          endTime: this.form.endTime.toISOString(),
        });
      }
      this.onDialogOK();
    },
  },
});
</script>

<style scoped></style>
