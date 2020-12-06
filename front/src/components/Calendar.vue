<template>
  <div class="row   q-col-gutter-md">
    <template v-if="ctfs.length == 0">
      <div class="noctf  col text-center">
        No ctfs :(
      </div>
    </template>
    <daykeep-calendar
      :event-ref="CALENDAR_NAME"
      :calendar-timezone="DEFAULT_TIMEZONE"
      :start-date="new Date()"
      :allow-editing="true"
      :event-array="convertCtfs"
    />
  </div>
</template>

<script>
import { DaykeepCalendarMonth } from "@daykeep/calendar-quasar";

const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const CALENDAR_NAME = "CTFNote";

export default {
  name: "Calendar",
  components: { "daykeep-calendar": DaykeepCalendarMonth },
  data() {
    return {
      DEFAULT_TIMEZONE,
      CALENDAR_NAME
    };
  },
  computed: {
    convertCtfs() {
      return this.ctfs.map(ctf => ({
        id: ctf.id,
        summary: ctf.title,
        description: ctf.description,
        start: { dateTime: ctf.start, timezone: DEFAULT_TIMEZONE },
        end: { dateTime: ctf.finish, timezone: DEFAULT_TIMEZONE },
        color: (() => {
          if (ctf.running) return "positive";
          if (ctf.past) return "negative";
          return "primary";
        })()
      }));
    }
  },
  props: {
    ctfs: Array
  },
  methods: {
    ctfClicked(event, ctf) {
      this.$router.push({ name: "ctf", params: { ctfSlug: ctf.slug } }).catch(() => {});
    }
  },
  created() {
    const $this = this;
    this.$root.$on(`click-event-${CALENDAR_NAME}`, eventDetailObject => {
      const ctf = this.ctfs.find(ctf => ctf.id == eventDetailObject.id);
      if (!ctf) return;

      this.ctfClicked(eventDetailObject, ctf);
    });
  }
};
</script>

<style lang="css">
.calendar-month {
  width: 100%;
}

.calendar-month .calendar-content .calendar-day-weekend {
  background-color: transparent;
}

.calendar-month .calendar-content .calendar-day-current {
  background-color: transparent;
}

.calendar-month .calendar-content .calendar-day-current > .calendar-day-number {
  color: rgb(76, 175, 80);
  font-weight: bold;
}
</style>
