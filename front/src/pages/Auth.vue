<template>
  <q-page padding class="row justify-center">
    <div class="col-md-4 col-sm-12 q-mt-lg auth">
      <router-view />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped>
.auth {
  position: relative;
}
.auth::before {
  --size: 40px;
  content: '';
  width: var(--size);
  height: var(--size);
  left: calc(-1 * var(--size) - 8px);
  border-radius: 5px;
  position: absolute;
  background: url('/favicon.svg');
  background-size: var(--size);
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
</style>
