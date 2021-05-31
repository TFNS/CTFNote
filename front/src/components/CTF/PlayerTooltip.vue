<template>
  <q-tooltip anchor="top right" self="top left" :offset="[0, 0]" content-class="transparent" v-if="players.length">
    <q-card dense bordered>
      <q-card-section class="tooltip-section">
        <q-list dense>
          <q-item tag="label" :key="player.nodeId" v-for="player in players">
            <q-item-section class="text-center">
              <q-chip class="text-white text-center" :style="taskStyle(player.nodeId)">
                <div class="text-center full-width">
                  {{ player.username }}
                </div>
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-tooltip>
</template>

<script>
import { colorHash } from "../../utils";
export default {
  props: {
    task: { type: Object, required: true }
  },
  methods: {
    taskStyle(s) {
      return { backgroundColor: colorHash(s) };
    }
  },
  computed: {
    players() {
      return this.task.workOnTasks.nodes.map(n => n.profile);
    }
  }
};
</script>

<style lang="scss" scoped>
.tooltip-section,
.tooltip-section label {
  padding: 2px 4px !important;
}
</style>
