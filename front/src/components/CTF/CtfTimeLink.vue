<template>
  <a :href="ctf.ctftimeUrl" target="_blank">
    <q-tooltip>Browse CTFTime.org</q-tooltip>
    <img height="28" src="/ctftime-logo.svg" />
  </a>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
});
</script>

<style></style>
