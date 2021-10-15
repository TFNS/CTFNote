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
                {{ form.startTime }}
                <datetime-input v-model="startTime" label="Start on" />
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
        <q-card-actions class="q-gutter-md justify-end">
          <q-btn color="warning" label="Cancel" @click="onCancelClick" />
          <q-btn color="positive" type="submit" :label="editText" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import LogoField from '../Utils/LogoField.vue';
import { useDialogPluginComponent } from 'quasar';
import { defineComponent, reactive, ref } from 'vue';
import DatetimeInput from '../Utils/DatetimeInput.vue';
import { Ctf } from 'src/ctfnote';
export default defineComponent({
  components: { DatetimeInput, LogoField },
  props: {
    ctf: { type: Object as () => Ctf | null, default: null },
  },
  emits: useDialogPluginComponent.emits,
  setup(props) {
    const form = reactive(Object.assign({}, props.ctf));
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      form,
      onDialogHide,
      startTime: ref(''),
      onCancelClick: onDialogCancel,
      submit() {
        onDialogOK(form);
      },
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
});
</script>

<style scoped></style>
