<template>
  <div class="q-gutter-md">
    <div class="row" v-if="!loading">
      <div class="col col-auto" :key="user.nodeId" v-for="user in guestUsersWithInvitation">
        <q-chip
          clickable
          class="text-white q-py-md q-pl-md q-pr-none"
          size="bg"
          :style="{ backgroundColor: colorHash(user.username) }"
          :label="user.username"
          @click="setInvitation(!Boolean(user.invitation), user)"
        >
          <q-toggle :value="Boolean(user.invitation)" checked-icon="check" @input="(v) => setInvitation(v, user)" />
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script>
import db from "src/gql";
import { colorHash } from "../../utils";
export default {
  props: {
    ctf: Object,
  },
  apollo: {
    guestUsers: {
      query: db.profile.GUESTS,
      update: (d) => d.guests.nodes,
    },
    invitations: {
      query: db.invitation.ALL,
      variables() {
        return { ctfId: this.ctf.id };
      },
      update: (data) => data.invitations.nodes,
    },
  },
  methods: {
    setInvitation(v, profile) {
      if (v) {
        this.inviteUser(profile);
      } else {
        this.deleteInvitation(profile.invitation);
      }
    },
    async inviteUser(profile) {
      await this.$apollo.mutate({
        mutation: db.invitation.CREATE,
        variables: {
          ctfId: this.ctf.id,
          profileId: profile.id,
        },
        update: (store, { data: { createInvitation } }) => {
          const invitation = createInvitation.invitation;
          const query = {
            query: db.invitation.ALL,
            variables: { ctfId: this.ctf.id },
          };
          const data = store.readQuery(query);
          data.invitations.nodes.push(invitation);
          store.writeQuery({ ...query, data });
        },
      });
    },
    deleteInvitation(invitation) {
      this.$apollo.mutate({
        mutation: db.invitation.DELETE,
        variables: {
          nodeId: invitation.nodeId,
        },
        update: (store, { data: { deleteInvitationByNodeId } }) => {
          const nodeId = deleteInvitationByNodeId.deletedInvitationNodeId;
          const query = {
            query: db.invitation.ALL,
            variables: { ctfId: this.ctf.id },
          };
          const data = store.readQuery(query);
          data.invitations.nodes = data.invitations.nodes.filter((n) => n.nodeId != nodeId);
          store.writeQuery({ ...query, data });
        },
      });
    },
    colorHash(s) {
      return colorHash(s);
    },
  },
  computed: {
    loading() {
      return this.$apollo.queries.guestUsers.loading || this.$apollo.queries.invitations.loading;
    },
    ctfInvitations() {
      return this.invitations;
    },
    guestUsersWithInvitation() {
      return this.guestUsers.map((profile) => {
        return { ...profile, invitation: this.ctfInvitations.find((i) => i.profile.nodeId == profile.nodeId) };
      });
    },
  },
};
</script>

<style>
</style>