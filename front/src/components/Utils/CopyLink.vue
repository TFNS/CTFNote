<template>
  <q-input
    ref="linkElement"
    hint="Valid for one hour."
    filled
    bottom-slots
    :model-value="link"
    readonly
  >
    <template #before>
      <q-icon name="lock" />
    </template>

    <template #append>
      <q-btn
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
import { QInput } from 'quasar';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    link: { type: String, required: true },
  },
  setup() {
    return { linkElement: ref<QInput | null>(null) };
  },
  methods: {
    clipboardCopy() {
      if (!this.linkElement) return;
      this.linkElement.select();
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      this.$q.notify({
        message: 'Copied!',
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
