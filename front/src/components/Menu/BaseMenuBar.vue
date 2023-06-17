<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title class="row items-center q-gutter-md">
        <ctf-note-link name="index" class="text-white" underline>
          <q-img src="/favicon-transparent.svg" width="30px" class="q-mr-md" />
          <q-btn flat no-caps v-if="$q.screen.gt.xs">CTFNote</q-btn>
        </ctf-note-link>
        <slot name="after-title" />
        <q-btn
          v-if="showSearch"
          flat
          round
          dense
          icon="search"
          class="q-mr-xs"
          @click="openSearchDialog()"
        />
      </q-toolbar-title>
      <q-btn-dropdown
        flat
        :label="dropDownLabel"
        split
        align="right"
        content-class="drop-menu"
        :to="{ name: dropDownLink }"
      >
        <q-list class="text-center">
          <slot name="dropdown" />
          <q-item>
            <q-item-section>
              <div>
                <q-toggle
                  v-model="darkMode"
                  title="Switch theme"
                  size="lg"
                  checked-icon="brightness_3"
                  unchecked-icon="brightness_7"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div>
                <q-toggle
                  v-model="liveMode"
                  title="Show secrets"
                  size="lg"
                  checked-icon="visibility"
                  unchecked-icon="visibility_off"
                />
              </div>
            </q-item-section>
          </q-item>

          <q-separator v-if="showLogout" inset spaced />

          <q-item v-if="showLogout" clickable @click="logout">
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
    dropDownLabel: { type: String, required: true },
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

<style>
.drop-menu {
  min-width: 150px !important;
}
</style>
