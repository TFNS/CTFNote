<template>
  <div>
    <router-view v-if="ctf" :ctf="ctf" />
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts">
import { getCtf } from 'src/ctfnote/ctfs';
import { openCtf } from 'src/ctfnote/menu';
import { defineComponent, watch } from 'vue';

export default defineComponent({
  props: {
    ctfId: { type: Number, required: true },
  },
  setup(props) {
    const { result: ctf, loading } = getCtf(() => ({
      id: props.ctfId,
    }));

    watch(
      ctf,
      (ctf) => {
        if (ctf) openCtf(ctf);
      },
      { immediate: true }
    );
    return { ctf, loading };
  },
});
</script>
