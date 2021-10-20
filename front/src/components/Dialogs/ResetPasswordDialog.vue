<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin ctfnote-dialog">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">Reset password link for {{ user.login }}</div>
          <q-space />
          <q-btn v-close-popup icon="close" ripple flat round dense />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <copy-link :link="link">
          <template #after>
            <q-btn
              icon="lock_reset"
              color="positive"
              round
              @click="createLink"
            />
          </template>
        </copy-link>
      </q-card-section>
      <q-card-actions class="q-pr-md q-pb-md" align="right">
        <q-btn v-if="link" v-close-popup color="positive" label="Close" />
        <q-btn v-else v-close-popup flat color="warning" label="Cancel" />
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
