<template>
  <div class="row items-center q-gutter-sm" style="min-width: 180px">
    <div class="bg col col-auto cursor-pointer">
      <div class="btn-pick-color shadow-2" :style="style">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color v-model="color" no-header format-model="hex" />
        </q-popup-proxy>
      </div>
    </div>
    <div class="col" style="text-transform: capitalize">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: { type: String, default: '' },
    modelValue: { type: String, default: '#ffffff' },
  },
  emits: ['update:model-value'],
  computed: {
    style() {
      return {
        'background-color': this.color,
      };
    },
    color: {
      get(): string {
        return this.modelValue;
      },
      set(value: string) {
        this.$emit('update:model-value', value);
      },
    },
  },
});
</script>

<style scoped>
.bg {
  display: inline-block;
  border-radius: 3px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg==);
}
.btn-pick-color {
  position: relative;
  border-radius: 3px;
  height: 32px;
  width: 32px;
}
</style>
