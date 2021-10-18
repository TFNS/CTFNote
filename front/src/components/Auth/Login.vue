<template>
  <q-form @submit="submit">
    <q-card>
      <q-card-section>
        <div class="text-h6">Login on CTFNote</div>
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <q-input
          v-model="form.login"
          filled
          label="Login"
          lazy-rules
          :rules="[required]"
        />
        <password-input v-model="form.password" :rules="[required]" />

        <q-input
          v-if="!!token"
          filled
          readonly
          :model-value="token"
          label="Token"
        />
        <div v-if="registrationEnabled">
          I don't have an account:
          <ctf-note-link
            name="auth-register"
            class="text-primary"
            label="register"
            underline
          />.
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end q-pa-md">
        <div class="col col-auto">
          <q-btn type="submit" label="Login" color="primary" />
        </div>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import { useLogin } from 'src/ctfnote/auth';
import { getSettings } from 'src/ctfnote/settings';
import { defineComponent, reactive } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';

export default defineComponent({
  components: { PasswordInput, CtfNoteLink },
  props: {
    token: { type: String, default: '' },
  },
  setup() {
    const { result: settings } = getSettings();
    return {
      settings,
      login: useLogin(),
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
    required(val: string) {
      if (!val) {
        return 'Please type something';
      }
    },
    submit() {
      void this.login(this.form.login, this.form.password);
    },
  },
});
</script>

<style scoped></style>
