<template>
  <base-menu-bar
    :drop-down-label="me.profile.username"
    drop-down-link="settings"
    :show-logout="true"
  >
    <template #after-title>
      <slot />
    </template>
    <template #dropdown>
      <q-item v-if="me.isAdmin" clickable :to="{ name: 'admin' }">
        <q-item-section>
          <q-item-label>Admin</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="me.isLogged" clickable :to="{ name: 'settings' }">
        <q-item-section>
          <q-item-label>Profile</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="me.isLogged" clickable :to="{ name: 'team' }">
        <q-item-section>
          <q-item-label>Team</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </base-menu-bar>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import BaseMenuBar from './BaseMenuBar.vue';

export default defineComponent({
  components: { BaseMenuBar },

  setup() {
    return {
      me: ctfnote.me.injectMe(),
    };
  },
});
</script>
