<template>
  <q-chip icon="fitness_center" color="grey-4" text-color="grey-10" :label="ctf.weight || '-'" />
</template>

<script>
export default {
  props: {
    ctf: { type: Object, required: true }
  }
};
</script>
