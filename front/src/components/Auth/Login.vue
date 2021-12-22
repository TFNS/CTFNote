<template>
  <q-card>
    <q-form @submit="submit">
      <q-card-section>
        <div class="text-h5">Login</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="form.login"
          filled
          autocomplete="username"
          autocapitalize="none"
          label="Login"
          required
        />
        <password-input v-model="form.password" required />

        <q-input
          v-if="!!token"
          filled
          readonly
          :model-value="token"
          label="Token"
        />
      </q-card-section>
      <q-card-actions class="q-pa-md row justify-between">
        <div v-if="registrationEnabled">
          I don't have an account:
          <b>
            <ctf-note-link
              name="auth-register"
              class="text-primary"
              label="REGISTER"
              underline
            />
          </b>
        </div>
        <div v-else />
        <q-btn type="submit" label="Login" color="primary" />
      </q-card-actions>
    </q-form>
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
