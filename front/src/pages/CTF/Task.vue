<template>
  <q-page class="page">
    <iframe v-if="currentTask" seamless :src="currentTask.padUrl"></iframe>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currentUser", "currentTask"])
  },
  props: {
    taskSlug: String,
    ctf: Object
  },
  created() {
    this.setTask(this.taskSlug);
  },
  mounted(){
    document.title = `CTFNote - ${this.currentTask.title}`
  },
  methods: {
    setTask(slug) {
      const task = this.ctf.tasks.find(t => t.slug == this.taskSlug);
      this.$store.dispatch("setCurrentTask", task);
    }
  },
  watch: {
    taskSlug(v) {
      this.setTask(v);
    }
  }
};
</script>
<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.page {
  display: grid;
  grid-template-rows: 1fr;
}

</style>
