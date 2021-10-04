<template>
  <div class="row q-col-gutter-md justify-evenly">
    <div class="col text-center q-pa-md" v-if="ctfs.length == 0">No ctfs :(</div>
    <template v-else>
      <div
        class="column col q-gutter-md justify-start align-center"
        style="max-width: 850px"
        :key="idx"
        v-for="(column, idx) in columns"
      >
        <div :key="ctf.slug" v-for="ctf in column">
          <ctfCard :ctf="ctf" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ctfCard from "./Card.vue";
export default {
  components: { ctfCard },
  props: {
    ctfs: { type: Array, required: true }
  },

  computed: {
    columnCount() {
      if (this.$q.screen.lt.md) {
        return 1;
      }
      if (this.$q.screen.lt.xl) {
        return 2;
      }
      return 3;
    },
    columns() {
      const columns = Array(this.columnCount)
        .fill(0)
        .map(() => []);
      for (const [idx, ctf] of this.ctfs.entries()) {
        columns[idx % this.columnCount].push(ctf);
      }
      return columns;
    }
  }
};
</script>
