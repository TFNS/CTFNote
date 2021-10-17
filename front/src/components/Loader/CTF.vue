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
import { defineComponent, watch } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    ctfId: { type: Number, required: true },
  },
  setup(props) {
    const $router = useRouter();
    const { result: ctf, loading } = getCtf(() => ({
      id: props.ctfId,
    }));

    watch(ctf, (ctf) => {
      if (ctf) {
        document.title = `CTFNote - ${ctf.title}`
      }
    });

    $router.afterEach((to) => {
      if (to.name != 'task' && ctf.value) {
        document.title = `CTFNote - ${ctf.value.title}`
      }
    });
    return { ctf, loading };
  },
});
</script>
