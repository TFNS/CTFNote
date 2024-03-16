<template>
  <base-menu-bar
    :drop-down-label="$q.screen.gt.xs ? me.profile.username : undefined"
    drop-down-link="settings"
    :show-logout="true"
    :show-search="true"
  >
    <template #after-title>
      <slot />
    </template>
    <template #dropdown>
      <q-item
        v-if="me.isAdmin"
        clickable
        :to="{ name: 'admin' }"
        active-class="dimmed-background"
      >
        <q-item-section side>
          <q-avatar icon="settings" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Admin</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="me.isLogged"
        clickable
        :to="{ name: 'settings' }"
        active-class="dimmed-background"
      >
        <q-item-section side>
          <q-avatar icon="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Profile</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="me.isLogged"
        clickable
        :to="{ name: 'team' }"
        active-class="dimmed-background"
      >
        <q-item-section side>
          <q-avatar icon="group" />
        </q-item-section>
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

<style scoped>
.dimmed-background {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
