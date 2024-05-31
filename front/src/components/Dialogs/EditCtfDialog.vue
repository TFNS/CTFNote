<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin ctfnote-dialog">
      <q-form @submit="submit">
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6 ellipsis">
            {{ ctf ? `Edit ${ctf.title}` : 'Create CTF' }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>

        <q-card-section class="row q-col-gutter-sm">
          <div class="col-12 col-sm-9">
            <ctftime-input
              v-model="form.ctftimeUrl"
              :autofocus="!ctf"
              filled
              dense
              @refresh="onCtftimeRefresh"
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-input
              v-model.number="form.weight"
              step="0.01"
              type="number"
              label="Weight"
              filled
              dense
            >
              <template #prepend>
                <q-icon name="fitness_center" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-7">
            <q-input v-model="form.title" required label="Title" filled dense>
              <template #prepend>
                <q-icon name="title" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="form.ctfUrl" label="CTF link" filled dense>
              <template #prepend>
                <q-icon name="link" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <logo-field v-model="form.logoUrl" dense />
          </div>
          <div class="col-12 col-sm-6">
            <datetime-input
              v-model="form.startTime"
              filled
              dense
              label="Start on"
              class="datetime-input-no-error"
              @update:model-value="
                () => {
                  if (form.endTime < form.startTime) {
                    form.endTime = new Date(
                      form.startTime.getTime() +
                        1000 * 60 * 60 * 24 /* 24 hours in milliseconds */
                    );
                  }
                }
              "
            />
          </div>
          <div class="col-12 col-sm-6">
            <datetime-input
              v-model="form.endTime"
              filled
              dense
              label="End on"
              lazy-rules
              :class="{ 'datetime-input-no-error': isValidDateRange }"
              :rules="[
                () => isValidDateRange || 'End time must be after start time',
              ]"
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.description"
              filled
              autogrow
              type="textarea"
              label="Description (Markdown)"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn color="primary" flat label="Cancel" @click="onDialogCancel" />
          <q-btn
            color="positive"
            type="submit"
            :label="ctf ? 'Save' : 'Create'"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { computed, reactive } from 'vue';
import DatetimeInput from '../Utils/DatetimeInput.vue';
import CtftimeInput from '../CTF/CtftimeInput.vue';
import LogoField from '../Utils/LogoField.vue';
import { CtftimeCtfFragment } from 'src/generated/graphql';

const props = defineProps<{
  ctf?: Ctf;
}>();

defineEmits(useDialogPluginComponent.emits);
const { dialogRef, onDialogOK, onDialogCancel, onDialogHide } =
  useDialogPluginComponent<Ctf>();

const { resolveAndNotify } = ctfnote.ui.useNotify();
const updateCtf = ctfnote.ctfs.useUpdateCtf();
const createCtf = ctfnote.ctfs.useCreateCtf();

const now = new Date();

const form = reactive({
  title: props.ctf?.title || '',
  description: props.ctf?.description || '',
  startTime: props.ctf?.startTime ?? now,
  endTime: props.ctf?.endTime ?? new Date(now.getTime() + 1000 * 60 * 60 * 24),
  weight: props.ctf?.weight ?? 0,
  ctfUrl: props.ctf?.ctfUrl || null,
  ctftimeUrl: props.ctf?.ctftimeUrl || null,
  logoUrl: props.ctf?.logoUrl || null,
});

function onCtftimeRefresh(update: CtftimeCtfFragment) {
  form.title = update.title;
  form.startTime = new Date(update.start);
  form.endTime = new Date(update.finish);
  form.description = update.description;
  form.ctfUrl = update.url;
  form.logoUrl = update.logo;
  form.weight = update.weight;
  form.ctftimeUrl = update.ctftimeUrl;
}

const isValidDateRange = computed(
  () => form.endTime && form.endTime >= form.startTime
);

async function submit() {
  const ctf = props.ctf;
  if (ctf) {
    const opts = {
      message: `CTF ${ctf.title} updated!`,
      icon: 'flag',
    };
    await resolveAndNotify(
      updateCtf(ctf, {
        ...form,
        startTime: form.startTime.toISOString(),
        endTime: form.endTime.toISOString(),
      }).then(onDialogOK),
      opts
    );
  } else {
    await resolveAndNotify(
      createCtf({
        ...form,
        startTime: form.startTime.toISOString(),
        endTime: form.endTime.toISOString(),
      }).then(onDialogOK)
    );
  }
}
</script>

<style lang="scss">
.datetime-input-no-error {
  height: 40px;
}

// Hide error text if not needed to make items underneath clickable
.datetime-input-no-error .q-field__bottom {
  display: none;
}
</style>
