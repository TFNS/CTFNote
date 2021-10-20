<template>
  <div>
    <q-chip :style="style" text-color="white" class="text-center">
      <span class="user-chip">
        {{ profile.username }}
      </span>
    </q-chip>
  </div>
</template>

<script lang="ts">
import { Profile } from 'src/ctfnote/models';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    profile: { type: Object as () => Profile, required: true },
  },
  setup() {
    return {};
  },
  computed: {
    style() {
      return { 'background-color': this.profile.color };
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
</style>
