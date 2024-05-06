<template>
  <q-page>
    <div class="q-pa-md">
      <div class="card-list">
        <div v-for="ctf of ctfs" :key="ctf.nodeId" class="ctf-card-container">
          <ctf-card :ctf="ctf" :data-ctf-id="ctf.id" class="ctf-card" />
        </div>
      </div>
      <div
        class="text-h6 q-pl-md flex items-center justify-center q-pt-lg card-list"
      >
        <q-spinner-dots v-if="loading" size="50px" />
        <div v-else-if="ctfs.length === 0">No CTFs this month</div>
      </div>
      <ctf-calendar
        :ctfs="ctfs"
        :model-value="params"
        @update:model-value="handleNavigation"
        @ctf-click="handleCtfClick"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ctfnote from 'src/ctfnote';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CtfCard from '../components/CTF/Card.vue';
import CtfCalendar from '../components/CTF/CtfCalendar.vue';

const router = useRouter();
const route = useRoute();

const params = computed(() => {
  const now = new Date();
  let year = parseInt(route.params.year as string, 10);
  if (isNaN(year)) {
    year = now.getFullYear();
  }
  let month = parseInt(route.params.month as string, 10);
  if (isNaN(month)) {
    month = now.getMonth() + 1;
  }
  month = Math.min(12, Math.max(1, month));

  return { year, month };
});

const { ctfs, loading } = ctfnote.ctfs.useCtfsByDate(params);

function handleNavigation({ year, month }: { year: number; month: number }) {
  void router.push({
    name: 'ctfs',
    params: { year, month },
  });
}

function handleCtfClick(ctfId: number) {
  document.querySelector(`[data-ctf-id="${ctfId}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
</script>

<style lang="scss" scoped>
.card-list {
  margin-left: 250px;
  margin-right: -16px;
  padding-left: 16px;
  gap: 32px;
  display: flex;
  flex-direction: column;

  @media (max-width: $breakpoint-md-min) {
    margin-left: -16px;
  }
}

.ctf-card-container {
  max-width: calc(100% - 16px);
  *:first-child {
    scroll-margin-top: 66px;
  }
  &:last-of-type {
    min-height: calc(100dvh - 106px);
  }
}
</style>
