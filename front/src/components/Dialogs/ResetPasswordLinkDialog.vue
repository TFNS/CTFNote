<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="ctfnote-dialog">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">Reset password link for {{ user.login }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <copy-link v-if="link" :link="link" />
      </q-card-section>
      <q-card-actions class="row justify-end q-pt-none q-pb-md q-pr-md">
        <q-btn color="warning" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import db from "src/gql";
import CopyLink from "../CopyLink.vue";
export default {
  components: { CopyLink },
  props: { user: { type: Object, required: true } },
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
  },
};
</script>
