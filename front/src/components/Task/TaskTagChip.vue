<template>
  <q-chip
    class="text-white"
    clickable
    :style="style"
    @click="filterTag(name)"
  >
    <span
      style="max-width: 120px"
      class="ellipsis"
    >
      {{ name }}
    </span>
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
      filterTag: injectStrict(keys.filterTag),
    };
  },
  computed: {
    style() {
      return { backgroundColor: ctfnote.utils.colorHash(this.name) };
    },
  },
});
</script>
