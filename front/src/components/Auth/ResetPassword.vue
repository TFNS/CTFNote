<template>
  <q-card>
    <q-form @submit="submit">
      <q-card-section>
        <div class="text-h6">Reset password</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-sm q-gutter-sm">
        <password-input
          v-model="password"
          label="New password"
          dense
          required
        />
        <q-input
          filled
          dense
          readonly
          required
          :model-value="token"
          label="Password reset token"
        >
          <template #prepend>
            <q-icon name="key" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions class="row q-px-md q-pb-md">
        <q-btn
          type="submit"
          label="Reset password"
          color="primary"
          class="full-width"
        />
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
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      resetPassword: ctfnote.auth.useResetPassword(),
      password: ref(''),
    };
  },
  methods: {
    submit() {
      void this.resolveAndNotify(
        this.resetPassword(this.password, this.token),
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
