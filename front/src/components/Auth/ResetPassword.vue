<template>
  <q-card>
    <q-form @submit="submit">
      <q-card-section>
        <div class="text-h6">Reset password</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <password-input v-model="password" required />
        <q-input filled readonly required :model-value="token" label="Token" />
      </q-card-section>
      <q-card-actions class="q-pr-md q-pb-md" align="right">
        <div class="col col-auto">
          <q-btn type="submit" label="Reset" color="primary" />
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    PasswordInput,
  },
  props: { token: { type: String, default: '' } },
  setup() {
    return {
      wrapNotify: ctfnote.ui.useWrapNotify(),
      resetPassword: ctfnote.auth.useResetPassword(),
      password: ref(''),
    };
  },
  methods: {
    submit() {
      void this.wrapNotify(
        () => this.resetPassword(this.password, this.token),
        {
          message: 'Password changed!',
          icon: 'person',
        }
      );
    },
  },
});
</script>

<style scoped></style>
