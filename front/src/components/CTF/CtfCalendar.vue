<template>
  <q-card class="ctf-calendar-card">
    <v-calendar
      id="ctf-calendar"
      ref="calendar"
      expanded
      borderless
      transition="fade"
      :is-dark="$q.dark.isActive"
      :initial-page="model"
      :attributes="events"
      @update:pages="onPageChange"
      @dayclick="onDayClick"
    >
    </v-calendar>
    <q-card-section class="flex items-center q-gutter-sm">
      <ical-btn />
      <q-btn
        padding="6px"
        color="primary"
        icon="calendar_today"
        @click="emit('showToday')"
      >
        <q-tooltip>Show today</q-tooltip>
      </q-btn>
      <q-space />
      <q-btn dense padding="6px" icon="add" color="positive" @click="createCtf">
        <q-icon name="flag" />
        <q-tooltip class="text-no-wrap">Create a CTF</q-tooltip>
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Calendar } from 'v-calendar';
import { Ctf } from '../../ctfnote/models';
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import IcalBtn from '../Utils/IcalBtn.vue';
import EditCtfDialog from '../Dialogs/EditCtfDialog.vue';

type CalendarInstance = InstanceType<typeof Calendar>;
type EventAttributes = CalendarInstance['$props']['attributes'];
const calendar = ref<CalendarInstance>();

const props = defineProps<{
  ctfs: Ctf[];
}>();

const emit = defineEmits<{
  ctfClick: [number];
  showToday: [];
}>();

const model = defineModel<{ year: number; month: number }>({ required: true });

const $q = useQuasar();

const events = computed(() => {
  const colors = [
    'red',
    'green',
    'blue',
    'purple',
    'orange',
    'teal',
    'yellow',
    'indigo',
    'gray',
    'pink',
  ];
  const ctfEvents: EventAttributes = props.ctfs.map((ctf) => {
    return {
      bar: colors[ctf.id % colors.length],
      dates: [[ctf.startTime, ctf.endTime]],
      popover: {
        label: ctf.title,
      },
      customData: ctf,
    };
  });

  ctfEvents.push({
    highlight: true,
    dates: [new Date()],
  });

  return ctfEvents;
});

watch(model, ({ year, month }, { year: oldYear, month: oldMonth }) => {
  if (year !== oldYear || month !== oldMonth) {
    void calendar.value?.move(new Date(year, month - 1, 1));
  }
});

function onPageChange([page]: { year: number; month: number }[]) {
  if (page.year === model.value.year && page.month === model.value.month) {
    return;
  }
  model.value = {
    year: page.year,
    month: page.month,
  };
}

function onDayClick(day: { attributes: [{ customData: Ctf }] }) {
  const ctf = day.attributes
    .map((attr) => attr.customData)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .pop();

  if (ctf) {
    emit('ctfClick', ctf.id);
  }
}

function createCtf() {
  $q.dialog({
    component: EditCtfDialog,
  });
}
</script>

<style lang="scss">
.vc-dark {
  --vc-bg: $grey-10;
  --vc-popover-content-bg: #424242;
  --vc-popover-content-border: #616161;
  --vc-nav-item-active-bg: var(--q-primary);
  --vc-nav-hover-bg: var(--vc-nav-bg);
  --vc-focus-ring: transparent;

  .vc-nav-item {
    background: $grey-2;
    &.is-active {
      background: var(--q-primary);
    }
    &:hover {
      background: var(--q-primary);
      color: white;
      filter: brightness(1.3);
    }
  }

  .vc-weeks {
    border-top: 0;
  }

  .vc-title,
  .vc-arrow {
    color: white;
    background: transparent;
    transition: all 0.3s;
    &:hover {
      color: white;
      background: var(--q-primary);
      filter: brightness(1.3);
      opacity: 1;
    }
  }

  .vc-nav-arrow,
  .vc-nav-title {
    color: white;
    background: var(--q-primary);
    transition: all 0.3s;
    &:hover {
      background: var(--q-primary);
      filter: brightness(1.3);
      opacity: 1;
    }
  }
}
.vc-light {
  --vc-nav-item-active-bg: var(--q-primary);
  --vc-nav-hover-bg: var(--vc-nav-bg);
  --vc-focus-ring: transparent;

  .vc-nav-item {
    background: $grey-4;
    &.is-active {
      background: var(--q-primary);
    }
    &:hover {
      background: var(--q-primary);
      color: white;
      filter: brightness(1.3);
    }
  }

  .vc-arrow,
  .vc-title,
  .vc-nav-arrow,
  .vc-nav-title {
    color: white;
    background: var(--q-primary);
    transition: all 0.3s;
    &:hover {
      background: var(--q-primary);
      filter: brightness(1.3);
      opacity: 1;
    }
  }
}
.ctf-calendar-card {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 66px;
  #ctf-calendar {
    .vc-bars {
      width: 100%;
    }
    .vc-header {
      margin-top: 0;
      height: 42px;
    }

    &.vc-container::before {
      content: '';
      position: absolute;
      height: 42px;
      border-radius: 5px 5px 0 0;
      width: 100%;
      top: 0;
      left: 0;
      background: var(--q-primary);
    }

    .on-right {
      margin-left: 0;
    }
    .on-left {
      margin-right: 0;
    }
    .vc-weeks {
      padding-top: 8px;
    }
    .vc-nav-header {
      padding-top: 2px;
      padding-bottom: 4px;
    }
  }
}

@media (max-width: $breakpoint-md-min) {
  .ctf-calendar-card {
    position: fixed;
    top: unset;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    transition: transform 0.3s;
    flex-direction: column-reverse;
    border-top: 1px solid var(--vc-gray-500);
    clip-path: polygon(
      -100% calc(100% - 42px),
      200% calc(100% - 42px),
      200% 100%,
      -100% 100%
    );

    &:hover {
      clip-path: polygon(-100% 0, 200% 0, 200% 100%, -100% 100%);

      #ctf-calendar {
        &.vc-container::before {
          transition-delay: 0s;
          border-radius: 0;
        }
      }
    }
    transition: all 0.3s;
    .vc-pane {
      display: flex;
      flex-direction: column-reverse;
    }

    #ctf-calendar {
      &.vc-container::before {
        transition: all 0.3s;
        transition-delay: 0.3s;
        border-radius: 5px 5px 0 0;
        top: unset;
        bottom: 0;
      }
    }
    .vc-pane-header-wrapper {
      top: unset;
      bottom: 0;
    }
  }
}
</style>
