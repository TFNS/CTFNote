<template>
  <q-badge
    v-if="showBadge"
    :class="{ 'solved-badge': displayInCorner }"
    :floating="displayInCorner"
    :color="taskIconColor"
  >
    <q-icon :name="taskIcon" />
    <q-tooltip
      v-if="players.length"
      anchor="center left"
      self="center right"
      :offset="[0, 0]"
      class="transparent"
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card bordered style="border-radius: 23px !important">
        <q-card-section class="tooltip-section">
          <q-list dense>
            <q-item
              v-for="p in playersWithActive"
              :key="p.player.username"
              tag="label"
            >
              <q-item-section class="text-center">
                <user-badge :profile="p.player" :active="p.active" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-tooltip>
  </q-badge>
</template>

<script lang="ts">
import { Task } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import UserBadge from '../Profile/UserBadge.vue';

export default defineComponent({
  components: { UserBadge },
  props: {
    task: { type: Object as () => Task, required: true },
    displayInCorner: { type: Boolean, default: false },
  },
  setup() {
    const team = ctfnote.profiles.injectTeam();
    const me = ctfnote.me.injectMe();
    return { team, me };
  },
  computed: {
    showBadge() {
      return this.task.solved || this.players?.length > 0;
    },
    playersWithActive() {
      return this.players.map((p) => ({
        player: p,
        active:
          this.task.workOnTasks.filter((w) => w.profileId == p.id && w.active)
            .length > 0,
      }));
    },
    players() {
      return this.team.filter(
        (p) =>
          this.task.workOnTasks.filter((w) => w.profileId == p.id && w.active)
            .length > 0
      );
    },
    taskIcon() {
      if (this.task.solved) return 'flag';
      const count = this.task.workOnTasks.length;
      if (count == 0) {
        return undefined;
      }
      if (count == 1) {
        return 'person';
      }
      if (count == 2) {
        return 'group';
      }
      return 'groups';
    },
    taskIconColor() {
      if (this.task.solved) return 'positive';
      if (
        this.task.workOnTasks.filter(
          (w) => w.profileId == this.me?.profile.id && w.active
        ).length > 0
      ) {
        return 'secondary';
      }
      return 'primary';
    },
  },
});
</script>

<style lang="scss" scoped>
.solved-badge {
  top: 0;
  font-size: 1.2em;
  right: 0;
  transform: translate(25%, -40%);
}
.tooltip-section,
.tooltip-section label {
  padding: 2px 2px !important;
}
</style>
