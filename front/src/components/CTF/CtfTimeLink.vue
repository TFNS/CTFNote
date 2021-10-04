<template>
  <a :href="ctf.ctftimeUrl" target="_blank">
    <q-tooltip>Browse CTFTime.org</q-tooltip>
    <img height="30px" src="../../assets/ctftime-logo.svg" />
  </a>
</template>

<script>
export default {
  props: {
    ctf: { type: Object, required: true }
  }
};
</script>

<style></style>
