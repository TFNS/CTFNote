<template>
  <q-form @submit="submit">
    <q-card>
      <q-card-section>
        <div class="text-h6">Register on CTFNote</div>
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <template v-if="registrationAnyAllowed">
          <q-input
            v-model="form.login"
            filled
            label="Login"
            lazy-rules
            :rules="[required]"
          />
          <password-input
            v-model="form.password"
            clearable
            :rules="[required]"
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
              :rules="[required]"
            />
          </template>
        </template>
        <div v-else>Registration are disabled.</div>
        <div>
          I aready have an account:
          <ctf-note-link
            name="auth-login"
            class="text-primary"
            label="login"
            underline
          />.
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end q-pa-md">
        <div class="col col-auto">
          <q-btn
            type="submit"
            label="Register"
            color="primary"
            :disable="!registrationAnyAllowed"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import {
  useRegister,
  useRegisterWithPassword,
  useRegisterWithToken
} from 'src/ctfnote/auth';
import { getSettings } from 'src/ctfnote/settings';
import { defineComponent, reactive, ref } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';

export default defineComponent({
  components: { PasswordInput, CtfNoteLink },
  props: {
    token: { type: String, default: '' },
  },
  setup() {
    const { result: settings } = getSettings();

    return {
      register: useRegister(),
      registerWithToken: useRegisterWithToken(),
      registerWithPassword: useRegisterWithPassword(),
      settings,
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
    required(val: string) {
      if (!val) {
        return 'Please type something';
      }
    },
    submit() {
      if (this.token) {
        return this.registerWithToken(
          this.form.login,
          this.form.password,
          this.token
        );
      }

      if (this.registrationPasswordForced || this.usePassword) {
        return this.registerWithPassword(
          this.form.login,
          this.form.password,
          this.form.ctfnotePassword
        );
      }

      return this.register(this.form.login, this.form.password);
    },
  },
});
</script>

<style scoped></style>
