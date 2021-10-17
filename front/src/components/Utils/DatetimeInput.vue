<template>
  <q-input v-model="time" filled :label="label" :mask="inputMask" fill-mask>
    <template #prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="time" :mask="mask">
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
          <q-time v-model="time" :mask="mask" format24h>
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
import { date } from 'quasar';
import { defineComponent } from 'vue';

const humanMask = 'YYYY/MM/DD HH:mm';
const isoMask = 'YYYY-MM-DDTHH:mm:ssZ';

export default defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
  },
  emits: ['update:modelValue'],
  setup() {
    return { mask: humanMask, inputMask: '####/##/## ##:##' };
  },
  computed: {
    time: {
      get(): string {
        return date.formatDate(this.modelValue, 'YYYY/MM/DD HH:mm');
      },
      set(v: string) {
        const d =  date.formatDate(date.extractDate(v, humanMask), isoMask);
        this.$emit('update:modelValue', d);
      },
    },
  },
});
</script>
