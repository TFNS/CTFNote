<template>
  <q-page>
    <q-tabs v-model="tab" indicator-color="secondary" dense align="left">
      <q-route-tab
        :to="{ name: 'admin-registration' }"
        label="Authentication"
        icon="lock"
      />
      <q-route-tab :to="{ name: 'admin-theme' }" label="theme" icon="palette" />
      <q-route-tab
        :to="{ name: 'admin-users' }"
        content-class="tab-button"
        label="Users"
        icon="groups"
      />
    </q-tabs>
    <div class="q-pa-md">
      <router-view />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    return { tab: ref(null) };
  },
});
</script>

<style lang="scss" scoped>
.q-tab {
  min-width: 200px;
  padding-top: 5px;
}
</style>
