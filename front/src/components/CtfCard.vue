<template>
  <q-card bordered class="ctfcard">
    <q-menu touch-position context-menu>
      <q-list dense>
        <q-item clickable v-close-popup @click="editCtf">
          <q-item-section side>
            <q-avatar icon="create" />
          </q-item-section>
          <q-item-section class="q-px-md">Edit</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="deleteCtf">
          <q-item-section side>
            <q-avatar icon="delete" />
          </q-item-section>
          <q-item-section class="q-px-md">Delete</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-card-section>
      <div class="row progress-row q-gutter-md" :style="style">
        <div class="col-auto">
          <a :href="ctf.ctfUrl" target="_blank" v-if="ctf.logoUrl">
            <img height="30px" :src="ctf.logoUrl" />
          </a>
          <q-btn v-else color="primary" type="a" :href="ctf.ctfUrl" icon="language" />
        </div>
        <div class="text-h6 col-auto">
          <q-btn :to="$ctfnote.ctfLink(ctf)" flat :label="ctf.title" :disable="!ctf.granted" size="md" />
        </div>
        <div class="text-h6 col-auto">
          <q-badge v-if="running" color="positive" class="running"> LIVE </q-badge>
        </div>
        <q-space class="col-12 col-md-auto col-md-grow" />
        <div class="col-md-auto col-grow">
          <q-chip icon="fitness_center" color="grey-4" text-color="grey-10" :label="ctf.weight || '-'" />
        </div>
        <div class="col-auto">
          <a :href="ctf.ctftimeUrl" target="_blank">
            <img height="30px" src="../assets/ctftime-logo.svg" />
          </a>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="row justify-between q-col-gutter-md">
        <div class="task-desc text-justify col-12 col-md ctfcard-desc">
          <vue-markdown :html="false" :source="ctf.description" />
          <q-space />
          <div class="text-right">
            <router-link :to="$ctfnote.ctfLink(ctf)">
              <q-btn :disable="!ctf.granted" color="secondary" label="Open CTF" />
            </router-link>
          </div>
        </div>
        <div class="ctfcard-cal col-auto col-grow">
          <div class="column items-center q-gutter-sm">
            <q-date
              mask="YYYY-MM-DDTHH:mm:ssZ"
              today-btn
              :title="shortDate(ctf.startTime)"
              :subtitle="shortTime(ctf.startTime)"
              :value="dateRange"
              range
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { getTime } from "src/utils";
import VueMarkdown from "vue-markdown";
import EditCtfDialog from "./Dialogs/EditCtfDialog.vue";
import db from "src/gql";
export default {
  components: { VueMarkdown },
  props: {
    ctf: Object,
  },
  data() {
    return { showEditCtf: false, now: Date.now() };
  },
  created() {
    window.setInterval(this.updateTime, 1000);
  },
  destroyed() {
    window.clearInterval(this.updateTime);
  },
  computed: {
    dateRange() {
      const startDate = this.ctf.startTime;
      const endDate = this.ctf.endTime;

      if (startDate == endDate) {
        return startDate;
      } else {
        return {
          from: startDate,
          to: endDate,
        };
      }
    },
    running() {
      return new Date(this.ctf.startTime) < this.now && new Date(this.ctf.endTime) > this.now;
    },
    style() {
      const start = new Date(this.ctf.startTime);
      const end = new Date(this.ctf.endTime);
      const duration = end - start;
      const elapsed = this.now - start;
      const progress = (elapsed / duration) * 100;
      return { "--progress-percent": `${progress.toFixed(2)}%` };
    },
  },
  methods: {
    shortTime(t) {
      return new Date(t).toLocaleTimeString({}, { hour12: false, hour: "2-digit", minute: "2-digit" });
    },
    shortDate(t) {
      const date = new Date(t);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const fmt = (i) => `00${i}`.slice(-2);
      return `${y}/${fmt(m)}/${fmt(d)}`;
    },
    updateTime() {
      this.now = Date.now();
    },
    editCtf() {
      this.$q.dialog({
        component: EditCtfDialog,
        parent: this,
        ctf: this.ctf,
      });
    },
    async deleteCtf() {
      this.$q
        .dialog({
          title: `Delete ${this.ctf.title} ?`,
          color: "negative",
          message: `This will delete all the tasks, but not the pads.`,
          ok: "Delete",
          cancel: true,
        })
        .onOk(async () => {
          await this.$apollo.mutate({
            mutation: db.ctf.DELETE,
            variables: {
              id: this.ctf.id,
            },
            refetchQueries: ["IncomingCtfs", "PastCtfs"],
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctfcard-cal {
  display: flex;
  justify-content: center;
}
.task-desc {
  height: 100%;
}
.progress-row {
  --progress-percent: 0%;

  &::before {
    position: absolute;
    content: "";
    transition: max-width linear 1s;
    top: 1px;
    left: 4px;
    height: 2px;
    width: calc(var(--progress-percent) - 8px);
    border-radius: 5px;
    background: $positive;
    box-shadow: 0 1px 3px 0px lighten($positive, 5%), 0 0.2px 1px 0px rgba(255, 255, 255, 0.8) inset;
  }
}
@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.running {
  animation: blinker 0.5s ease-in infinite alternate;
}
</style>
