<template>
  <q-card bordered class="ctfcard">
    <q-menu touch-position context-menu>
      <q-list dense>
        <q-item clickable v-close-popup @click="editCtf">
          <q-item-section side>
            <q-avatar icon="create" />
          </q-item-section>
          <q-item-section class="q-px-md"> Edit </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="deleteCtf">
          <q-item-section side>
            <q-avatar icon="delete" />
          </q-item-section>
          <q-item-section class="q-px-md"> Delete </q-item-section>
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
            <q-tooltip>Browse CTFTime.org</q-tooltip>
            <img height="30px" src="../../assets/ctftime-logo.svg" />
          </a>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="row justify-between q-col-gutter-md">
        <div class="text-justify col-12 col-md ctfcard-desc">
          <q-markdown no-html :src="ctf.description" />
          <div v-if="!running">
            <Timer :date="ctf.startTime" />
          </div>
          <div v-else><b>Time Left: </b><Timer :date="ctf.endTime" /></div>
        </div>
        <div class="col-auto col-grow">
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
    <q-card-section>
      <q-btn color="primary" :to="$ctfnote.ctfLink(ctf)" label="Open CTF" :disable="!ctf.granted" size="md" />
    </q-card-section>
  </q-card>
</template>

<script>
import EditCtfDialog from "../Dialogs/EditCtfDialog.vue";
import Timer from "../Timer.vue";
import db from "src/gql";
import * as utils from "src/utils";
export default {
  components: { Timer },
  props: {
    ctf: { type: Object, required: true }
  },
  data() {
    return { now: Date.now() };
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
      if (startDate.slice(0, 10) == endDate.slice(0, 10)) {
        return startDate;
      } else {
        return {
          from: startDate,
          to: endDate
        };
      }
    },
    running() {
      return utils.isRunningCtf(this.ctf, this.now);
    },
    style() {
      const start = new Date(this.ctf.startTime);
      const end = new Date(this.ctf.endTime);
      const duration = end - start;
      const elapsed = this.now - start;
      const progress = (elapsed / duration) * 100;
      return { "--progress-percent": `${progress.toFixed(2)}%` };
    }
  },
  methods: {
    shortTime(t) {
      return utils.getTime(t);
    },
    shortDate(t) {
      return utils.getDate(t);
    },
    updateTime() {
      this.now = Date.now();
    },
    editCtf() {
      this.$q.dialog({
        component: EditCtfDialog,
        parent: this,
        ctf: this.ctf
      });
    },
    async deleteCtf() {
      this.$q
        .dialog({
          title: `Delete ${this.ctf.title} ?`,
          color: "negative",
          message: `This will delete all the tasks, but not the pads.`,
          ok: "Delete",
          cancel: true
        })
        .onOk(async () => {
          await this.$apollo.mutate({
            mutation: db.ctf.DELETE,
            variables: {
              id: this.ctf.id
            },
            refetchQueries: ["IncomingCtfs", "PastCtfs"]
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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
