<template>
  <q-chip
    class="text-white"
    clickable
    :style="style"
    @click="filterCategory(name)"
  >
    {{ name }}
  </q-chip>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { injectStrict } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';
import keys from '../../injectionKeys';
export default defineComponent({
  props: {
    name: { type: String, default: '?' },
  },
  setup() {
    return {
      filterCategory: injectStrict(keys.filterCategory),
    };
  },
  computed: {
    style() {
      return { backgroundColor: ctfnote.utils.colorHash(this.name) };
    },
  },
});
</script>

<style scoped></style>
