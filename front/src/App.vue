<template>
  <router-view />
</template>

<script lang="ts">
import { useGlobalQueryLoading } from '@vue/apollo-composable';
import { defineComponent, watch } from 'vue';

export default defineComponent({
  name: 'App',

  mounted() {
    const loading = useGlobalQueryLoading();

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
      { immediate: true },
    );
  },
});
</script>
