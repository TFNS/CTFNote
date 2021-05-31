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
      update: data => data.incomingCtf.nodes,
      subscribeToMore: [
        {
          document: db.ctf.SUBSCRIBE,
          variables() {
            return { topic: `ctf:0:created` };
          },
          updateQuery(previousResult, { subscriptionData }) {
            const newCTF = subscriptionData.data.listen.relatedNode;
            previousResult.incomingCtf.nodes.unshift(newCTF);
            return previousResult;
          }
        },
        {
          document: db.ctf.SUBSCRIBE,
          variables() {
            return { topic: `ctf:0:deleted` };
          },
          updateQuery(previousResult, { subscriptionData }) {
            const nodeId = subscriptionData.data.listen.relatedNodeId;
            previousResult.incomingCtf.nodes = previousResult.incomingCtf.nodes.filter(n => n.nodeId != nodeId);
            return previousResult;
          }
        },
        {
          document: db.ctf.SUBSCRIBE,
          variables() {
            return { topic: `ctf:0:updated` };
          },
          updateQuery(previousResult) {
            return previousResult;
          }
        }
      ]
    }
  }
};
</script>
