<template>
  <template v-for="(key, index) in keys" :key="key">
    <q-chip square dense class="keycap">
      {{ key }}
    </q-chip>
    <template v-if="index < keys.length - 1"> + </template>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    keys: { type: Array, required: true },
  },
});
</script>

<style scoped>
.keycap {
  background-color: rgba(200, 200, 200, 0.4);
}
</style>
