<template>
  <template v-for="(key, index) in platformKeys" :key="key">
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
  setup(props) {
    let platformKeys = props.keys;

    // Replace keys with Apple keyboard symbols on macOS
    if (navigator.userAgent.includes('Mac OS X')) {
      platformKeys = props.keys.map((key) => {
        if (key === 'ctrl') return '⌘';
        if (key === 'alt') return '⌥';
        if (key === 'shift') return '⇧';
        else return key;
      });
    }

    return {
      platformKeys,
    };
  },
});
</script>

<style scoped>
.keycap {
  background-color: rgba(200, 200, 200, 0.4);
}
</style>
