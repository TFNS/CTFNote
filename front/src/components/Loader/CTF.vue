<template>
  <div>
    <router-view v-if="ctf" :ctf="ctf" />
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent, watch } from 'vue';

export default defineComponent({
  props: {
    ctfId: { type: Number, required: true },
  },
  setup(props) {
    const { result: ctf } = ctfnote.ctfs.getCtf(() => ({
      id: props.ctfId,
    }));

    watch(ctf, (ctf) => {
      if (ctf) {
        document.title = `${ctf.title} - CTFNote`;
      }
    });

    return { ctf };
  },
  mounted() {
    if (this.ctf) document.title = `${this.ctf.title} - CTFNote`;
  },
});
</script>
