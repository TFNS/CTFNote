<template>
  <q-input hint="Valid for one hour." filled bottom-slots :value="link" readonly ref="linkInput">
    <template #before>
      <q-icon name="lock" />
    </template>

    <template #append>
      <q-btn round dense flat title="Copy" icon="content_copy" @click="clipboardCopy()" />
    </template>
  </q-input>
</template>

<script>
export default {
  props: {
    link: { type: String, required: true }
  },
  methods: {
    clipboardCopy() {
      const linkElement = this.$refs.linkInput;

      linkElement.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      this.$q.notify({
        message: "Copied!",
        color: "primary",
        actions: [],
        closeBtn: false,
        position: "center",
        timeout: 1
      });
    }
  }
};
</script>

<style></style>
