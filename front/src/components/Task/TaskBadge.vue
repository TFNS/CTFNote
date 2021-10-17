<template>
  <q-badge
    v-if="showBadge"
    class="solved-badge"
    floating
    :color="taskIconColor"
  >
    <q-icon :name="taskIcon" />
    <q-tooltip
      v-if="players.length"
      anchor="top right"
      self="top left"
      :offset="[0, 0]"
      class="transparent"
    >
      <q-card dense bordered>
        <q-card-section class="tooltip-section">
          <q-list dense>
            <q-item
              v-for="player in players"
              :key="player.username"
              tag="label"
            >
              <q-item-section class="text-center">
                <user-badge :profile="player" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-tooltip>
  </q-badge>
</template>

<script lang="ts">
import { MeKey, Task } from 'src/ctfnote';
import { getTeam } from 'src/ctfnote/profiles';
import { injectStrict } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';
import UserBadge from '../Profile/UserBadge.vue';

export default defineComponent({
  components: { UserBadge },
  props: {
    task: { type: Object as () => Task, required: true },
  },
  setup() {
    const { result: team } = getTeam();
    const me = injectStrict(MeKey);
    return { team, me };
  },
  computed: {
    showBadge() {
      return this.task.solved || this.players?.length > 0;
    },
    players() {
      return this.team.filter((p) => this.task.workOnTasks.includes(p.id));
    },
    taskIcon() {
      if (this.task.solved) return 'flag';
      const count = this.task.workOnTasks.length;
      if (count == 0) {
        return null;
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
      if (this.task.workOnTasks.some((id) => id == this.me.profile?.id)) {
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
  padding: 2px 4px !important;
}
</style>
