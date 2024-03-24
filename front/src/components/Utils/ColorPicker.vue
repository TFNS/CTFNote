<template>
  <div class="row items-center q-gutter-sm" style="min-width: 180px">
    <div class="bg col col-auto">
      <q-btn
        :icon="icon"
        class="btn-pick-color q-pa-none"
        :class="{ icon: icon, 'no-icon': !icon }"
        :style="style"
      >
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color v-model="color" no-header format-model="hex" />
        </q-popup-proxy>
      </q-btn>
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
    icon: { type: String, default: undefined },
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
  border-radius: 4px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg==);
}

.btn-pick-color {
  position: relative;
  border-radius: 4px;
  height: 32px;
  width: 32px;
  color: white;
}

.no-icon {
  font-size: 0px;
}

.btn-pick-color.icon {
  height: 40px !important;
  width: 40px !important;
}
</style>

<style>
.btn-pick-color .q-focus-helper {
  display: none;
}
</style>
