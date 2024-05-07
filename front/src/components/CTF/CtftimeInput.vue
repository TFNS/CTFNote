<template>
  <q-input
    v-model="model"
    label="CTFTime Link"
    filled
    dense
    @keypress.enter.prevent="refresh"
  >
    <template #prepend>
      <div class="q-icon svg-icon">
        <img src="/ctftime-icon.svg" />
      </div>
    </template>
    <template #append>
      <q-btn
        :loading="state === 'loading'"
        :disable="!ctftimeId"
        :icon="icon"
        :color="color"
        size="sm"
        dense
        @click="refresh"
      >
        <q-tooltip v-if="ctftimeId">
          {{ 'Fetch from CTFTime' }}
        </q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import ctfnote from 'src/ctfnote';
import { CtftimeCtfFragment } from 'src/generated/graphql';
import { computed, ref, watch } from 'vue';

const emit = defineEmits<{ refresh: [CtftimeCtfFragment] }>();
const model = defineModel<string | null>({ required: true });

const state = ref<'pending' | 'loading' | 'success' | 'error'>('pending');

const color = computed(() => {
  switch (state.value) {
    case 'success':
      return 'green';
    case 'error':
      return 'red';
    default:
      return 'primary';
  }
});

const icon = computed(() => {
  switch (state.value) {
    case 'success':
      return 'done';
    case 'error':
      return 'error';
    default:
      return 'refresh';
  }
});

const { notifyError } = ctfnote.ui.useNotify();
const fetchFromCtftime = ctfnote.ctfs.useFetchFromCtftime();

const ctftimeId = computed(() => {
  const s = model.value;
  if (!s) {
    return null;
  }
  const url = s.trim();
  const idReg = /^\d+$/;
  const urlReg = /^(?:https?:\/\/)?ctftime\.org\/event\/(\d+)\/?/i;

  if (idReg.exec(url)) {
    return parseInt(url);
  }
  const match = urlReg.exec(url);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
});

watch(
  model,
  () => {
    if (model.value?.match(/^\d+$/)) {
      model.value = `https://ctftime.org/event/${model.value}`;
    }
  },
  { flush: 'sync' }
);

watch(ctftimeId, () => {
  if (ctftimeId.value) {
    state.value = 'pending';
  }
});

function refresh() {
  if (!ctftimeId.value || state.value === 'loading') {
    return;
  }
  state.value = 'loading';
  fetchFromCtftime(ctftimeId.value)
    .then((r) => {
      state.value = 'success';
      emit('refresh', r);
    })
    .catch(() => {
      notifyError('Failed to fetch CTF from CTFTime');
      state.value = 'error';
    });
}
</script>
