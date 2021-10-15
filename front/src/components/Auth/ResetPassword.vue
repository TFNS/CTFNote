<template>
  <q-form @submit="submit">
    <q-card>
      <q-card-section>
        <div class="text-h6">Reset password</div>
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <password-input v-model="password" />

        <q-input filled readonly :model-value="token" label="Token" />
      </q-card-section>
      <q-card-actions class="row justify-end q-pa-md">
        <div class="col col-auto">
          <q-btn type="submit" label="Reset" color="primary" />
        </div>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import PasswordInput from 'src/components/Utils/PasswordInput.vue';
import { resetPassword } from 'src/ctfnote/auth';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    PasswordInput,
  },
  props: { token: { type: String, default: '' } },
  setup() {
    return {
      password: ref(''),
    };
  },
  methods: {
    submit() {
      void resetPassword(this.password, this.token);
    },
  },
});
</script>

<style scoped></style>
