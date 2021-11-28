<template>
  <div
    class="row q-gutter-sm"
    :class="{ 'q-gutter-md': displayMode == 'classic' }"
  >
    <q-intersection
      v-for="task of tasks"
      v-show="isTaskVisible(task)"
      :key="task.id"
      once
      transition="fade"
      class="col col-grow item"
      :class="`display-${displayMode}`"
    >
      <task-card :display-mode="displayMode" :task="task" :ctf="ctf" />
    </q-intersection>
  </div>
</template>

<script lang="ts">
import { Ctf, Task } from 'src/ctfnote/models';
import { injectStrict } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';
import keys from './injectionKeys';
import TaskCard from './TaskCard.vue';
import { DisplayMode } from './TaskList.vue';

export default defineComponent({
  components: { TaskCard },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    tasks: { type: Array as () => Task[], required: true },
    displayMode: { type: String as () => DisplayMode, required: true },
  },
  setup() {
    return {
      isTaskVisible: injectStrict(keys.isTaskVisible),
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  min-width: 200px;
  &.display-ultradense {
    min-height: 68px;
  }
  &.display-dense {
    min-height: 140px;
  }
  &.display-classic {
    min-height: 264px;
  }
}
</style>
