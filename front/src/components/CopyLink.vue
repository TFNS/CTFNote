<template>
  <q-input hint="Valid for one hour." filled bottom-slots :value="link" readonly>
    <template #before>
      <q-icon name="lock" />
    </template>

    <template #append>
      <q-btn round dense flat title="Copy" icon="content_copy" @click="clipboardCopy()" />
    </template>
  </q-input>
</template>

<script>
import { copyToClipboard } from "quasar";

export default {
  props: {
    link: { type: String, required: false },
  },
  methods: {
    notify({ color, message }) {
      this.$q.notify({
        message,
        color,
        actions: [],
        closeBtn: false,
        position: "center",
        timeout: 1,
      });
    },
    clipboardCopy() {
      copyToClipboard(this.link)
        .then(() => {
          this.notify({
            message: "Copied!",
            color: "primary",
          });
        })
        .catch(() => {
          this.notify({
            message: "Failed to copy to the clipboard",
            color: "negative",
          });
        });
    },
  },
};
</script>

<style></style>
