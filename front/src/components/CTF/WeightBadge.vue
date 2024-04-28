<template>
  <q-chip
    icon="fitness_center"
    color="grey-4"
    text-color="grey-10"
    :ripple="false"
    :label="ctf.weight || '-'"
  />
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
