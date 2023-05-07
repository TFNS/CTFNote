<template>
  <div class="row">
    <q-chip v-for="tag in tags" :key="tag.nodeId" :style="style(tag.tag)">
      <span class="tag-chip">
        {{ tag.tag }}
      </span>
    </q-chip>
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import { Tag } from 'src/ctfnote/models';

export default defineComponent({
  props: {
    tags: { type: Object as () => Tag[], required: true },
  },
  setup() {
    return {};
  },
  methods: {
    style(name: string) {
      return { backgroundColor: ctfnote.utils.colorHash(name) };
    },
  },
});
</script>

<style scoped>
.tag-chip {
  text-align: center;
  width: 100%;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
