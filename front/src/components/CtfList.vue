<template>
  <div class="row   q-col-gutter-md">
    <template v-if="ctfs.length == 0">
      <div class="noctf  col text-center">
        No ctfs :(
      </div>
    </template>
    <template v-else-if="$q.screen.gt.md">
      <div class="column col q-gutter-md justify-start">
        <div :key="ctf.slug" v-for="ctf in left">
          <CtfInfo :ctf="ctf" />
        </div>
      </div>
      <div class="column col q-gutter-md justify-start">
        <div :key="ctf.slug" v-for="ctf in right">
          <CtfInfo :ctf="ctf" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="column q-col-gutter-md">
        <div :key="ctf.slug" v-for="ctf in ctfs">
          <CtfInfo :ctf="ctf" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CtfInfo from "./CtfInfo.vue";
export default {
  components: { CtfInfo },
  props: {
    ctfs: Array
  },
  computed: {
    left() {
      return this.ctfs.filter((ctf, idx) => idx % 2 == 0);
    },
    right() {
      return this.ctfs.filter((ctf, idx) => idx % 2 == 1);
    }
  }
};
</script>
<style scoped>
.noctf {
  padding: 50px;
}
</style>
