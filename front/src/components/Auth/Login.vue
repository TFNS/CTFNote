<template>
  <q-card v-if="noAuthAvailable" class="bg-negative">
    <q-card-section>
      <div class="text-h5 text-white">
        <q-icon name="warning" size="md" class="q-mr-sm" />
        Authentication Misconfiguration
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none text-white">
      <p>This CTFNote instance is misconfigured - no authentication methods are enabled.</p>
      <p>Please contact your administrator to enable either:</p>
      <ul>
        <li>Local authentication (LOCAL_AUTH_ENABLED=true)</li>
        <li>LDAP authentication (LDAP_ENABLED=true)</li>
      </ul>
    </q-card-section>
  </q-card>
  
  <q-card v-else>
    <q-form @submit="submit">
      <q-card-section>
        <div class="text-h5">Login</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
        <q-tabs v-if="showTabs" v-model="authMethod" class="text-grey" active-color="primary" indicator-color="primary" align="justify">
          <q-tab v-if="localAuthEnabled" name="local" label="Local Login" />
          <q-tab v-if="ldapAuthEnabled" name="ldap" label="LDAP Login" />
        </q-tabs>

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
import { defineComponent, reactive, ref, computed, watchEffect } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import { useGetAuthSettingsQuery } from 'src/generated/graphql';

export default defineComponent({
  components: { PasswordInput, CtfNoteLink },
  props: {
    token: { type: String, default: '' },
  },
  setup() {
    const { result: authSettingsResult } = useGetAuthSettingsQuery();
    const authMethod = ref('local');
    
    const localAuthEnabled = computed(() => authSettingsResult.value?.localAuthEnabled ?? true);
    const ldapAuthEnabled = computed(() => authSettingsResult.value?.ldapAuthEnabled ?? false);
    
    // Update default auth method when settings load
    watchEffect(() => {
      if (!localAuthEnabled.value && ldapAuthEnabled.value) {
        authMethod.value = 'ldap';
      } else if (localAuthEnabled.value && !ldapAuthEnabled.value) {
        authMethod.value = 'local';
      }
    });
    
    return {
      settings: ctfnote.settings.injectSettings(),
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      login: ctfnote.auth.useLogin(),
      ldapLogin: ctfnote.auth.useLdapLogin(),
      authMethod,
      localAuthEnabled,
      ldapAuthEnabled,
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
        this.localAuthEnabled &&
        (this.settings.registrationAllowed ||
        this.settings.registrationPasswordAllowed)
      );
    },
    showTabs() {
      // Only show tabs if both auth methods are available
      return this.localAuthEnabled && this.ldapAuthEnabled;
    },
    noAuthAvailable() {
      // Check if no authentication methods are available
      return !this.localAuthEnabled && !this.ldapAuthEnabled;
    },
  },
  methods: {
    submit() {
      const login = this.form.login;
      const loginPromise = this.authMethod === 'ldap' 
        ? this.ldapLogin(this.form.login, this.form.password)
        : this.login(this.form.login, this.form.password);

      void this.resolveAndNotify(
        loginPromise,
        {
          message: `Logged in as ${login}!`,
          icon: 'person',
        },
      );
    },
  },
});
</script>

<style scoped></style>
