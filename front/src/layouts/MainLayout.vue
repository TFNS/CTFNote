<template>
  <q-layout view="lHh Lpr lFf">
    <main-menu>
      <router-view name="menu" />
    </main-menu>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import MainMenu from 'src/components/Menu/MainMenu.vue';
import { ctfnote } from 'src/ctfnote';
import { defineComponent, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  name: 'MainLayout',
  components: { MainMenu },
  setup() {
    ctfnote.dialogs.provideQuasar(useQuasar());
    const $router = useRouter();
    const $route = useRoute();

    const { result: me } = ctfnote.me.getMe();
    const { result: settings } = ctfnote.settings.getSettings();

    $router.beforeEach((to, from, next) => {
      if (!to.meta.public && !me.value.profile) {
        return next({ name: 'auth-login' });
      }
      next();
    });

    ctfnote.me.onLogout(() => {
      if (!$route.meta.public) {
        void $router.push({ name: 'auth-login' });
      }
    });

    ctfnote.me.onLogin(() => {
      if ($route.meta.public) {
        void $router.push({ name: 'ctfs' });
      }
    });

    const updateTitle = (title?: string) => {
      void nextTick(() => {
        document.title = title ? `CTFNote - ${title}` : 'CTFNote';
      });
    };

    updateTitle($route.meta.title as string);
    $router.afterEach((to) => {
      if (typeof to.meta.title == 'string') {
        updateTitle(to.meta.title);
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
