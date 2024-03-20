<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title class="row items-center q-gutter-md">
        <ctf-note-link name="index" class="text-white" underline>
          <q-btn
            flat
            no-caps
            :class="{
              'ctfnote-logo-xs': $q.screen.xs && showLogout,
              'ctfnote-logo-lg': $q.screen.gt.xs || !showLogout,
            }"
          >
            <q-img
              src="/favicon-transparent.svg"
              width="30px"
              :class="{ 'q-mr-sm': $q.screen.gt.xs || !showLogout }"
            />
            <span v-if="$q.screen.gt.xs || !showLogout">CTFNote</span>
          </q-btn>
        </ctf-note-link>
        <slot name="after-title" />
      </q-toolbar-title>
      <q-btn
        v-if="showSearch"
        flat
        round
        dense
        icon="search"
        class="q-mr-xs"
        @click="openSearchDialog()"
      >
        <q-tooltip :delay="400">Global search</q-tooltip>
      </q-btn>
      <q-btn-dropdown
        flat
        no-caps
        :label="dropDownLabel"
        :dropdown-icon="
          $q.screen.xs && showLogout ? 'more_vert' : 'arrow_drop_down'
        "
        :no-icon-animation="$q.screen.xs && showLogout"
        class="q-pr-sm"
        :class="{ 'q-pl-sm': dropDownLabel == undefined }"
      >
        <q-list class="text-center" dense>
          <slot name="dropdown" />

          <q-separator v-if="showLogout" inset spaced />

          <q-item style="padding-left: 4px">
            <q-toggle
              v-model="darkMode"
              label="Switch theme"
              checked-icon="brightness_3"
              unchecked-icon="brightness_7"
            />
          </q-item>
          <q-item v-if="showLogout" style="padding-left: 4px">
            <q-toggle
              v-model="liveMode"
              label="Show secrets"
              checked-icon="visibility"
              unchecked-icon="visibility_off"
            />
          </q-item>

          <q-separator v-if="showLogout" inset spaced />

          <q-item v-if="showLogout" clickable @click="logout">
            <q-item-section side>
              <q-avatar icon="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import CtfNoteLink from 'src/components/Utils/CtfNoteLink.vue';
import ctfnote from 'src/ctfnote';
import { useStoredSettings } from 'src/extensions/storedSettings';
import { defineComponent, ref, watch } from 'vue';
import SearchDialogVue from '../Dialogs/SearchDialog.vue';

export default defineComponent({
  components: { CtfNoteLink },
  props: {
    dropDownLabel: { type: String, default: undefined },
    dropDownLink: { type: String, required: true },
    showLogout: { type: Boolean, default: false },
    showSearch: { type: Boolean, default: false },
  },

  setup() {
    const $q = useQuasar();
    const logout = ctfnote.auth.useLogout();
    const { makePersistant } = useStoredSettings();
    const liveMode = makePersistant('live-mode', ref(true));
    const darkMode = makePersistant('dark-mode', ref(true));

    watch(darkMode, (v) => $q.dark.set(v), { immediate: true });
    watch(
      liveMode,
      (v) =>
        !v
          ? document.body.classList.add('live-mode')
          : document.body.classList.remove('live-mode'),
      { immediate: true }
    );

    return {
      liveMode,
      darkMode,
      logout,
    };
  },
  methods: {
    openSearchDialog() {
      this.$q.dialog({
        component: SearchDialogVue,
      });
    },
  },
});
</script>

<style scoped>
.ctfnote-logo-xs {
  padding-left: 8px;
  padding-right: 8px;
}

.ctfnote-logo-lg {
  padding-left: 8px;
  padding-right: 11px;
}
</style>
