<template>
  <q-input
    v-model="discordEventLink"
    dense
    filled
    bottom-slots
    label="Discord event link"
    hint="Format: https://discord.gg/abcdefg?event=123456789"
  >
    <template #prepend>
      <q-icon name="discord" />
    </template>
    <template #after>
      <q-btn
        class="ctfnote-input-button"
        icon="sync"
        color="positive"
        title="Import users from Discord"
        :loading="loading"
        @click="set(ctf, discordEventLink ?? '')"
      />
    </template>
  </q-input>
</template>

<script lang="ts">
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup(props) {
    return {
      me: ctfnote.me.injectMe(),
      setDiscordEventLink: ctfnote.ctfs.useSetDiscordEventLink(),
      discordEventLink: ref(props.ctf.discordEventLink),
      loading: ref(false),
    };
  },
  methods: {
    async set(ctf: Ctf, discordEventLink: string) {
      this.loading = true;
      await this.setDiscordEventLink(ctf, discordEventLink);
      this.loading = false;
    },
  },
});
</script>

<style scoped></style>
