<template>
  <div>
    <router-view v-if="ctf" :ctf="ctf" />
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

const setTitle = (ctf: { title: string } | null) => {
  if (ctf) {
    document.title = `${ctf.title} | CTFNote`;
  }
};

export default defineComponent({
  props: {
    ctfId: { type: Number, required: true },
  },
  setup(props) {
    const route = useRoute();
    const { result: ctf } = ctfnote.ctfs.getCtf(() => ({
      id: props.ctfId,
    }));

    // Watch for manual CTF name changes
    watch(ctf, (ctf) => setTitle(ctf));

    // Watch for Vue route changes (required to change the title when the page was already mounted)
    watch(
      () => route.fullPath,
      () => setTitle(ctf.value),
    );

    return { ctf };
  },
  mounted() {
    setTitle(this.ctf);
  },
});
</script>
