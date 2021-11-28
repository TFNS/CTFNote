<template>
  <q-input
    hint="Valid for one hour."
    filled
    bottom-slots
    :model-value="link"
    readonly
  >
    <template #after>
      <slot name="after" />
    </template>
    <template #before>
      <q-icon name="lock" />
    </template>

    <template #append>
      <q-btn
        v-show="link"
        round
        dense
        flat
        title="Copy"
        icon="content_copy"
        @click="clipboardCopy()"
      />
    </template>
  </q-input>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    link: { type: String, required: false, default: null },
  },
  setup() {
    return {
      wrapNotify: ctfnote.ui.useWrapNotify(),
    };
  },
  methods: {
    clipboardCopy() {
      void this.wrapNotify(() => navigator.clipboard.writeText(this.link), {
        message: 'Copied to clipboard!',
        color: 'primary',
        actions: [],
        closeBtn: false,
        position: 'center',
        timeout: 1,
      });
    },
  },
});
</script>

<style scoped></style>
