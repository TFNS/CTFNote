<template>
  <q-card bordered class="ctfcard">
    <card-admin-menu :ctf="ctf" />
    <q-linear-progress
      v-if="progress >= 0"
      :value="progress"
      animation-speed="0"
      color="positive"
    />
    <q-card-section>
      <div class="row q-gutter-md items-center">
        <div class="col-auto">
          <logo-link :ctf="ctf" />
        </div>
        <div class="col-auto">
          <ctf-note-link name="ctf" :ctf="ctf" :label="ctf.title">
            <q-btn flat :label="ctf.title" />
          </ctf-note-link>
        </div>
        <div class="col-auto">
          <q-badge v-if="running" color="positive" class="running">
            LIVE
          </q-badge>
        </div>

        <q-space />
        <template v-if="ctf.ctftimeUrl">
          <div class="col-auto">
            <weight-badge :ctf="ctf" />
          </div>
          <div class="col-auto">
            <ctf-time-link :ctf="ctf" />
          </div>
        </template>
      </div>
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <div class="row justify-between q-col-gutter-md">
        <div class="text-justify col-sm">
          <q-markdown no-html :src="ctf.description" />
        </div>
        <div class="col-auto col-grow">
          <q-date
            today-btn
            :title="startDate"
            :subtitle="startTime"
            :model-value="dateRange"
            range
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-sm row">
        <ctf-note-link name="ctf" :ctf="ctf" :label="ctf.title">
          <q-btn color="primary" icon="flag" label="Open Ctf" />
        </ctf-note-link>
        <q-space />
        <btn-edit round :ctf="ctf" />
        <btn-delete round :ctf="ctf" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { date } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import BtnDelete from '../CTF/BtnDelete.vue';
import BtnEdit from '../CTF/BtnEdit.vue';
import CtfTimeLink from '../CTF/CtfTimeLink.vue';
import LogoLink from '../CTF/LogoLink.vue';
import WeightBadge from '../CTF/WeightBadge.vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import CardAdminMenu from './CardAdminMenu.vue';

export default defineComponent({
  components: {
    LogoLink,
    WeightBadge,
    CtfTimeLink,
    BtnEdit,
    BtnDelete,
    CardAdminMenu,
    CtfNoteLink,
  },
  props: { ctf: { type: Object as () => Ctf, required: true } },
  setup() {
    const now = ref(new Date());
    let interval = 0;
    const watcher = () => {
      return (now.value = new Date());
    };
    onMounted(() => {
      interval = window.setInterval(watcher, 1000);
    });
    onUnmounted(() => {
      window.clearInterval(interval);
    });
    return { now };
  },
  computed: {
    running(): boolean {
      return this.ctf.startTime < this.now && this.ctf.endTime > this.now;
    },
    dateRange() {
      const startDate = date.formatDate(this.ctf.startTime, 'YYYY/MM/DD');
      const endDate = date.formatDate(this.ctf.endTime, 'YYYY/MM/DD');
      // If it's only one day return only the start
      if (startDate == endDate) {
        return startDate;
      } else {
        return {
          from: startDate,
          to: endDate,
        };
      }
    },
    startTime() {
      return date.formatDate(this.ctf.startTime, 'HH:mm');
    },
    startDate() {
      return date.formatDate(this.ctf.startTime, 'YYYY/MM/DD');
    },
    progress() {
      const start = this.ctf.startTime.getTime();
      const end = this.ctf.endTime.getTime();
      const duration = end - start;
      const elapsed = this.now.valueOf() - start;
      const progress = Math.min(elapsed / duration, 1);
      return progress;
    },
  },
});
</script>

<style lang="scss" scoped>
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
