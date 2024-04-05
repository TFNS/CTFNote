<template>
  <q-page>
    <q-tabs indicator-color="secondary" dense align="left">
      <q-route-tab
        v-for="(tab, idx) in tabs"
        :key="idx"
        :to="tab.route"
        :label="tab.label"
        content-class="tab-button"
        :icon="tab.icon"
      />
    </q-tabs>
    <div class="q-pa-md">
      <router-view />
    </div>
    <q-page-sticky position="top-right" :offset="[18, 8]">
      <q-fab
        v-if="me.isManager"
        class="ctfs-action-btn shadow-2"
        padding="10px"
        color="positive"
        icon="add"
        vertical-actions-align="right"
        direction="down"
        push
      >
        <q-fab-action
          color="positive"
          push
          icon="add"
          label="Create"
          @click="openCreateCtfDialog"
        />
        <q-fab-action
          color="secondary"
          push
          icon="flag"
          label="Import "
          @click="openImportCtfDialog"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import EditCtfDialogVue from 'src/components/Dialogs/EditCtfDialog.vue';
import ImportCtfDialogVue from 'src/components/Dialogs/ImportCtfDialog.vue';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup() {
    return {
      me: ctfnote.me.injectMe(),
      tabs: [
        {
          label: 'Incoming',
          icon: 'query_builder',
          route: { name: 'ctfs-incoming' },
        },
        {
          label: 'Past',
          icon: 'archive',
          route: { name: 'ctfs-past' },
        },
        {
          label: 'calendar',
          icon: 'calendar_today',
          route: { name: 'ctfs-calendar' },
        },
      ],
    };
  },
  methods: {
    openCreateCtfDialog() {
      this.$q.dialog({
        component: EditCtfDialogVue,
      });
    },
    openImportCtfDialog() {
      this.$q.dialog({
        component: ImportCtfDialogVue,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.q-tab {
  min-width: 200px;
  padding-top: 5px;
}
</style>
