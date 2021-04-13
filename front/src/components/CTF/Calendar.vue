<template>
  <q-card>
    <q-card-section v-if="ctfs">
      <daykeep-calendar
        class="full-width"
        :event-ref="CALENDAR_NAME"
        :calendar-timezone="DEFAULT_TIMEZONE"
        :start-date="new Date()"
        :allow-editing="true"
        :prevent-event-detail="true"
        :event-array="convertedCtfs"
      />
    </q-card-section>
  </q-card>
</template>

<script>
// TODO: fetch CTF lazily month by month
import { DaykeepCalendar } from "@daykeep/calendar-quasar";
import db from "src/gql";

const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const CALENDAR_NAME = "CTFNote";

export default {
  name: "Calendar",
  components: { DaykeepCalendar },
  apollo: {
    ctfs: {
      query: db.ctf.ALL,
      update: data => data.ctfs.nodes
    }
  },
  data() {
    return {
      DEFAULT_TIMEZONE,
      CALENDAR_NAME
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
  computed: {
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
