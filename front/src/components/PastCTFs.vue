<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col-6" :key="ctf.slug" v-for="ctf in ctfs">
        <CtfInfo :ctf="ctf" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Rights } from "../enums";

import CtfInfo from "../components/CtfInfo.vue";

export default {
  name: "PastCTFs",
  components: { CtfInfo },
  data: () => ({}),
  computed: {
    ...mapGetters(["ctfs"])
  }
};
</script>

<style></style>
