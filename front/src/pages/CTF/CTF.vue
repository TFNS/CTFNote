<template>
  <q-card class="q-pa-md">
    <div class="head" :style="taskStyle">
      <div class="row q-col-gutter-md q-mb-md items-center">
        <div class="col-auto text-h4">
          <a :href="ctf.ctfUrl" target="_blank" class="titlelink">
            {{ ctf.title }}
          </a>
        </div>
        <div class="col-auto">
          <q-chip icon="fitness_center" :label="ctf.weight" />
        </div>
        <div class="col-auto">
          <a :href="ctf.ctfTimeUrl" target="_blank">
            <img height="30px" src="../../assets/ctftime-logo.svg" />
          </a>
        </div>
        <q-space />
        <div class="col q-pr-sm col-auto">
          <q-btn size="md" :loading="loading" round @click="refresh" color="primary" icon="refresh" />
        </div>
      </div>
      <div class="row justify-between q-px-sm">
        <q-tabs v-model="tab" dense active-color="secondary" indicator-color="secondary" align="left" narrow-indicator>
          <q-tab name="info" label="Info" />
          <q-tab name="tasks" label="Tasks" />
          <q-tab name="players" label="Guests" />
        </q-tabs>
      </div>
    </div>

    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="info">
        <div class="row">
          <a :href="ctf.ctfUrl" target="_blank">{{ ctf.ctfUrl }}</a>
        </div>
        <div class="row q-gutter-md">
          <div class="col-12 col-md q-gutter-md">
            <div class="text-h6">Description</div>
            <VueMarkdown :html="false" :source="ctf.description || ''"></VueMarkdown>
          </div>
          <q-separator vertical />
          <div class="col-12 col-md q-gutter-md">
            <div class="text-h6">Credentials</div>
            <VueMarkdown :source="ctf.credentials || ''" class="blur"></VueMarkdown>
          </div>
        </div>
        <div class="row justify-end">
          <div class="col-auto">
            <q-btn v-if="canEdit" label="edit" icon="edit" color="positive" @click="showEditCtf = true" />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="tasks">
        <TaskList :ctf="ctf" />
      </q-tab-panel>
      <q-tab-panel name="players">
        <CtfPlayers :ctf="ctf" />
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="showEditCtf"> <EditCtf :ctf="ctf" @save="showEditCtf = false" /> </q-dialog>
  </q-card>
</template>

<script>
import { colorHash } from "src/utils";
import { Rights } from "src/enums";
import { mapGetters } from "vuex";
import TaskList from "src/components/TaskList.vue";
import CtfPlayers from "src/components/CtfPlayers.vue";
import VueMarkdown from "vue-markdown";
import EditCtf from "src/components/EditCtf.vue";

export default {
  components: { VueMarkdown, TaskList, CtfPlayers, EditCtf },
  props: {
    ctf: Object
  },
  data() {
    const tab = localStorage.getItem("ctf-tab") || "info";

    return {
      tab,
      showEditCtf: false,
      canEdit: this.$store.getters.isUserGranted(Rights.EDIT_CTF)
    };
  },
  watch: {
    tab(v) {
      localStorage.setItem("ctf-tab", v);
    }
  },
  created() {
    this.$store.dispatch("fetchUsers");
  },
  mounted() {
    document.title = `CTFNote - ${this.ctf.title}`;
  },
  computed: {
    ...mapGetters(["users", "loading"]),
    taskStyle() {
      let backgroundImage = "none";
      if (this.$q.screen.gt.md) backgroundImage = `url(${this.ctf.logoUrl})`;
      return { backgroundImage };
    }
  },
  methods: {
    refresh() {
      this.$store.dispatch("getCtf", this.ctf.slug);
    }
  }
};
</script>
<style lang="scss" scoped>
.blur {
  filter: blur(5px);
  transition: filter 0.2s;
}
.blur:hover {
  filter: blur(0px);
  transition-delay: 0.2s;
}

.head {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: calc(100% - 60px);
}

.description {
  white-space: pre;
}

.titlelink {
  color: inherit;
  text-decoration: none;
  position: relative;
  &:before {
    content: "";
    display: block;
    background: currentColor;
    position: absolute;
    transition: all 0.5s;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 2px;
  }

  &:hover:before {
    width: 100%;
  }
}
</style>
