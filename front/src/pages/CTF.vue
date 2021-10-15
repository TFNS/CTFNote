<template>
  <q-page>
    <q-tabs
      dense
      active-color="secondary"
      indicator-color="secondary"
      align="left"
      narrow-indicator
    >
      <q-route-tab :to="infoLink" label="Info" />
      <q-route-tab :to="taskLink" label="Tasks" :disable="!ctf.granted" />
      <q-route-tab v-show="me.isMember" :to="guestLink" label="Guests" />
    </q-tabs>
    <q-card>
      <q-separator />
      <q-card-section>
        <router-view :ctf="ctf" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Ctf, MeKey } from 'src/ctfnote';
import { ctfLink, injectStrict } from 'src/utils';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const me = injectStrict(MeKey);

    return { me };
  },
  computed: {
    infoLink() {
      this.ctf;
      return ctfLink(this.ctf, 'ctf-info');
    },
    taskLink() {
      return ctfLink(this.ctf, 'ctf-tasks');
    },
    guestLink() {
      return ctfLink(this.ctf, 'ctf-guests');
    },
  },
});
</script>
