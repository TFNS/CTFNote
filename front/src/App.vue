<template>
  <router-view />
</template>
<script lang="ts">
import { useGlobalQueryLoading } from '@vue/apollo-composable';
import { defineComponent, watch } from 'vue';

import SearchDialog from 'src/components/Dialogs/SearchDialog.vue';

export default defineComponent({
  name: 'App',
  mounted() {
    const loading = useGlobalQueryLoading();

    // Maybe we want to move this listener somewhere else
    // Because this will be rendered/executed when the user is not authenticated as well
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (!(e.ctrlKey && e.key == 'k')) return;

      e.preventDefault();

      this.$q.dialog({
        component: SearchDialog,
      });
    });

    watch(
      loading,
      (isLoading) => {
        const loadingscreen = document.getElementById('loadingscreen');
        if (!loadingscreen) return;

        if (isLoading) {
          loadingscreen.classList.remove('fadeout');
        } else {
          loadingscreen.classList.add('fadeout');
        }
      },
      { immediate: true }
    );
  },
});
</script>
