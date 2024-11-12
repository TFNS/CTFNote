<template>
  <q-btn color="primary" padding="6px" :icon="icon" @click="onClick">
    <q-tooltip> Copy iCalendar link </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ctfnote from 'src/ctfnote/index';
import { copyToClipboard } from 'quasar';

const { result: icalPassword } = ctfnote.settings.getIcalPassword();

const icon = ref('link');
const link = computed(() => {
  const url = document.location.origin + '/calendar.ics';
  if (icalPassword.value) {
    return `${url}?key=${encodeURIComponent(icalPassword.value)}`;
  }
  return url;
});

async function onClick() {
  await copyToClipboard(link.value);
  icon.value = 'done';
  setTimeout(() => {
    icon.value = 'link';
  }, 1500);
}
</script>
