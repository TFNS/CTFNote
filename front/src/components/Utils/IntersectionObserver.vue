<template>
  <div ref="el" class="intersection">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  useCurrentElement,
  useIntersectionObserver,
  UseIntersectionObserverOptions,
  watchDebounced,
} from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<{
  options?: UseIntersectionObserverOptions;
  debounce?: number;
}>();

const emit = defineEmits<{
  show: [IntersectionObserverEntry];
  hide: [IntersectionObserverEntry];
  change: [IntersectionObserverEntry];
}>();

const el = useCurrentElement();
const lastEntry = ref<IntersectionObserverEntry>();

useIntersectionObserver(
  el,
  ([entry]) => {
    lastEntry.value = entry;
  },
  props.options
);

watchDebounced(
  lastEntry,
  (entry) => {
    if (!entry) return;
    if (entry.isIntersecting) {
      emit('show', entry);
    } else {
      emit('hide', entry);
    }
    emit('change', entry);
  },
  { debounce: props.debounce }
);
</script>

<style scoped></style>
