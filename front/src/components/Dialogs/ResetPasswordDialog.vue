<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin ctfnote-dialog">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">Reset password link for {{ user.login }}</div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <copy-link :link="link" />
      </q-card-section>
      <q-card-actions class="row justify-end q-pt-none q-pb-md q-pr-md">
        <q-btn v-close-popup color="warning" label="Cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Role, User } from 'src/ctfnote';
import { useCreateResetPasswordToken } from 'src/ctfnote/admin';
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
      createResetPasswordToken: useCreateResetPasswordToken(),
      tab: ref('role'),
      link: ref(''),
      role: ref(Role.UserGuest),
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
    };
  },
  mounted() {
    void this.createLink();
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
