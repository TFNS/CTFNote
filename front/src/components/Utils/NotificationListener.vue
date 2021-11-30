<template>
  <div></div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const { onResult: onFlag } = ctfnote.ctfs.useOnFlag();
    const { onResult: onCtfCreated } = ctfnote.ctfs.useOnCtfCreated();
    const { onResult: onProfileCreated } =
      ctfnote.profiles.useOnProfileCreated();

    ctfnote.ctfs.useOnCtfDeleted();
    ctfnote.ctfs.useOnCtfUpdate();
    ctfnote.ctfs.useOnTaskUpdate();

    const { globalNotify } = ctfnote.ui.useNotify();

    onProfileCreated((profile) =>
      globalNotify({
        message: `${profile.username} joined CTFNote!`,
        icon: 'person',
      })
    );
    onCtfCreated((ctf) =>
      globalNotify({ message: `CTF ${ctf.title} created!`, icon: 'flag' })
    );
    onFlag((task) =>
      globalNotify({ message: `Task ${task.title} solved!`, icon: 'flag' })
    );

    return {};
  },
});
</script>

<style scoped></style>
