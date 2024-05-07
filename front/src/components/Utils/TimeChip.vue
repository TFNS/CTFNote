<template>
  <q-chip color="primary" text-color="white" class="q-ma-none" :ripple="false">
    <span v-if="label" class="text-weight-bold q-mr-sm">{{ label }}</span>
    {{ formatedDate }}
  </q-chip>
</template>

<script setup lang="ts">
import { date as qdate } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  date: Date;
  label?: string;
}>();

const formatedDate = computed(() => {
  return qdate.formatDate(props.date, 'YYYY-MM-DD HH:mm');
});
</script>
