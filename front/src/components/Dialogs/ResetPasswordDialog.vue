<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin ctfnote-dialog">
      <q-card-section class="text-h6">
        Reset password link for {{ user.login }}
      </q-card-section>

      <q-card-section>
        <copy-link dense class="q-pb-none" :link="link">
          <template #after>
            <q-btn
              icon="lock_reset"
              color="positive"
              class="ctfnote-input-button"
              @click="createLink"
            />
          </template>
        </copy-link>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn v-if="link" v-close-popup color="primary" label="Close" />
        <q-btn v-else v-close-popup flat color="primary" label="Cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Role, User } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref } from 'vue';
import CopyLink from '../Utils/CopyLink.vue';
export default defineComponent({
  components: { CopyLink },
  props: {
    user: { type: Object as () => User, required: true },
  },
  emits: useDialogPluginComponent.emits,
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      createResetPasswordToken: ctfnote.admin.useCreateResetPasswordToken(),
      tab: ref('role'),
      link: ref(''),
      role: ref(Role.UserGuest),
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
    };
  },
  methods: {
    async createLink() {
      const token = await this.createResetPasswordToken(this.user);

      const path = this.$router.resolve({
        name: 'auth-reset-password',
        params: { token },
      });
      this.link = `${location.origin}/${path.href}`;
    },
  },
});
</script>

<style scoped></style>
