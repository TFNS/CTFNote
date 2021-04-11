<template>
  <q-page>
    <q-tabs class="bg-light" v-model="tab" indicator-color="primary" dense align="left">
      <q-route-tab
        :to="{ name: 'incoming' }"
        name="incoming"
        content-class="tab-button"
        label="Incoming"
        icon="query_builder"
      />
      <q-route-tab :to="{ name: 'past' }" name="past" content-class="tab-button" label="Past" icon="archive" />
      <q-route-tab
        :to="{ name: 'calendar' }"
        name="calendar"
        content-class="tab-button"
        label="Calendar"
        icon="calendar_today"
      />
    </q-tabs>
    <div class="q-pa-md">
      <router-view />
    </div>
    <q-fab
      class="ctfs-action-btn shadow-2"
      vertical-actions-align="right"
      padding="10px"
      color="positive"
      icon="add"
      direction="down"
      push
      v-if="$ctfnote.isManager"
    >
      <q-fab-action color="positive" push @click="createCtf" icon="add" label="Create" />
      <q-fab-action color="secondary" push @click="importCtf" icon="flag" label="Import " />
    </q-fab>
  </q-page>
</template>

<script>
import db from "src/gql";
import EditCtfDialog from "src/components/Dialogs/EditCtfDialog.vue";

function parseCtftimeId(s) {
  const url = s.trim();
  if (url.match(/^\d+$/)) {
    return parseInt(url);
  }
  const match = url.match(/^https\:\/\/ctftime\.org\/event\/(\d+)\/?$/);
  if (!match) return null;
  return parseInt(match[1]);
}

export default {
  data() {
    return {
      tab: null,
    };
  },
  methods: {
    createCtf() {
      this.$q.dialog({
        component: EditCtfDialog,
        parent: this,
      });
    },
    importCtf() {
      this.$q
        .dialog({
          title: "Import CTF",
          color: "secondary",
          message: "Enter CTF Time url or id",
          prompt: {
            model: "",
            isValid: (val) => parseCtftimeId(val) != null,
          },
          cancel: true,
        })
        .onOk(async (data) => {
          const id = parseCtftimeId(data);
          this.$apollo
            .mutate({
              mutation: db.ctf.IMPORT,
              variables: { id },
              refetchQueries: ["IncomingCtfs", "PastCtfs"],
            })
            .catch((error) => {
              this.$q.notify({ message: error.message, type: "negative" });
            });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.q-tab {
  min-width: 200px;
  padding-top: 5px;
}
.ctfs-action-btn {
  position: fixed;
  top: 58px;
  right: 16px;
}
</style>