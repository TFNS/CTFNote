<template>
  <div class="row">
    <task-tag-chip
      v-for="tag in visible_tags"
      :key="tag.nodeId"
      :dense="dense"
      :name="tag.tag"
    />

    <q-chip
      v-if="hidden_tags.length >= 1"
      text-color="white"
      color="accent"
      class="non-selectable"
      :ripple="false"
      :dense="dense"
    >
      <q-tooltip
        anchor="center right"
        self="center left"
        :offset="[0, 0]"
        class="transparent"
        transition-show="fade"
        transition-hide="fade"
      >
        <q-card bordered style="border-radius: 23px !important">
          <q-card-section class="tooltip-section" style="padding: 4px">
            <task-tag-chip
              v-for="tag in hidden_tags"
              :key="tag.nodeId"
              :name="tag.tag"
              :dense="dense"
            />
          </q-card-section>
        </q-card>
      </q-tooltip>

      <span class="tag-chip"> +{{ hidden_tags.length }} </span>
    </q-chip>
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
    dense: { type: Boolean, default: false },
    tags: { type: Object as () => Tag[], required: true },
    condensed: { type: Boolean, default: false },
  },
  setup() {
    return {};
  },
  computed: {
    visible_tags: function () {
      if (this.condensed) {
        return this.tags.length > 0 ? [this.tags[0]] : undefined;
      }
      return this.tags;
    },
    hidden_tags: function () {
      if (this.condensed) {
        return this.tags.slice(1);
      }
      return [];
    },
  },
});
</script>

<style>
.tag-smaller-width span {
  max-width: 71px !important;
}
</style>
