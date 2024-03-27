<template>
  <q-layout view="lHh Lpr lFf">
    <base-menu-bar drop-down-link="auth-login" />
    <q-page-container>
      <q-page padding class="column items-center q-pa-lg">
        <div class="auth" :class="{ 'auth-icon': $q.screen.width >= 472 }">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import BaseMenuBar from 'src/components/Menu/BaseMenuBar.vue';
import { ctfnote } from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  components: { BaseMenuBar },
  setup() {
    const settings = ctfnote.settings.provideSettings();

    for (const [name, value] of Object.entries(settings.value.style)) {
      document.documentElement.style.setProperty(`--q-${name}`, value);
    }
    return {};
  },
});
</script>

<style scoped>
.auth {
  position: relative;
  width: 360px;
}

.auth-icon::before {
  --size: 40px;
  content: '';
  width: var(--size);
  height: var(--size);
  left: calc(-1 * var(--size) - 8px);
  border-radius: 5px;
  position: absolute;
  background: url('/favicon.svg');
  background-size: var(--size);
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
</style>
