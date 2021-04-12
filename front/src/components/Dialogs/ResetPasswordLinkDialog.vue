<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="import-task-dialog">
      <q-card-section class="row">
        <div class="text-h6">New Reset Password Link For '{{ user.username }}'</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input filled bottom-slots :value="link" readonly ref="resetPasswordLink">
          <template v-slot:before>
            <q-icon name="lock" />
          </template>

          <template v-slot:append>
            <q-btn round dense flat icon="content_copy" @click="clipboardCopy()" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="warning" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import db from "src/gql";

export default {
  props: { user: Object },
  created() {
    this.retrieveLink();
  },
  data() {
    return {
      link: null,
    };
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },

    async retrieveLink() {
      this.link = null;

      const response = await this.$apollo.mutate({
        mutation: db.auth.RESET_PASSWORD_LINK,
        variables: {
          userId: this.user.id,
        },
      });

      const { token } = response.data.createResetPasswordLink.resetPasswordLinkResponse;
      const path = this.$router.resolve({ name: "resetPassword", params: { token } });
      this.link = `${location.origin}/${path.href}`;
    },
    clipboardCopy() {
      const linkElement = this.$refs.resetPasswordLink;

      linkElement.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    },
  },
};
</script>

<style>
.import-task-dialog {
  min-width: calc(min(600px, 90vw));
}
</style>