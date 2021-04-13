<template>
  <q-page>
    <q-tabs class="bg-light" v-model="tab" indicator-color="primary" dense align="left">
      <q-route-tab :to="{ name: 'adminsettings' }" label="settings" icon="tune" />
      <q-route-tab :to="{ name: 'adminusers' }" content-class="tab-button" label="Users" icon="people" />
    </q-tabs>
    <router-view />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: null
    };
  }
};
</script>

<style lang="scss" scoped>
.q-tab {
  min-width: 200px;
  padding-top: 5px;
}
</style>
