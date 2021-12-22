<template>
  <q-card>
    <q-form @submit="submit">
      <q-card-section>
        <div class="text-h5">Register</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <template v-if="registrationAnyAllowed">
          <q-input
            v-model="form.login"
            filled
            label="Choose a login"
            required
          />
          <password-input
            v-model="form.password"
            label="Choose a password"
            clearable
            required
          />
          <q-input
            v-if="!!token"
            filled
            readonly
            :model-value="token"
            hint=""
            label="Auth token"
          />
          <template v-else>
            <q-checkbox
              v-if="registrationPasswordForced"
              :model-value="true"
              disable
              title="A password is required to log on this instance."
              label="I have a password"
            />
            <q-checkbox
              v-else-if="registrationPasswordAllowed"
              v-model="usePassword"
              label="I have a password"
            />
            <password-input
              v-if="
                registrationPasswordAllowed &&
                (usePassword || registrationPasswordForced)
              "
              v-model="form.ctfnotePassword"
              filled
              clearable
              label="CTFNote password"
              required
            />
          </template>
        </template>
        <div v-else>Registration are disabled.</div>
      </q-card-section>

      <q-card-actions class="q-pa-md row justify-between">
        <div>
          I already have an account:
          <b>
            <ctf-note-link
              name="auth-login"
              class="text-primary"
              label="LOGIN"
              underline
            />
          </b>
        </div>
        <q-btn
          type="submit"
          label="Register"
          color="primary"
          :disable="!registrationAnyAllowed"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import ctfnote from 'src/ctfnote';
import { defineComponent, reactive, ref } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';

export default defineComponent({
  components: { PasswordInput, CtfNoteLink },
  props: {
    token: { type: String, default: '' },
  },
  setup() {
    return {
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      register: ctfnote.auth.useRegister(),
      registerWithToken: ctfnote.auth.useRegisterWithToken(),
      registerWithPassword: ctfnote.auth.useRegisterWithPassword(),
      settings: ctfnote.settings.injectSettings(),
      form: reactive({
        login: '',
        password: '',
        ctfnotePassword: '',
      }),
      usePassword: ref(false),
    };
  },
  computed: {
    registrationAllowed() {
      return this.settings?.registrationAllowed || !!this.token;
    },
    registrationPasswordAllowed(): boolean {
      return this.settings?.registrationPasswordAllowed ?? false;
    },
    registrationAnyAllowed() {
      return this.registrationAllowed || this.registrationPasswordAllowed;
    },
    registrationPasswordForced() {
      return !this.registrationAllowed && this.registrationPasswordAllowed;
    },
  },
  methods: {
    submit() {
      const opts = {
        message: `Logged as ${this.form.login}!`,
        icon: 'person',
      };
      let registerPromise;

      if (this.token) {
        registerPromise = this.registerWithToken(
          this.form.login,
          this.form.password,
          this.token
        );
      } else if (this.registrationPasswordForced || this.usePassword) {
        registerPromise = this.registerWithPassword(
          this.form.login,
          this.form.password,
          this.form.ctfnotePassword
        );
      } else {
        registerPromise = this.register(this.form.login, this.form.password);
      }

      void this.resolveAndNotify(registerPromise, opts);
    },
  },
});
</script>

<style scoped></style>
