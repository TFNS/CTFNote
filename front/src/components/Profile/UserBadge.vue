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
import { Profile } from 'src/ctfnote';
import { colorHash } from 'src/utils';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    profile: { type: Object as () => Profile, required: true },
  },
  setup() {
    return {};
  },
  computed: {
    backgroundColor() {
      return this.profile.color ?? colorHash(this.profile.username);
    },
    style() {
      return { 'background-color': this.backgroundColor };
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
