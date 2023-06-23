<template>
  <q-input
    v-model="password"
    label="Password"
    autocomplete="password"
    filled
    :type="hidePwd ? 'password' : 'text'"
  >
    <template v-for="(_, name) of $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>

    <template #append>
      <q-icon
        :name="hidePwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="hidePwd = !hidePwd"
      />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'update:visibility'],
  setup() {
    return { hidePwd: ref(true) };
  },
  computed: {
    password: {
      get(): string {
        return this.modelValue;
      },
      set(v: string) {
        this.$emit('update:modelValue', v);
      },
    },
  },
  watch: {
    hidePwd: {
      immediate: true,
      handler(v) {
        this.$emit('update:visibility', !v);
      },
    },
  },
});
</script>

<style scoped></style>
