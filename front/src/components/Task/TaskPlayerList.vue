<template>
  <div class="row">
    <user-badge
      v-for="p in playersWithActive"
      :key="p.player.nodeId"
      :profile="p.player"
      :active="p.active"
    />
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { Task } from 'src/ctfnote/models';
import { defineComponent } from 'vue';
import UserBadge from '../Profile/UserBadge.vue';

export default defineComponent({
  components: { UserBadge },
  props: {
    task: { type: Object as () => Task, required: true },
  },
  setup() {
    const team = ctfnote.profiles.injectTeam();
    return { team };
  },
  computed: {
    playersWithActive() {
      return (
        this.players
          .map((p) => ({
            player: p,
            active:
              this.task.workOnTasks.filter(
                (w) => w.profileId == p.id && w.active
              ).length > 0,
          }))
          // sort by active status (active first)
          .sort((a) => (a.active ? -1 : 1))
      );
    },
    players() {
      return this.team.filter(
        (p) =>
          this.task.workOnTasks.filter((id) => id.profileId == p.id).length > 0
      );
    },
  },
});
</script>

<style scoped></style>
