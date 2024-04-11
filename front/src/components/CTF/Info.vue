<template>
  <div class="background-logo" :style="style">
    <div class="q-gutter-md">
      <div class="row items-center" style="width: calc(100vw - 16px)">
        <div class="row q-gutter-md no-wrap q-mb-md">
          <logo-link :ctf="ctf" style="height: 42px" />
          <div class="text-h4">
            {{ ctf.title }}
          </div>

          <template v-if="me.isManager">
            <q-btn
              v-if="$q.screen.xs"
              icon="settings"
              round
              color="primary"
              class="q-mr-md"
              style="height: 42px"
            >
              <card-admin-menu :ctf="ctf" :context-menu="false" />
            </q-btn>
            <template v-else>
              <btn-edit
                v-if="me.isManager"
                round
                :ctf="ctf"
                style="height: 42px"
              />
              <btn-delete
                v-if="me.isManager"
                round
                :ctf="ctf"
                class="q-mr-md"
                style="height: 42px"
              />
            </template>
          </template>
        </div>

        <q-space />

        <div
          v-if="ctf.ctftimeUrl"
          class="row no-wrap q-ml-auto q-pr-md q-mb-md"
        >
          <weight-badge :ctf="ctf" class="q-ml-none q-my-none q-mr-md" />
          <ctf-time-link :ctf="ctf" />
        </div>
      </div>

      <div class="row q-ml-sm q-gutter-sm q-mt-none">
        <q-chip
          color="primary"
          text-color="white"
          class="q-my-none"
          :ripple="false"
        >
          <span class="text-weight-bold">Start:</span>&nbsp;
          {{ startTime }}
        </q-chip>
        <q-chip
          color="primary"
          text-color="white"
          class="q-my-none"
          :ripple="false"
        >
          <span class="text-weight-bold">End:</span>&nbsp;
          {{ endTime }}
        </q-chip>

        <q-space />
      </div>

      <div class="row q-gutter-md">
        <div class="col">
          <div class="q-gutter-sm">
            <div class="row q-gutter-md q-pl-sm">
              <div class="text-h6">Description</div>
            </div>
            <div class="row">
              <div class="col col-auto hide-last-newline">
                <q-markdown no-html :src="ctf.description" />
              </div>
            </div>
          </div>
        </div>

        <template v-if="$q.screen.gt.xs">
          <q-separator vertical class="q-mx-md" />
          <div class="col">
            <info-credentials :ctf="ctf" />
          </div>
        </template>
      </div>

      <template v-if="$q.screen.xs">
        <q-separator />
        <div class="col">
          <info-credentials :ctf="ctf" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { date } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import BtnDelete from './BtnDelete.vue';
import BtnEdit from './BtnEdit.vue';
import CardAdminMenu from './CardAdminMenu.vue';
import CtfTimeLink from './CtfTimeLink.vue';
import InfoCredentials from './InfoCredentials.vue';
import LogoLink from './LogoLink.vue';
import WeightBadge from './WeightBadge.vue';

export default defineComponent({
  components: {
    BtnEdit,
    BtnDelete,
    CardAdminMenu,
    CtfTimeLink,
    InfoCredentials,
    LogoLink,
    WeightBadge,
  },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    return {
      me: ctfnote.me.injectMe(),
    };
  },
  computed: {
    style() {
      return {
        '--bgUrl': this.ctf.logoUrl ? `url(${this.ctf.logoUrl})` : 'none',
      };
    },
    startTime() {
      return date.formatDate(this.ctf.startTime, 'YYYY-MM-DD HH:mm');
    },
    endTime() {
      return date.formatDate(this.ctf.endTime, 'YYYY-MM-DD HH:mm');
    },
  },
});
</script>

<style lang="scss" scoped>
.background-logo {
  padding-bottom: 5px;
  &::before {
    content: '';
    background: var(--bgUrl);
    background-position: 90% 50%;
    background-size: contain;
    background-repeat: no-repeat;
    backdrop-filter: opacity(20%);

    opacity: 0.3;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: 0;
  }
  & * {
    z-index: 1;
  }
}
</style>

<style>
.hide-last-newline p:last-child {
  display: inline;
}
</style>
