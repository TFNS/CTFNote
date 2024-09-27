<template>
  <div class="row justify-center scroll-anchor">
    <q-btn color="primary" @click="fetchMore(shortDate.prev(ctfByMonth[0]))">
      Load previous ctfs
    </q-btn>
  </div>
  <div
    v-for="group of ctfByMonth"
    :key="shortDate.toId(group)"
    class="full-size"
    :data-date="shortDate.toId(group)"
  >
    <IntersectionObserver
      :options="{ rootMargin: '200px' }"
      class="column gap-lg"
      @show.once="fetchMoreCtfs(group)"
    >
      <div class="row items-center gap-md scroll-anchor">
        <q-separator class="col" />
        <div class="col-auto col text-h6 q-py-sm">
          {{
            date
              .buildDate({ year: group.year, month: group.month })
              .toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
          }}
        </div>
        <q-separator class="col" />
      </div>
      <div
        v-for="ctf of group.ctfs"
        :key="ctf.nodeId"
        class="ctf-card-container"
      >
        <ctf-card :ctf="ctf" :data-ctf-id="ctf.id" class="ctf-card" />
      </div>
      <q-card
        v-if="group.ctfs.length === 0"
        :key="shortDate.toId(group)"
        class="full-size column items-center justify-center no-ctf"
      >
        <q-card-section>
          <div class="text-center text-h5 q-pt-md">No CTFs this month</div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-icon name="hotel" size="128px" />
        </q-card-section>
      </q-card>
      <IntersectionObserver
        v-if="!isLoaded(nextMonth(group))"
        :options="{ rootMargin: '500px' }"
        @show="fetchMoreCtfs(nextMonth(group))"
      />
    </IntersectionObserver>
  </div>
  <div class="full-size" />
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { date } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import { shortDate, ShortDate } from 'src/utils/shortDate';
import { computed, ref, watch } from 'vue';
import IntersectionObserver from '../Utils/IntersectionObserver.vue';
import CtfCard from './Card.vue';

const props = defineProps<{
  ctfs: Ctf[];
  loaded: Set<string>;
  fetchMore: (date: ShortDate) => Promise<void>;
  start: ShortDate;
  end: ShortDate;
}>();

const emit = defineEmits<{
  center: [ShortDate];
}>();

const centerElement = ref<HTMLElement>();

const updateCenterElement = () => {
  const centerY = 80;

  let closestElement: HTMLElement | undefined = undefined;
  let closestDistance = Infinity;

  document.querySelectorAll<HTMLElement>('[data-date]').forEach((element) => {
    const top = element.getBoundingClientRect().top;
    const distance = centerY - top < -200 ? Infinity : Math.abs(centerY - top);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestElement = element;
    }
  });
  centerElement.value = closestElement;
};

watch(centerElement, () => {
  const parent = centerElement.value;
  if (parent && parent.dataset.date) {
    emit('center', shortDate.fromId(parent.dataset.date));
  }
});

const { resume } = useIntervalFn(updateCenterElement, 100, {
  immediate: false,
});

setTimeout(() => {
  resume();
}, 1000);

async function fetchMoreCtfs(date: ShortDate) {
  await props.fetchMore(date);
}

function nextMonth(date: ShortDate) {
  if (date.month === 12) {
    return { year: date.year + 1, month: 1 };
  } else {
    return { year: date.year, month: date.month + 1 };
  }
}

function isLoaded(date: ShortDate) {
  return props.loaded.has(`${date.year}-${date.month}`);
}

const realStart = computed(() => {
  if (props.ctfs.length === 0) {
    return props.start;
  }

  const firstCtf = props.ctfs[0];
  const firstCtfDate = shortDate.fromDate(firstCtf.startTime);
  return shortDate.min(firstCtfDate, props.start);
});

const realEnd = computed(() => {
  if (props.ctfs.length === 0) {
    return props.end;
  }
  const lastCtf = props.ctfs[props.ctfs.length - 1];
  const lastCtfDate = shortDate.fromDate(lastCtf.startTime);
  return shortDate.max(lastCtfDate, props.end);
});

const ctfByMonth = computed(() => {
  const ctfByMonth: {
    year: number;
    month: number;
    ctfs: Ctf[];
  }[] = [];
  let pos = 0;

  for (let y = realStart.value.year; y <= realEnd.value.year; y++) {
    const startMonth = y === realStart.value.year ? realStart.value.month : 1;
    const endMonth = y === realEnd.value.year ? realEnd.value.month : 12;

    for (let m = startMonth; m <= endMonth; m++) {
      const group = { year: y, month: m, ctfs: [] as Ctf[] };
      ctfByMonth.push(group);
      while (
        pos < props.ctfs.length &&
        props.ctfs[pos].startTime.getFullYear() <= y &&
        props.ctfs[pos].startTime.getMonth() + 1 <= m
      ) {
        group.ctfs.push(props.ctfs[pos]);
        pos++;
      }
    }
  }

  return ctfByMonth;
});
</script>

<style lang="scss" scoped>
.ctf-card-container {
  *:first-child {
    scroll-margin-top: 66px;

    @media (max-width: $breakpoint-md-min) {
      scroll-snap-align: start;
    }
  }
}

.scroll-anchor {
  scroll-margin-top: 66px;

  @media (max-width: $breakpoint-md-min) {
    scroll-snap-align: start;
  }
}

.contents {
  display: contents;
}

.full-size {
  scroll-margin-top: 66px;
  display: flex;
  flex-direction: column;
  min-height: 450px;
  gap: 32px;
}
</style>
