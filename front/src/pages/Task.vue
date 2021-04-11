<template>
  <q-page class="page">
    <iframe v-if="task" :src="task.padUrl"></iframe>
  </q-page>
</template>

<script>
import db from "src/gql";
export default {
  props: {
    taskId: Number,
  },
  apollo: {
    task: {
      query: db.task.GET,
      variables() {
        return { id: this.taskId };
      },
    },
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
