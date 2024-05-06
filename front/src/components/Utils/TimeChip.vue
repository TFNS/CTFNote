<template>
  <q-chip color="primary" text-color="white" class="q-ma-none" :ripple="false">
    <span class="text-weight-bold">{{ label }}</span
    >&nbsp;
    {{ formatedDate }}
  </q-chip>
</template>

<script setup lang="ts">
import { date as qdate } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  date: Date;
  label: string;
}>();

const formatedDate = computed(() => {
  return qdate.formatDate(props.date, 'YYYY-MM-DD HH:mm');
});
</script>
