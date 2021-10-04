<template>
  <div>
    {{ label }}
    <i v-if="currentTime" style="margin: 0">
      {{ currentTime.days }} days {{ f(currentTime.hours, 2) }}:{{ f(currentTime.min, 2) }}:{{
        f(currentTime.sec, 2)
      }}.{{ f(currentTime.ms, 3) }}
    </i>
  </div>
</template>

<script>
export default {
  name: "Timer",
  data: () => ({
    currentTime: null,
    parsedDate: null,
    stop: false
  }),
  props: {
    date: { type: String, required: true },
    label: { type: String, default: "" }
  },
  mounted() {
    this.parsedDate = new Date(this.date);
    if (this.parsedDate) {
      this.countdown();
    }
  },
  destroyed() {
    this.stop = true;
  },
  methods: {
    f(x, n) {
      return ("0".repeat(n) + x).substr(-n);
    },
    countdown() {
      let delta = Math.max(0, this.parsedDate - Date.now());

      const refresh = delta > 0;

      let ms = delta % 1000;
      delta = 0 | (delta / 1000);
      let sec = delta % 60;
      delta = 0 | (delta / 60);
      let min = delta % 60;
      delta = 0 | (delta / 60);
      let hours = delta % 24;
      delta = 0 | (delta / 24);
      let days = delta;

      if (refresh) {
        if (this.stop) return;

        this.currentTime = {
          delta,
          ms,
          sec,
          min,
          hours,
          days
        };

        return window.requestAnimationFrame(this.countdown);
      }

      this.currentTime = null;
    }
  }
};
</script>
