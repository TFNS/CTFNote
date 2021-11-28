<template>
  <div class="row">
    <user-badge
      v-for="player in players"
      :key="player.nodeId"
      :profile="player"
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
    players() {
      return this.team.filter((p) => this.task.workOnTasks.includes(p.id));
    },
  },
});
</script>

<style scoped></style>
