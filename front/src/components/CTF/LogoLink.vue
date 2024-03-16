<template>
  <q-btn
    :href="ctf.ctfUrl || null"
    target="_blank"
    class="logo text-white"
    :class="{ 'no-hover': !ctf.ctfUrl }"
    type="a"
    :style="style"
    :icon="icon"
    :ripple="false"
    round
  >
    <q-tooltip :delay="400">
      <span v-if="ctf.ctfUrl"> Browse CTF website </span>
      <span v-else> No CTF website set </span>
    </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  computed: {
    style() {
      return this.ctf.logoUrl
        ? {
            '--logo-url': `url(${this.ctf.logoUrl})`,
            'background-color': '#000',
          }
        : { 'background-color': 'var(--q-primary)' };
    },
    icon() {
      return this.ctf.logoUrl ? '' : 'language';
    },
  },
});
</script>

<style scoped>
.logo {
  background: var(--logo-url);
  background-size: cover;
  background-origin: 50% 50%;
  background-position: center;
}

.no-hover {
  cursor: default;
}

.no-hover >>> .q-focus-helper {
  display: none;
}
</style>
