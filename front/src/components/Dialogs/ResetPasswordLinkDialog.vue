<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">New Reset Password Link For '{{ user.login }}'</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input hint="Valid for one hour." filled bottom-slots :value="link" readonly ref="resetPasswordLink">
          <template v-slot:before>
            <q-icon name="lock" />
          </template>

          <template v-slot:append>
            <q-btn round dense flat title="Copy" icon="content_copy" @click="clipboardCopy()" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions class="row justify-end q-pt-none q-pb-md q-pr-md">
        <q-btn color="warning" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import db from "src/gql";

export default {
  props: { user: Object },
  data() {
    return {
      link: null,
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(user) {
        this.retrieveLink(user);
      },
    },
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },

    async retrieveLink(user) {
      this.link = null;

      const response = await this.$apollo.mutate({
        mutation: db.auth.RESET_PASSWORD_LINK,
        variables: {
          userId: user.id,
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
      this.$q.notify({
        message: "Copied!",
        color: "primary",
        actions: [],
        closeBtn: false,
        position: "center",
        timeout: 1,
      });
    },
  },
};
</script>
