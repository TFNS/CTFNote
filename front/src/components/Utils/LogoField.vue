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
import ctfnote from 'src/ctfnote';
export default defineComponent({
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup() {
    return {
      uploadLogo: ctfnote.uploads.useUploadLogo(),
      picker: ref<QFile | null>(null),
    };
  },
  computed: {
    model: {
      get(): string {
        return this.modelValue;
      },
      set(v: string) {
        this.$emit('update:modelValue', v);
      },
    },
  },
  methods: {
    clear() {
      this.$emit('update:modelValue', '');
    },
    openPicker() {
      const qpicker = this.picker;
      if (qpicker) {
        qpicker.pickFiles();
      }
    },
    async upload(logo: File) {
      if (!logo) return;

      const r = await this.uploadLogo(logo);
      if (r) {
        this.model = r;
      }
    },
  },
});
</script>
