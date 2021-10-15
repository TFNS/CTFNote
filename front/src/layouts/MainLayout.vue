<template>
  <q-layout view="lHh Lpr lFf">
    <main-menu />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import MainMenu from 'src/components/MainMenu.vue';
import { ctfnote, MeKey, SettingsKey, TeamKey } from 'src/ctfnote';
import { defineComponent, provide, watch } from 'vue';
import { useQuasar } from 'quasar';
import { getTeam } from 'src/ctfnote/profiles';
export default defineComponent({
  name: 'MainLayout',
  components: { MainMenu },
  setup() {
    ctfnote.dialogs.provideQuasar(useQuasar());
    const $router = useRouter();
    const $route = useRoute();

    const { result: me } = ctfnote.me.getMe();
    const { result: settings } = ctfnote.settings.getSettings();
    const { result: team } = getTeam();

    provide(MeKey, me);
    provide(SettingsKey, settings);
    provide(TeamKey, team);

    $router.beforeEach((to, from, next) => {
      if (!to.meta.public && !me.value.profile) {
        next({ name: 'auth-login' });
      }
      next();
    });

    ctfnote.me.onLogout(() => {
      void $router.push({ name: 'auth-login' });
    });

    ctfnote.me.onLogin(() => {
      if ($route.meta.public) {
        void $router.push({ name: 'ctfs' });
      }
    });

    watch(
      () => settings.value.style,
      (s) => {
        const root = document.documentElement;
        for (const [name, value] of Object.entries(s)) {
          root.style.setProperty(`--q-${name}`, value);
        }
      },
      { immediate: true, deep: true }
    );
    return { ctfnote };
  },
});
</script>
