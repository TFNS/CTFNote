<template>
  <q-card>
    <q-form @submit="submit">
      <q-card-section>
        <div class="text-h5">Login</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
        <q-input
          v-model="form.login"
          filled
          dense
          autocomplete="username"
          autocapitalize="none"
          label="Username"
          required
          autofocus
        />
        <password-input v-model="form.password" dense required />

        <q-input
          v-if="!!token"
          filled
          readonly
          :model-value="token"
          label="Token"
        />
      </q-card-section>

      <q-card-actions class="row q-px-md q-pb-md">
        <q-btn type="submit" label="Login" color="primary" class="full-width" />
        <div v-if="settings.oauth2Enabled" class="row fit no-wrap items-center">
          <q-separator class="col" />
          <div class="col-grow q-mx-sm q-pa-sm">or</div>
          <q-separator class="col" />
        </div>
        <q-btn
          v-if="settings.oauth2Enabled"
          type="button"
          label="Login with OAuth2"
          color="primary"
          class="full-width"
          @click="redirectToOAuth2"
        />
      </q-card-actions>
    </q-form>
  </q-card>

  <q-card class="q-mt-md">
    <q-card-actions v-if="registrationEnabled" class="row q-px-md">
      <span>Don't have an account?</span>
      <q-space />
      <ctf-note-link name="auth-register">
        <q-btn flat color="primary">Register</q-btn>
      </ctf-note-link>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import { ctfnote } from 'src/ctfnote';
import { defineComponent, reactive } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import * as oauth2 from 'openid-client';

export default defineComponent({
  components: { PasswordInput, CtfNoteLink },
  props: {
    token: { type: String, default: '' },
  },
  setup() {
    return {
      settings: ctfnote.settings.injectSettings(),
      oauth2Settings: ctfnote.settings.getOAuth2Settings().result,
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      login: ctfnote.auth.useLogin(),
      allowRegistration: true,
      form: reactive({
        login: '',
        password: '',
      }),
    };
  },
  computed: {
    registrationEnabled() {
      return (
        this.settings.registrationAllowed ||
        this.settings.registrationPasswordAllowed
      );
    },
  },
  methods: {
    submit() {
      const login = this.form.login;
      void this.resolveAndNotify(
        this.login(this.form.login, this.form.password),
        {
          message: `Logged in as ${login}!`,
          icon: 'person',
        },
      );
    },
    async redirectToOAuth2() {
      const oauth2Config = new oauth2.Configuration(
        {
          issuer: this.oauth2Settings.issuer,
          authorization_endpoint: this.oauth2Settings.authorizationEndpoint,
        },
        this.oauth2Settings.clientId,
      );

      const pkceCodeVerifier = oauth2.randomPKCECodeVerifier();
      const pkceCodeChallenge =
        await oauth2.calculatePKCECodeChallenge(pkceCodeVerifier);
      const state = oauth2.randomState();
      sessionStorage.setItem('pkceCodeVerifier', pkceCodeVerifier);
      sessionStorage.setItem('state', state);

      let params: Record<string, string> = {
        state,
        scope: this.oauth2Settings.scope,
        redirect_uri: document.location.origin + '/api/auth/oauth2/callback',
        code_challenge: pkceCodeChallenge,
        code_challenge_method: 'S256',
      };
      document.location.replace(
        oauth2.buildAuthorizationUrl(oauth2Config, params),
      );
    },
  },
});
</script>

<style scoped></style>
