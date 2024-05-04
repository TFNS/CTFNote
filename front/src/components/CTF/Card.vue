<template>
  <q-card bordered class="ctf-card" :style="style">
    <card-admin-menu :ctf="ctf" />
    <q-linear-progress
      v-if="progress >= 0"
      :value="progress"
      animation-speed="0"
      color="positive"
    />
    <q-card-section class="ctf-card-header">
      <logo-link :ctf="ctf" class="ctf-card-header-logo" />
      <ctf-note-link
        name="ctf"
        :ctf="ctf"
        :label="ctf.title"
        class="ctf-card-header-title"
      >
        <q-btn flat class="full-width text-left">
          <div class="ellipsis">
            {{ ctf.title }}
          </div>
        </q-btn>
      </ctf-note-link>
      <q-chip
        v-if="running"
        square
        :size="$q.screen.lt.sm ? 'md' : 'sm'"
        color="positive"
        class="ctf-card-header-live"
      >
        LIVE
      </q-chip>

      <weight-badge :ctf="ctf" class="ctf-card-header-weight" />
      <ctf-time-link :ctf="ctf" class="ctf-card-header-ctftime" />
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <div class="q-mb-md column q-col-gutter-md background-logo">
        <div class="row q-gutter-md">
          <div class="col-auto">
            <q-chip
              color="primary"
              text-color="white"
              class="q-my-none"
              :ripple="false"
            >
              <span class="text-weight-bold">Start:</span>&nbsp;
              {{ startsAt }}
            </q-chip>
          </div>
          <div class="col-auto">
            <q-chip
              color="primary"
              text-color="white"
              class="q-my-none"
              :ripple="false"
            >
              <span class="text-weight-bold">End:</span>&nbsp;
              {{ endsAt }}
            </q-chip>
          </div>
          <a
            v-if="ctf.ctfUrl"
            class="col-auto"
            :href="ctf.ctfUrl"
            target="_blank"
          >
            <q-chip
              clickable
              color="primary"
              text-color="white"
              class="q-my-none"
              :ripple="false"
            >
              <q-icon name="link" class="q-mr-sm" />
              {{ ctfDomain || ctf.ctfUrl }}
            </q-chip>
          </a>
        </div>
        <div class="col">
          <q-markdown
            no-html
            :src="ctf.description"
            class="ctf-card-description"
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

<script setup lang="ts">
import { date } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import { computed } from 'vue';
import BtnDelete from '../CTF/BtnDelete.vue';
import BtnEdit from '../CTF/BtnEdit.vue';
import CtfTimeLink from '../CTF/CtfTimeLink.vue';
import LogoLink from '../CTF/LogoLink.vue';
import WeightBadge from '../CTF/WeightBadge.vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import CardAdminMenu from './CardAdminMenu.vue';
import { useNow } from 'src/composables/useNow';

const props = defineProps<{
  ctf: Ctf;
}>();

const now = useNow();

const running = computed(
  () => props.ctf.startTime < now.value && props.ctf.endTime > now.value
);
const startsAt = computed(() =>
  date.formatDate(props.ctf.startTime, 'YYYY-MM-DD HH:mm')
);

const endsAt = computed(() =>
  date.formatDate(props.ctf.endTime, 'YYYY-MM-DD HH:mm')
);

const progress = computed(() => {
  const start = props.ctf.startTime.getTime();
  const end = props.ctf.endTime.getTime();
  const duration = end - start;
  const elapsed = now.value.valueOf() - start;
  const progress = Math.min(elapsed / duration, 1);
  return progress;
});

const ctfDomain = computed(() => {
  try {
    const url = new URL(props.ctf?.ctfUrl ?? '');
    return url.hostname;
  } catch {
    return '';
  }
});

const style = computed(() => {
  if (props.ctf.logoUrl) {
    return { '--bgUrl': `url(${props.ctf.logoUrl})` };
  }
  return {};
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

.ctf-card {
  --description-width: 800px;
  max-width: 100%;

  .background-logo {
    &::before {
      content: '';
      background: var(--bgUrl);
      background-position: 100% 50%;
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.3;
      width: calc(100% - var(--description-width) - 48px);
      height: 100%;
      right: 16px;
      position: absolute;
      pointer-events: none;
    }
  }

  .ctf-card-description {
    max-width: var(--description-width);
    text-align: justify;
    min-height: 132px;
  }

  .ctf-card-header {
    display: grid;
    grid-template-areas: 'logo  title live space weight ctftime';
    grid-template-columns: auto auto auto 1fr auto auto auto;
    gap: 8px;
    align-items: center;

    @media (max-width: $breakpoint-sm-min) {
      grid-template-areas: 'title title title title title' 'logo live space weight ctftime';
      grid-template-columns: auto auto 1fr auto auto;
    }

    .ctf-card-header-logo {
      grid-area: logo;
    }

    .ctf-card-header-title {
      grid-area: title;
      max-width: 100%;
      min-width: 0;

      @media (max-width: $breakpoint-sm-min) {
        width: 100%;
      }
    }

    .ctf-card-header-weight {
      grid-area: weight;
    }

    .ctf-card-header-ctftime {
      grid-area: ctftime;
      --offset: 32px;

      @media (max-width: $breakpoint-sm-min) {
        --offset: 24px;
      }
      transform: translateX(var(--offset));
      margin-left: calc(-1 * var(--offset));
    }

    .ctf-card-header-live {
      grid-area: live;
      animation: blinker 0.5s ease-in infinite alternate;
    }
  }
}
</style>
