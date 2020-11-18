<template>
  <q-card bordered class="ctfcard">
    <q-menu touch-position context-menu v-if="isCtfAdmin">
      <q-list dense>
        <q-item clickable v-close-popup @click="showEditCtf = true">
          <q-item-section side>
            <q-avatar icon="create" />
          </q-item-section>
          <q-item-section class="q-px-md">Edit</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="showConfirmDelete = true">
          <q-item-section side>
            <q-avatar icon="delete" />
          </q-item-section>
          <q-item-section class="q-px-md">Delete</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-card-section class="row q-col-gutter-md items-center">
      <div class="col-auto">
        <a :href="ctf.ctfUrl" target="_blank" v-if="ctf.logoUrl">
          <img height="30px" :src="ctf.logoUrl" />
        </a>

        <q-btn v-else color="primary" type="a" :href="ctf.ctfUrl" icon="language" />
      </div>
      <div class="text-h6 col-auto">
        <q-btn
          flat
          :label="ctf.title"
          :disable="!ctf.granted"
          size="md"
          :to="{ name: 'ctf', params: { ctfSlug: ctf.slug } }"
        />
      </div>
      <div>
        <q-badge v-if="ctf.running === true" color="positive" class="running">
          LIVE
        </q-badge>
      </div>
      <q-space class="col-12 col-md-auto col-md-grow" />
      <div class="col-md-auto col-grow">
        <q-chip icon="fitness_center" :label="ctf.weight || '-'" />
      </div>
      <div class="col-auto">
        <a :href="ctf.ctfTimeUrl" target="_blank">
          <img height="30px" src="../assets/ctftime-logo.svg" />
        </a>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="row justify-between q-col-gutter-md ">
        <div class="task-desc text-justify col-12 col-md ctfcard-desc">
          <VueMarkdown :html="false" :source="ctf.description"></VueMarkdown>
          <q-space />
          <div class="text-right">
            <q-btn
              :disable="!ctf.granted"
              :to="{ name: 'ctf', params: { ctfSlug: ctf.slug } }"
              color="secondary"
              label="Open CTF"
            />
          </div>
        </div>
        <div class="ctfcard-cal col-auto col-grow">
          <div class="column items-center q-gutter-sm">
            <q-date today-btn :subtitle="getTimeStart(ctf)" :value="getDateRange(ctf)" range />
            <Timer :date="ctf.start" />
          </div>
        </div>
      </div>
    </q-card-section>

    <q-dialog v-model="showEditCtf"> <EditCtf :ctf="ctf" @save="showEditCtf = false" /> </q-dialog>
    <q-dialog v-model="showConfirmDelete">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm delete</div>
        </q-card-section>
        <q-card-section>
          <p>This will delete all the tasks, but not the pads.</p>
        </q-card-section>

        <q-card-section class="q-pt-none"> </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteCtf" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import VueMarkdown from "vue-markdown";
import EditCtf from "./EditCtf.vue";
import Timer from "./Timer.vue";
import {getDate} from "src/utils"
export default {
  components: { VueMarkdown, EditCtf, Timer },
  props: {
    ctf: Object
  },
  data() {
    return { showEditCtf: false, showConfirmDelete: false };
  },
  computed: {
    ...mapGetters(["currentUser", "isCtfAdmin"])
  },
  methods: {
    getTimeStart(ctf) {
      const date = new Date(ctf.start);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    async deleteCtf() {
      const errors = await this.$store.dispatch("deleteCtf", this.ctf.slug);
      showErrors(this, errors);
    },
    getDateRange(ctf) {
      const startDate = getDate(new Date(ctf.start));
      const endDate = getDate(new Date(ctf.finish));

      if (startDate == endDate) {
        return startDate;
      } else {
        return {
          from: startDate,
          to: endDate
        };
      }
    }
  }
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
