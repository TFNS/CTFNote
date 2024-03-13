<template>
  <div>
    <q-chip :dense="dense" :style="style" text-color="white" class="text-center outer-chip">
      <span class="user-chip">
        {{ profile.username }}
      </span>
    </q-chip>
  </div>
</template>

<script lang="ts">
import { PublicProfile } from 'src/ctfnote/models';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    profile: { type: Object as () => PublicProfile, required: true },
    active: { type: Boolean, default: true },
    dense: { type: Boolean, default: false },
  },
  setup() {
    return {};
  },
  computed: {
    style() {
      return {
        'background-color': this.profile.color,
        opacity: this.active ? 1 : 0.2,
        transition: 'opacity 0.2s',
      };
    },
  },
});
</script>

<style scoped>
.user-chip {
  text-align: center;
  width: 100%;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.outer-chip:hover {
  opacity: 1 !important;
}
</style>
