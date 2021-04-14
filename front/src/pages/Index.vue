<template>
  <q-page>
    <q-tabs class="bg-light" indicator-color="primary" dense align="left">
      <q-route-tab
        :to="tab.route"
        :label="tab.label"
        content-class="tab-button"
        :icon="tab.icon"
        @click="(e, g) => navigate(idx)"
        :key="idx"
        v-for="(tab, idx) in tabs"
      />
    </q-tabs>
    <div class="q-pa-md">
      <transition
        :enter-active-class="slideIn"
        :leave-active-class="slideOut"
        @before-leave="floatElement"
        :duration="200"
      >
        <router-view />
      </transition>
    </div>
    <q-page-sticky position="top-right" :offset="[18, 8]">
      <q-fab
        class="ctfs-action-btn shadow-2"
        padding="10px"
        color="positive"
        icon="add"
        vertical-actions-align="right"
        direction="down"
        push
        v-if="$ctfnote.isManager"
      >
        <q-fab-action color="positive" push @click="createCtf" icon="add" label="Create" />
        <q-fab-action color="secondary" push @click="importCtf" icon="flag" label="Import " />
      </q-fab>
    </q-page-sticky>
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
  const match = url.match(/^https:\/\/ctftime\.org\/event\/(\d+)\/?$/);
  if (!match) return null;
  return parseInt(match[1]);
}

export default {
  data() {
    const tabs = [
      {
        label: "Incoming",
        icon: "query_builder",
        route: { name: "incoming" }
      },
      {
        label: "Past",
        icon: "archive",
        route: { name: "past" }
      },
      {
        label: "calendar",
        icon: "calendar_today",
        route: { name: "calendar" }
      }
    ];
    const tabIndex = tabs.findIndex(t => t.route.name == this.$route.name);
    return {
      tabs,
      tabIndex,
      slideIn: "animated slideInLeft",
      slideOut: "animated slideOutRight"
    };
  },
  methods: {
    createCtf() {
      this.$q.dialog({
        component: EditCtfDialog,
        parent: this
      });
    },
    navigate(idx) {
      if (idx < this.tabIndex) {
        this.slideIn = "animated slideInLeft";
        this.slideOut = "animated slideOutRight";
      } else {
        this.slideIn = "animated slideInRight";
        this.slideOut = "animated slideOutLeft";
      }
      this.tabIndex = idx;
    },
    floatElement(el) {
      const { width, heigt } = el.getBoundingClientRect();
      Object.assign(el.style, {
        width: `${width}px`,
        heigt: `${heigt}px`,
        position: "absolute",
        top: "77px",
        left: "16px"
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
            isValid: val => parseCtftimeId(val) != null
          },
          cancel: true
        })
        .onOk(async data => {
          const id = parseCtftimeId(data);
          this.$apollo
            .mutate({
              mutation: db.ctf.IMPORT,
              variables: { id },
              refetchQueries: ["IncomingCtfs", "PastCtfs"]
            })
            .then(() => {
              this.$q.notify({ message: "CTF created.", type: "positive" });
            })
            .catch(error => {
              this.$q.notify({ message: error.message, type: "negative" });
            });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.q-tab {
  min-width: 200px;
  padding-top: 5px;
}
</style>
