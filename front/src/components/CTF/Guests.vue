<template>
  <div class="q-gutter-md">
    <div class="row">
      <div class="col q-px-sm">
        Invite guests to join <b>{{ ctf.title }}</b>
      </div>
    </div>
    <div class="row">
      <div
        v-for="guest in guestsWithInvitation"
        :key="guest.nodeId"
        class="col col-auto"
      >
        <q-chip
          clickable
          class="text-white q-py-md q-pl-md q-pr-none"
          size="bg"
          :style="chipStyle(guest)"
          :label="guest.username"
          @click="
            !guest.invitation
              ? createInvitation(guest)
              : deleteInvitation(guest)
          "
        >
          <q-toggle
            :model-value="!!guest.invitation"
            checked-icon="check"
            @update:modelValue="
              (v) => (v ? createInvitation(guest) : deleteInvitation(guest))
            "
          />
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ctf, Profile, Role } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const team = ctfnote.profiles.injectTeam();
    const now = ref(new Date());

    return {
      now,
      team,
      inviteUserToCtf: ctfnote.ctfs.useInviteUserToCtf(),
      uninviteUserToCtf: ctfnote.ctfs.useUninviteUserToCtf(),
    };
  },
  computed: {
    guests() {
      return this.team.filter(
        (p) =>
          p.role == Role.UserGuest ||
          (p.role == Role.UserFriend && this.ctf.endTime > this.now)
      );
    },
    guestsWithInvitation() {
      return this.guests.map((g) => {
        const invitation = this.ctf.invitations.find(
          (i) => i.profileId == g.id
        );
        return { ...g, invitation };
      });
    },
  },
  methods: {
    isInvited(guest: Profile): boolean {
      return !!this.ctf.invitations.find((i) => i.profileId == guest.id);
    },
    chipStyle(guest: Profile): Record<string, string> {
      return { backgroundColor: guest.color };
    },
    async createInvitation(profile: Profile) {
      await this.inviteUserToCtf(this.ctf, profile);
    },
    async deleteInvitation(profile: Profile) {
      await this.uninviteUserToCtf(this.ctf, profile);
    },
  },
});
</script>

<style scoped></style>
