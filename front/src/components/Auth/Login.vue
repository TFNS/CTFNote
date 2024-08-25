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

export default defineComponent({
  components: { PasswordInput, CtfNoteLink },
  props: {
    token: { type: String, default: '' },
  },
  setup() {
    return {
      settings: ctfnote.settings.injectSettings(),
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
          message: `Logged as ${login}!`,
          icon: 'person',
        }
      );
    },
  },
});
</script>

<style scoped></style>
