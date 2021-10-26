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
        if (!isLoading) {
          const loadingscreen = document.getElementById('loadingscreen');
          if (!loadingscreen) return;
          loadingscreen.classList.add('fadeout');
          window.setTimeout(() => (loadingscreen.style.display = 'none'), 1500);
        }
      }
    );
  },
});
</script>
