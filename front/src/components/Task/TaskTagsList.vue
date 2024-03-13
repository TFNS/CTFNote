<template>
  <div class="row">
    <task-tag-chip
      v-for="tag in tags"  
      :key="tag.nodeId"
      :name="tag.tag"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Tag } from 'src/ctfnote/models';
import TaskTagChip from './TaskTagChip.vue';

export default defineComponent({
  components: {
    TaskTagChip,
  },
  props: {
    tags: { type: Object as () => Tag[], required: true },
  },
  setup() {
    return {};
  },
});
</script>
