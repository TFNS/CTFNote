<template>
  <div>
    <q-input v-model="model" clearable label="Logo link">
      <template #after>
        <q-btn round color="primary" icon="backup" @click="openPicker" />
      </template>
    </q-input>
    <q-file
      ref="picker"
      class="hidden"
      clearable
      accept=".jpg, image/*"
      @clear="clear"
      @update:model-value="upload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { QFile } from 'quasar';
export default defineComponent({
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['input:modelValue'],
  setup(props, { emit }) {
    const model = ref(props.modelValue);
    const picker = ref<QFile | null>(null);

    return {
      picker,
      model,
      clear() {
        model.value = '';
      },
      openPicker() {
        const qpicker = picker.value;
        if (qpicker) {
          qpicker.pickFiles();
        }
      },
      upload(file: Blob) {
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (typeof reader.result === 'string') {
            model.value = reader.result;
            emit('input:modelValue', reader.result);
          }
        });

        reader.readAsDataURL(file);
      },
    };
  },
});
</script>
