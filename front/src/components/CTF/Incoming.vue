<template>
  <div>
    <ctf-list :ctfs="ctfs" v-if="!$apollo.queries.ctfs.loading" />
    <q-inner-loading :showing="$apollo.queries.ctfs.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import CtfList from "src/components/CTF/CtfCardList.vue";
import db from "src/gql";

export default {
  components: { CtfList },
  apollo: {
    ctfs: {
      query: db.ctf.INCOMING,
      update: data => data.incomingCtf.nodes
    }
  }
};
</script>
