<template>
  <div class="background-logo" :style="style">
    <div class="column q-px-md">
      <div class="col q-py-md">
        <div class="row q-gutter-md items-center">
          <logo-link :ctf="ctf" />
          <div class="text-h4">
            {{ ctf.title }}
          </div>
          <btn-edit v-if="me.isManager" round :ctf="ctf" />
          <btn-delete v-if="me.isManager" round :ctf="ctf" />
          <q-space />
          <template v-if="ctf.ctftimeUrl">
            <weight-badge :ctf="ctf" />
            <ctf-time-link :ctf="ctf" />
          </template>
        </div>
      </div>
      <div class="col q-py-md">
        <div class="q-gutter-md items-center">
          <div>Start: {{ startTime }}</div>
          <div>End: {{ endTime }}</div>
        </div>
      </div>
      <div class="col q-py-md">
        <div class="row q-gutter-md">
          <div class="col">
            <div class="q-gutter-sm">
              <div class="row items-center q-gutter-md q-pa-sm">
                <div class="text-h6">Description</div>
              </div>
              <div class="row">
                <div class="col col-auto">
                  <q-markdown no-html :src="ctf.description" />
                </div>
              </div>
            </div>
          </div>
          <q-separator vertical />
          <div class="col">
            <info-credentials :ctf="ctf" />
          </div>
        </div>
      </div>
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
import CtfTimeLink from './CtfTimeLink.vue';
import InfoCredentials from './InfoCredentials.vue';
import LogoLink from './LogoLink.vue';
import WeightBadge from './WeightBadge.vue';

export default defineComponent({
  components: {
    BtnEdit,
    BtnDelete,
    WeightBadge,
    CtfTimeLink,
    LogoLink,
    InfoCredentials,
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

<style lang="scss" scopped>
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
