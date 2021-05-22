<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="ctfnote-dialog">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="text-h6">Create a new invitation link</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="role" class="full-width">
            <q-select label="Role" dense v-model="role" :options="Object.keys($ctfnote.roles)" />
          </q-tab-panel>
          <q-tab-panel name="link" class="full-width">
            <copy-link v-if="link" :link="link" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions class="row justify-end q-pt-none q-pb-md q-pr-md">
        <template v-if="tab == 'role'">
          <q-btn color="warning" label="Cancel" v-close-popup />
          <q-btn color="positive" label="Create" @click="createLink" />
        </template>
        <q-btn color="positive" label="Close" v-close-popup v-else />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import db from "src/gql";
import CopyLink from "../CopyLink.vue";
export default {
  components: { CopyLink },
  data() {
    return {
      link: null,
      tab: "role",
      role: "USER_GUEST",
    };
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    createLink() {
      db;
      this.$apollo
        .mutate({
          mutation: db.user.CREATE_INVITATION_LINK,
          variables: { role: this.role },
        })
        .then(({ data }) => {
          const token = data.createInvitationLink.invitationLinkResponse.token;
          const path = this.$router.resolve({ name: "registerWithLink", params: { token } });
          this.link = `${location.origin}/${path.href}`;
          this.tab = "link";
        });
    },
  },
};
</script>
