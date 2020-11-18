<template>
  <q-page>
    <q-tabs
      class="q-px-md q-pt-sm bg-light"
      v-model="tab"
      @input="onTabChange"
      indicator-color="primary"
      dense
      align="left"
    >
      <q-tab name="incoming" style="min-width: 200px" label="Incoming" icon="query_builder"> </q-tab>
      <q-tab name="past" style="min-width: 200px" label="Past" icon="archive"> </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="incoming">
        <CtfList :ctfs="ctfs" />
      </q-tab-panel>
      <q-tab-panel name="past">
        <CtfList :ctfs="ctfs" />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showImport">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Enter CTF Time url</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="importID" autofocus @keyup.enter="importCtf" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Import" @click="importCtf" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-fab
      class="ctfs-action-btn shadow-2"
      color="positive"
      v-if="isCtfAdmin"
      icon="add"
      direction="down"
      push
    >
      <q-fab-action color="secondary" push @click="showImport = true" icon="flag" label="Import " />
      <q-fab-action color="positive" push @click="showEditCtf = true" icon="add" label="Create" />
    </q-fab>

    <q-dialog v-model="showEditCtf"> <EditCtf @save="showEditCtf = false" /> </q-dialog>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { errorMonitor } from "events";
import { mapGetters } from "vuex";
import { showErrors } from "src/utils";
import CtfInfo from "src/components/CtfInfo.vue";
import EditCtf from "src/components/EditCtf.vue";
import PastCTFs from "src/components/PastCTFs.vue";
import CtfList from "src/components/CtfList.vue";
export default {
  components: { CtfInfo, EditCtf, PastCTFs, CtfList },
  computed: {
    ...mapGetters(["ctfs", "isCtfAdmin"]),
    loading() {
      return this.ctfs == null;
    }
  },
  data() {
    return {
      tab: "incoming",
      showImport: false,
      ctfToEdit: null,
      showEditCtf: false,
      importID: ""
    };
  },
  created() {
    if (this.$route.name == "past"){
      this.fetchTab("past")
      this.tab = "past"
    } else {
      this.fetchTab("incoming")
    }
    document.title = `CTFNote`;
  },
  methods: {
    async onTabChange(param) {
      const name = param == "past" ? param : "ctfs"
      this.$router.replace({name})
      await this.fetchTab(param);
    },
    async fetchTab(tab) {
      const errors = await this.$store.dispatch("fetchCtfs", tab);
      showErrors(this, errors);
    },
    async importCtf() {
      const errors = await this.$store.dispatch("importCtf", this.importID);
      showErrors(this, errors);
      if (!errors) this.showImport = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.ctfs-action-btn {
  position: fixed;
  top: 60px;
  right: 35px;
}
</style>
