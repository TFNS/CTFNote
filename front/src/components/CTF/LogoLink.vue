<template>
  <q-btn :href="ctf.ctfUrl" target="_blank" class="logo" type="a" :style="style" icon="icon" round>
    <q-tooltip>Browse CTF website</q-tooltip>
  </q-btn>
</template>

<script>
export default {
  props: {
    ctf: { type: Object, required: true },
    noLogo: { type: Boolean, default: false }
  },
  computed: {
    hasLogo() {
      return !!this.ctf.logoUrl;
    },
    style() {
      return this.hasLogo ? { "--logo-url": `url(${this.ctf.logoUrl})` } : {};
    },
    icon() {
      return this.hasLogo ? "" : "language";
    }
  }
};
</script>

<style>
.logo {
  background: var(--logo-url);
  background-size: cover;
  background-origin: 50% 50%;
}
</style>
