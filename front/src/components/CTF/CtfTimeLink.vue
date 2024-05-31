<template>
  <q-btn v-if="mini" :href="url" dense class="bg-ctftime">
    <q-tooltip>Browse CTFTime.org</q-tooltip>
    <img src="/ctftime-icon.svg" height="28" />
  </q-btn>
  <a v-else :href="url" target="_blank" class="flex items-center">
    <q-tooltip>Browse CTFTime.org</q-tooltip>
    <img src="/ctftime-logo.svg" height="28" />
  </a>
</template>

<script setup lang="ts">
import { Ctf } from 'src/ctfnote/models';
import { computed } from 'vue';

const props = defineProps<{
  ctf: Ctf;
  mini?: boolean;
}>();

const url = computed(() =>
  props.ctf.ctftimeUrl ? props.ctf.ctftimeUrl : 'https://ctftime.org/'
);
</script>

<style scoped>
.bg-ctftime {
  background: #e3000b;
}
</style>
