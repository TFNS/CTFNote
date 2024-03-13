<template>
  <div class="row">
    <task-tag-chip
      v-if="first_tag !== undefined"
      :class="{ 'tag-smaller-width': tags.length > 1 }"
      :name="first_tag.tag"
      :dense="dense"
    />

    <q-chip
      v-if="tags.length > 1"
      text-color="white"
      color="black"
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
        <q-card bordered style="border-radius: 23px !important;">
          <q-card-section class="tooltip-section" style="padding: 4px;">
            <task-tag-chip
              v-for="tag in remaining_tags"
              :key="tag.nodeId"
              :name="tag.tag"
              :dense="dense"
            />
          </q-card-section>
        </q-card>
      </q-tooltip>

      <span class="tag-chip">
        +{{ tags.length - 1 }}
      </span>
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
  },
  setup() {
    return {};
  },
  computed: {
    first_tag: function () {
      return this.tags.length > 0 ? this.tags[0] : undefined;
    },
    remaining_tags: function () {
      return this.tags.slice(1);
    },
  }
});
</script>

<style>
  .tag-smaller-width span {
    max-width: 71px !important;
  }
</style>