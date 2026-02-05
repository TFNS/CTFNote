<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">Logging in ...</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ctfnote } from 'src/ctfnote';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    callbackUrl: { type: String, default: '' },
  },
  setup() {
    return {
      ...ctfnote.ui.useNotify(),
      loginWithOAuth2: ctfnote.auth.useLoginWithOAuth2(),
    };
  },
  mounted() {
    const loadingscreen = document.getElementById('loadingscreen');
    if (!loadingscreen) return;
    loadingscreen.classList.add('force');

    const $router = useRouter();

    this.loginWithOAuth2(
      window.location.origin + this.$props.callbackUrl,
      sessionStorage.getItem('state') || undefined,
      sessionStorage.getItem('pkceCodeVerifier') || undefined,
    )
      .then((login) => {
        this.notifySuccess({
          message: `Logged in as ${login || ''}!`,
          icon: 'person',
        });
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : 'Unknow error';
        this.notifyError(message);
        void $router.push({ name: 'auth-login' });
      });
  },
  unmounted() {
    const loadingscreen = document.getElementById('loadingscreen');
    if (!loadingscreen) return;
    loadingscreen.classList.remove('force');
  },
});
</script>

<style>
#loadingscreen.force {
  transform: none !important;
  transition: none !important;
  pointer-events: none !important;
}
</style>
