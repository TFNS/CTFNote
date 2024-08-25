<template>
  <div class="q-gutter-md">
    <div class="row text-h6">Invite guests</div>
    <div class="row q-mt-sm" style="margin-left: 12px">
      <template v-if="guestsWithInvitation.length > 0">
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
              @update:model-value="
                (v) => (v ? createInvitation(guest) : deleteInvitation(guest))
              "
            />
          </q-chip>
        </div>
      </template>
      <div v-else class="q-ml-xs"><i>No guests found.</i></div>
    </div>
    <div class="row text-h6">Sync with Discord event</div>
    <div v-if="!settings.discordIntegrationEnabled" class="row q-mt-sm">
      <div style="width: 590px">
        The Discord integration is currently disabled.
      </div>
    </div>
    <div v-else class="row q-mt-sm">
      <div style="width: 590px">
        <discord-event-link-sync :ctf="ctf" class="col" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ctf, Profile, Role } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent, ref } from 'vue';
import DiscordEventLinkSync from './DiscordEventLinkSync.vue';

export default defineComponent({
  components: { DiscordEventLinkSync },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
  },
  setup() {
    const team = ctfnote.profiles.injectTeam();
    const now = ref(new Date());
    const settings = ctfnote.settings.injectSettings();

    return {
      now,
      team,
      settings,
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
