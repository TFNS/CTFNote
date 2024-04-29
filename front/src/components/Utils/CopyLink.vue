<template>
  <q-input
    hint="Valid for one hour."
    filled
    bottom-slots
    :model-value="link"
    readonly
  >
    <template #prepend>
      <q-icon name="link" />
    </template>
    <template #after>
      <slot name="after" />
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
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
    };
  },
  methods: {
    clipboardCopy() {
      void this.resolveAndNotify(navigator.clipboard.writeText(this.link), {
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
