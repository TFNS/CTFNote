<template>
  <q-input v-model="model" filled :label="label" :mask="inputMask" fill-mask>
    <template #prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="model" :mask="mask">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template #append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time v-model="model" :mask="mask" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts">
import * as utils from 'src/utils';
import { date } from 'quasar';
import { defineComponent, ref, watch } from 'vue';

const humanMask = 'YYYY/MM/DD HH:mm';
const isoMask = 'YYYY-MM-DDTHH:mm:ssZ';
const inputMask = '####/##/## ##:##';

function humanToIso(d: string): string {
  return date.formatDate(date.extractDate(d, humanMask), isoMask);
}

function isoToHuman(d: string): string {
  return date.formatDate(date.extractDate(d, isoMask), humanMask);
}

function now() {
  const now = new Date();
  return utils.getDateTime(now);
}

export default defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = ref(props.modelValue ? isoToHuman(props.modelValue) : now());
    watch(
      () => model.value,
      (v) => {
        emit('update:modelValue', humanToIso(v));
      }
    );
    return { model, mask: humanMask, inputMask };
  },
});
</script>
