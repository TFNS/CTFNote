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
            <q-badge :key="index" class="cursor-pointer full-width" :style="event.style" @click="clickCtf(event.ctf)">
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

const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const CALENDAR_NAME = "CTFNote";

export default {
  name: "Calendar",
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
      DEFAULT_TIMEZONE,
      CALENDAR_NAME,
      selectedDate: QCalendar.today()
    };
  },
  created() {
    this.$root.$on(`click-event-${CALENDAR_NAME}`, ({ ctf }) => {
      if (ctf.granted) {
        return this.$router.push(this.$ctfnote.ctfLink(ctf));
      }
      this.$q.notify({ message: "You are not allowed to browse this CTF", type: "negative" });
    });
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
    },
    convertedCtfs() {
      const ctfs = this.ctfs || [];
      return ctfs.map(ctf => ({
        ctf: ctf,
        id: ctf.id,
        summary: ctf.title,
        description: ctf.description,
        start: { dateTime: ctf.startTime },
        end: { dateTime: ctf.endTime },
        color: "primary"
      }));
    }
  }
};
</script>
<style>
.body--dark .q-calendar {
  background: #1d1d1d !important;
}
</style>
<style lang="scss">
.body--dark .calendar-tabs .q-tab__content {
  color: white;
}

.calendar-month {
  width: 100%;
  & .calendar-content {
    & .calendar-day-weekend {
      background-color: transparent;
    }
    & .calendar-day-current {
      background-color: transparent;
      & .calendar-day-number {
        color: var(--q-color-positive);
        font-weight: bold;
      }
    }
  }
}
</style>
