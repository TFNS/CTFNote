<template>
  <div>
    <router-view :ctf="ctf" v-if="ctf" />
    <q-inner-loading :showing="$apollo.queries.ctf.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import db from "src/gql";

export default {
  props: {
    ctfId: { type: Number, required: true }
  },
  apollo: {
    ctf: {
      query: db.ctf.GET,
      variables() {
        return { id: this.ctfId };
      }
    }
  }
};
</script>
