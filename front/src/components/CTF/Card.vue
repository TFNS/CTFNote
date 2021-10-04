<template>
  <q-card bordered class="ctfcard">
    <card-admin-menu @edit="editCtf" @delete="deleteCtf" />
    <q-card-section>
      <div class="row progress-row q-gutter-md items-center" :style="style">
        <div class="col-auto">
          <logo-link :ctf="ctf" />
        </div>
        <div class="text-h6 col-auto">
          <q-btn :to="$ctfnote.ctfLink(ctf)" flat :label="ctf.title" :disable="!ctf.granted" size="md" />
        </div>
        <div class="text-h6 col-auto">
          <q-badge v-if="running" color="positive" class="running"> LIVE </q-badge>
        </div>
        <q-space />
        <div class="col-auto">
          <weight-badge :ctf="ctf" />
        </div>
        <div class="col-auto">
          <ctf-time-link :ctf="ctf" />
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="row justify-between q-col-gutter-md">
        <div class="text-justify col-md">
          <q-markdown no-html :src="ctf.description" />
          <Timer label="Start in" :date="ctf.startTime" v-if="!running" />
          <Timer label="Time Left:" :date="ctf.endTime" v-else />
        </div>
        <div class="col-auto col-grow">
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
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-md">
        <q-btn
          color="primary"
          :to="$ctfnote.ctfLink(ctf)"
          label="Open CTF"
          :disable="!ctf.granted"
          icon="flag"
          size="md"
        />
        <btn-edit @click="editCtf" />
        <btn-delete @click="deleteCtf" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import EditCtfDialog from "../Dialogs/EditCtfDialog.vue";
import Timer from "../Timer.vue";
import db from "src/gql";
import * as utils from "src/utils";
import CardAdminMenu from "./CardAdminMenu.vue";
import LogoLink from "./LogoLink.vue";
import CtfTimeLink from "./CtfTimeLink.vue";
import WeightBadge from "./WeightBadge.vue";
import BtnEdit from "./BtnEdit.vue";
import BtnDelete from "./BtnDelete.vue";
export default {
  components: { Timer, CardAdminMenu, LogoLink, CtfTimeLink, WeightBadge, BtnEdit, BtnDelete },
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
