<template>
  <div></div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';

import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const { onResult: onFlag } = ctfnote.ctfs.useOnFlag();
    const { onResult: onCtfCreated } = ctfnote.ctfs.useOnCtfCreated();
    const { onResult: onProfileCreated } =
      ctfnote.profiles.useOnProfileCreated();

    ctfnote.ctfs.useOnCtfDeleted();
    ctfnote.ctfs.useOnCtfUpdate();
    ctfnote.ctfs.useOnTaskUpdate();

    const notify = (message: string, icon?: string) => {
      $q.notify({
        position: 'top-right',
        color: 'positive',
        icon,
        timeout: 2500,
        message,
      });
    };

    onProfileCreated((profile) =>
      notify(`${profile.username} joined CTFNote!`, 'person')
    );
    onCtfCreated((ctf) => notify(`CTF ${ctf.title} created!`, 'flag'));
    onFlag((task) => notify(`Task ${task.title} solved!`, 'flag'));

    return {};
  },
});
</script>

<style scoped></style>
