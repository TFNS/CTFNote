<template>
  <a :href="url" target="_blank">
    <q-chip clickable color="secondary" class="q-my-none" text-color="white">
      <q-icon name="link" class="q-mr-sm" />
      {{ domain }}
    </q-chip>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  url: string;
}>();

const domain = computed(() => {
  try {
    return new URL(props.url).hostname;
  } catch {
    return props.url;
  }
});
</script>
