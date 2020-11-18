<template>
  <q-page>
    <router-view v-if="currentCtf" :ctf="currentCtf" :task="currentTask"></router-view>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    ctfSlug: String
  },
  data() {
    return { interval: null };
  },
  computed: {
    ...mapGetters(["currentCtf", "currentTask"])
  },
  created() {
    const REFRESH_RATE = 10 * 1000 // 10s
    this.$store.dispatch("clearCtf");
    this.$store.dispatch("getCtf", this.ctfSlug);
    this.interval = window.setInterval(() => this.$store.dispatch("getCtf", this.ctfSlug), REFRESH_RATE);
  },

  beforeDestroy() {
    window.clearInterval(this.interval);
  }
};
</script>
