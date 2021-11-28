<template>
  <div class="row q-col-gutter-lg justify-evenly">
    <div
      v-for="(column, idx) in columns"
      :key="idx"
      class="column col q-gutter-lg justify-start align-center"
    >
      <q-intersection
        v-for="ctf in column"
        :key="ctf.nodeId"
        once
        style="min-height: 550px"
        transition="fade"
      >
        <div>
          <card :ctf="ctf" />
        </div>
      </q-intersection>
    </div>
  </div>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import { defineComponent } from 'vue';
import Card from './Card.vue';
export default defineComponent({
  components: { Card },
  props: {
    ctfs: {
      type: Array as () => Ctf[],
      required: true,
    },
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
      const ctfs = this.ctfs ?? [];
      const columns: Ctf[][] = Array(this.columnCount)
        .fill(0)
        .map(() => []);
      for (const [idx, ctf] of ctfs.entries()) {
        columns[idx % this.columnCount].push(ctf);
      }
      return columns;
    },
  },
});
</script>
