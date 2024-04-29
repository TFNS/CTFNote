<template>
  <q-layout view="lHh Lpr lFf">
    <main-menu>
      <router-view name="menu" />
    </main-menu>
    <q-page-container>
      <notification-listener />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import MainMenu from 'src/components/Menu/MainMenu.vue';
import NotificationListener from 'src/components/Utils/NotificationListener.vue';
import { ctfnote } from 'src/ctfnote';
import { defineComponent } from 'vue';

import useSearchDialog from 'src/composables/search';

export default defineComponent({
  name: 'MainLayout',
  components: { MainMenu, NotificationListener },
  setup() {
    ctfnote.me.provideMe();
    ctfnote.tags.provideTags();
    ctfnote.profiles.provideTeam();

    const settings = ctfnote.settings.provideSettings();

    for (const [name, value] of Object.entries(settings.value.style)) {
      document.documentElement.style.setProperty(`--q-${name}`, value);
    }

    useSearchDialog();

    return {};
  },
});
</script>
