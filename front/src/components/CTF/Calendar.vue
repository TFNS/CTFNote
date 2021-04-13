<template>
  <q-card v-if="ctfs">
    <q-card-section>
      <div class="row justify-between items-center">
        <q-btn icon="arrow_back_ios" flat :label="prevBtn" @click="calendarPrev" />
        <div class="row items-center q-gutter-md">
          <q-btn round flat icon="today" title="Today" @click="showToday" />
          <div class="text-h5">{{ currentMonth }}</div>
        </div>
        <q-btn icon-right="arrow_forward_ios" flat :label="nextBtn" @click="calendarNext" />
      </div>
    </q-card-section>
    <q-card-section>
      <q-calendar
        ref="calendar"
        bordered
        no-active-date
        no-default-header-btn
        enable-outside-days
        day-class="calendar"
        event
        :show-month-label="false"
        animated
        day-height="120"
        v-model="selectedDate"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        view="month"
        locale="en-us"
      >
        <template #day="{ timestamp }">
          <template v-for="(event, index) in getEvents(timestamp.date)">
            <q-badge
              :key="index"
              class="cursor-pointer full-width event"
              :style="event.style"
              @click="clickCtf(event.ctf)"
            >
              <span class="ellipsis">{{ event.ctf.title }}</span>
            </q-badge>
          </template>
        </template>
      </q-calendar>
    </q-card-section>
  </q-card>
</template>

<script>
// TODO: fetch CTF lazily month by month
import db from "src/gql";
import * as utils from "src/utils";
import QCalendar from "@quasar/quasar-ui-qcalendar";

export default {
  components: {},
  apollo: {
    ctfs: {
      query: db.ctf.ALL,
      update: data => {
        const ctfs = [];
        for (const ctf of data.ctfs.nodes) {
          const startDate = QCalendar.parseDate(new Date(ctf.startTime));
          const endDate = QCalendar.parseDate(new Date(ctf.endTime));
          ctfs.push({ ...ctf, startDate, endDate });
        }
        return ctfs;
      }
    }
  },
  data() {
    return {
      selectedDate: QCalendar.today()
    };
  },
  methods: {
    showToday() {
      this.selectedDate = QCalendar.today();
    },
    clickCtf(ctf) {
      if (ctf.granted) {
        return this.$router.push(this.$ctfnote.ctfLink(ctf));
      }
      this.$q.notify({ message: "You are not allowed to browse this CTF", type: "negative" });
    },
    calendarNext() {
      this.$refs.calendar.next();
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    getEvents(dt) {
      const currentDate = QCalendar.parseTimestamp(dt);
      const events = [];
      for (const ctf of this.ctfs) {
        if (QCalendar.isBetweenDates(currentDate, ctf.startDate, ctf.endDate)) {
          events.push({
            ctf,
            style: { backgroundColor: utils.colorHash(ctf.title) },
            days: 7
          });
        }
      }
      return events;
    }
  },
  computed: {
    nextBtn() {
      const ts = QCalendar.parseTimestamp(this.selectedDate);
      ts.month += 1;
      if (ts.month == 12) {
        ts.month = 0;
        ts.year += 1;
      }
      const date = new Date(ts.year, ts.month + 1, 1);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    },
    prevBtn() {
      const ts = QCalendar.parseTimestamp(this.selectedDate);
      ts.month -= 1;
      if (ts.month == -1) {
        ts.month = 11;
        ts.year -= 1;
      }
      const date = new Date(ts.year, ts.month + 1, 1);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    },
    currentMonth() {
      const ts = QCalendar.parseTimestamp(this.selectedDate);
      const date = new Date(ts.year, ts.month + 1, ts.day);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    }
  }
};
</script>
<style lang="scss">
.q-calendar {
  --calendar-border-current-dark: 2px solid var(--q-color-primary);
  --calendar-current-color-dark: white;
  --calendar-outside-background-dark: #151515;
  --calendar-outside-background: #e5e5f0;
  --calendar-background-dark: #1d1d1d;
}
.q-calendar .event {
  font-size: 1em;
  letter-spacing: 0.01em;
  line-height: 1.2em;
  margin: 2px;
}
</style>
