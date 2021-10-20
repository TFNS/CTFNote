<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  mounted() {
    const loadingscreen = document.getElementById('loadingscreen');
    if (loadingscreen) {
      loadingscreen.classList.add('fadeout');
      window.setTimeout(() => (loadingscreen.style.display = 'none'), 1500);
    }
  },
});
</script>
