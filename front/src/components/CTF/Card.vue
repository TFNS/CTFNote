<template>
  <q-card bordered class="ctfcard">
    <card-admin-menu :ctf="ctf" />
    <q-card-section>
      <div class="row progress-row q-gutter-md items-center" :style="style">
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
        <div class="text-justify col-sm">
          <q-markdown no-html :src="ctf.description" />
        </div>
        <div class="col-auto col-grow">
          <q-date
            mask="YYYY-MM-DDTHH:mm:ssZ"
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
        <btn-edit suze round :ctf="ctf" />
        <btn-delete round :ctf="ctf" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import { getDate, getTime } from 'src/utils';
import { defineComponent } from 'vue';
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
  computed: {
    running(): boolean {
      const now = new Date();
      return (
        new Date(this.ctf.startTime) < now && new Date(this.ctf.endTime) > now
      );
    },
    dateRange() {
      const startDate = this.ctf.startTime;
      const endDate = this.ctf.endTime;

      // If it's only one day return only the start
      if (startDate.slice(0, 10) == endDate.slice(0, 10)) {
        return startDate;
      } else {
        return {
          from: startDate,
          to: endDate,
        };
      }
    },
    startTime() {
      return getTime(this.ctf.startTime);
    },
    startDate() {
      return getDate(this.ctf.startTime);
    },
    style(): Record<string, string> {
      const start = new Date(this.ctf.startTime).getTime();
      const end = new Date(this.ctf.endTime).getTime();
      const duration = end - start;
      const elapsed = Date.now() - start;
      const progress = (elapsed / duration) * 100;
      return { '--progress-percent': `${progress.toFixed(2)}%` };
    },
  },
});
</script>

<style lang="scss" scoped>
.progress-row {
  --progress-percent: 0%;

  &::before {
    position: absolute;
    content: '';
    transition: max-width linear 1s;
    top: 1px;
    left: 4px;
    height: 2px;
    width: calc(var(--progress-percent) - 8px);
    border-radius: 5px;
    background: $positive;
    box-shadow: 0 1px 3px 0px lighten($positive, 5%),
      0 0.2px 1px 0px rgba(255, 255, 255, 0.8) inset;
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
