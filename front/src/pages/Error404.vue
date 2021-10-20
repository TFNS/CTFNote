<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh"><q-icon name="sentiment_neutral" /></div>

      <div class="text-h2" style="opacity: 0.4">404 Page not found.</div>

      <q-btn
        class="q-mt-xl"
        color="blue"
        text-color="white"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Error404',
});
</script>
