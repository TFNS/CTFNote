<template>
  <q-chip
    class="text-white"
    :clickable="clickable"
    :ripple="clickable"
    :style="style"
    @click="filterTag(name)"
  >
    <span style="max-width: 120px" class="ellipsis">
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
    let filterTag;
    let clickable;

    // Check if keys.filterTag exists
    try {
      filterTag = injectStrict(keys.filterTag);
      clickable = true;
    } catch (e) {
      filterTag = () => {
        return null;
      };
      clickable = false;
    }

    return {
      filterTag,
      clickable,
    };
  },
  computed: {
    style() {
      return { backgroundColor: ctfnote.utils.colorHash(this.name) };
    },
  },
});
</script>
