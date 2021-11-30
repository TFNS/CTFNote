<template>
  <q-card>
    <q-card-section>
      <div v-if="$q.screen.gt.md" class="row justify-between items-center">
        <q-btn
          icon="arrow_back_ios"
          flat
          :label="prevBtn"
          @click="calendarPrev"
        />
        <div class="row items-center q-gutter-md">
          <q-btn round flat icon="today" title="Today" @click="showToday" />
          <div class="text-h5">{{ currentMonth }}</div>
          <q-btn
            round
            flat
            icon="link"
            title="Today"
            @click="showIcalLink = true"
          />
        </div>
        <q-btn
          icon-right="arrow_forward_ios"
          flat
          :label="nextBtn"
          @click="calendarNext"
        />
      </div>
      <div v-else class="row justify-between items-center">
        <div class="row col col-12 items-center justify-center q-gutter-md">
          <q-btn round flat icon="today" title="Today" @click="showToday" />
          <div class="text-h5">{{ currentMonth }}</div>
        </div>
        <q-btn
          icon="arrow_back_ios"
          flat
          :label="prevBtn"
          @click="calendarPrev"
        />
        <q-btn
          icon-right="arrow_forward_ios"
          flat
          :label="nextBtn"
          @click="calendarNext"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        bordered
        no-active-date
        no-default-header-btn
        enable-outside-days
        event
        :show-month-label="false"
        :animated="animated"
        day-height="120"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        view="month"
      >
        <template #day="{ scope: { timestamp } }">
          <div class="column full-height q-pa-sm">
            <div
              v-for="(event, index) in getEvents(timestamp)"
              :key="index"
              class="text-white col row justify-center items-center full-width event cursor-pointer"
              :style="event.style"
              @click="clickCtf(event.ctf)"
            >
              <span class="ellipsis">{{ event.ctf.title }}</span>
            </div>
          </div>
        </template>
      </q-calendar-month>
    </q-card-section>
  </q-card>
  <q-dialog v-model="showIcalLink" seamless position="top">
    <q-card style="width: 450px">
      <q-card-section class="row items-center q-gutter-sm q-px-sm">
        <div class="col-auto">
          <q-icon name="link" size="md" />
        </div>
        <div class="col">
          <q-input
            ref="icalEl"
            label="ICAL URL"
            :model-value="icalLink"
            readonly
            outlined
            class="bg-dark"
          />
        </div>

        <div class="col-auto">
          <q-btn v-close-popup flat round icon="close" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  isBetweenDates,
  parseDate,
  QCalendar,
  QCalendarMonth,
  Timestamp,
  today,
} from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { QInput } from 'quasar';

function dateToLocale(s: string, offset = 0): string {
  const [year, month] = s.split('-').map((e) => parseInt(e));
  const d = new Date(year, month - 1 + offset, 1);
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export default defineComponent({
  components: { QCalendarMonth },
  setup() {
    const $router = useRouter();
    const icalEl = ref<QInput>();
    const { result: ctfs, loading } = ctfnote.ctfs.getAllCtfs();
    const { result: icalPassword } = ctfnote.settings.getIcalPassword();

    const icalLink = computed(() => {
      const route = $router.resolve({
        path: '/calendar.ics',
        query: { key: icalPassword.value },
      });
      icalEl.value?.select();
      return document.location.origin + route.href;
    });
    return {
      calendar: ref<QCalendar>(),
      ctfs,
      loading,
      animated: ref(false),
      selectedDate: ref(today()),
      showIcalLink: ref(false),
      icalLink,
      icalEl,
    };
  },
  computed: {
    nextBtn(): string {
      return dateToLocale(this.selectedDate, 1);
    },
    prevBtn(): string {
      return dateToLocale(this.selectedDate, -1);
    },
    currentMonth(): string {
      return dateToLocale(this.selectedDate);
    },
  },
  methods: {
    getEvents(currentDate: Timestamp) {
      const events = [];
      for (const ctf of this.ctfs) {
        const start = parseDate(ctf.startTime);
        const end = parseDate(ctf.endTime);
        if (!start || !end) continue;
        if (isBetweenDates(currentDate, start, end)) {
          events.push({
            ctf,
            style: {
              backgroundColor: ctfnote.utils.colorHash(ctf.title),
            },
            days: 7,
          });
        }
      }
      return events;
    },

    showToday() {
      this.calendar?.moveToToday();
    },
    calendarNext() {
      this.animated = true;
      this.calendar?.next();
    },
    calendarPrev() {
      this.animated = true;
      this.calendar?.prev();
    },
    clickCtf(ctf: Ctf) {
      void this.$router.push(ctf.infoLink);
    },
  },
});
</script>
<style lang="scss">
.q-calendar {
  --calendar-border-current-dark: 2px solid var(--q-color-primary);
  --calendar-current-color-dark: white;
  --calendar-outside-background-dark: #151515;
  --calendar-current-background-dark: #1d1d1d;
  --calendar-outside-background: #e5e5f0;
  --calendar-background-dark: #1d1d1d;
}
.q-calendar .event {
  font-size: 1em;
  letter-spacing: 0.01em;
  border-radius: 4px;
  line-height: 1.2em;
}
.q-calendar .event:only-child {
  font-size: 1.2em;
}
.q-calendar .event:not(:last-child) {
  margin-bottom: 8px;
}
</style>
