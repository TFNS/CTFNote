<template>
  <q-page>
    <div class="q-pa-md">
      <div class="card-list">
        <card-list
          :fetch-more="doFetchMore"
          :loaded="loaded"
          :ctfs="ctfs"
          :start="start"
          :end="end"
          @center="updateNavigation"
        />
      </div>
      <ctf-calendar
        :ctfs="ctfs"
        :model-value="params"
        @update:model-value="handleNavigation"
        @ctf-click="scrollToCtf"
        @show-today="showToday"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core';
import CardList from 'src/components/CTF/CardList.vue';
import ctfnote from 'src/ctfnote';
import { ShortDate, shortDate } from 'src/utils/shortDate';
import { computed, nextTick, onMounted, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CtfCalendar from '../components/CTF/CtfCalendar.vue';

const router = useRouter();
const route = useRoute();

const currentDate = new Date();

const params = computed(() => {
  const year =
    parseInt(route.params.year as string, 10) || currentDate.getFullYear();
  const month = Math.min(
    12,
    Math.max(
      1,
      parseInt(route.params.month as string, 10) || currentDate.getMonth() + 1
    )
  );
  return { year, month };
});

function scrollToCtf(ctfId: number, behavior: ScrollBehavior = 'smooth') {
  document.querySelector(`[data-ctf-id="${ctfId}"]`)?.scrollIntoView({
    behavior,
    block: 'start',
  });
}

const start = ref(toRaw(params.value));
const end = ref(toRaw(params.value));

const { ctfs, loaded, fetchMore } = ctfnote.ctfs.useCtfsByDate();

function showNextCtf() {
  for (const ctf of ctfs.value) {
    if (ctf.endTime > currentDate) {
      scrollToCtf(ctf.id, 'smooth');
      break;
    }
  }
}

async function showToday() {
  const date = shortDate.fromDate(new Date());
  await doFetchMore(date);
  await nextTick(showNextCtf);
}

// When the page is loaded for the first time, scroll to the next CTF
whenever(() => ctfs.value.length, showNextCtf, { flush: 'post', once: true });

async function handleNavigation(date: ShortDate) {
  void router.replace({
    name: 'ctfs',
    params: { year: date.year, month: date.month },
  });
  await doFetchMore(date);
  void nextTick(() => {
    document
      .querySelector(`[data-date="${shortDate.toId(date)}"]`)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  });
  if (shortDate.lt(date, start.value)) {
    start.value = shortDate.copy(date);
  }
  if (shortDate.gt(date, end.value)) {
    end.value = shortDate.copy(date);
  }
}

function updateNavigation({ year, month }: ShortDate) {
  void router.replace({ name: 'ctfs', params: { year, month } });
}

async function doFetchMore(newDate: ShortDate) {
  await fetchMore(newDate);
  if (shortDate.lt(newDate, start.value)) {
    start.value = newDate;
  }
  if (shortDate.gt(newDate, end.value)) {
    end.value = newDate;
  }
}

onMounted(() => {
  document.title = 'CTFNote - CTFs';
})
</script>

<style lang="scss" scoped>
.card-list {
  margin-left: 250px;
  padding-left: 16px;
  gap: 32px;
  display: flex;
  flex-direction: column;

  @media (max-width: $breakpoint-md-min) {
    margin-left: -16px;
  }
}
</style>

<style>
html {
  scroll-snap-type: y proximity;
}
</style>
