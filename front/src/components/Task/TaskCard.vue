<template>
  <q-card bordered class="task" :class="{ solved: task.solved }">
    <task-menu :task="task" :context-menu="true" />
    <q-card-section>
      <task-badge :task="task" />
      <div class="col justify-between">
        <ctf-note-link
          tag="a"
          underline
          class="text-h6 col-auto text-light"
          :ctf="ctf"
          :task="task"
          name="task"
          :label="task.title"
        />
        <div class="col-auto">
          <task-tags-list :tags="task.assignedTags" />
        </div>
      </div>
    </q-card-section>
    <q-separator v-show="!isUltraDense" inset />
    <q-card-section v-if="!isDense">
      <task-player-list :task="task" style="min-height: 36px" />
    </q-card-section>
    <q-card-section v-show="!isUltraDense" class="q-mb-xs">
      <div
        v-if="task.solved"
        class="task-description blur"
        style="font-family: monospace"
      >
        {{ task.flag }}
      </div>
      <div v-else class="task-description">
        {{ task.description || '…' }}
      </div>
    </q-card-section>
    <q-card-section v-show="!isDense">
      <div class="row q-gutter-sm">
        <ctf-note-link name="task" :ctf="ctf" :task="task">
          <q-btn class="col-auto" color="primary"> Open Task </q-btn>
        </ctf-note-link>
        <q-space class="col-md col-grow" />
        <div class="col-auto">
          <task-btn-group :task="task" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Ctf, Task } from 'src/ctfnote/models';
import { defineComponent } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import TaskBadge from './TaskBadge.vue';
import TaskMenu from './TaskMenu.vue';
import TaskBtnGroup from './TaskBtnGroup.vue';
import TaskTagsList from './TaskTagsList.vue';
import TaskPlayerList from './TaskPlayerList.vue';

export default defineComponent({
  components: {
    TaskBadge,
    CtfNoteLink,
    TaskMenu,
    TaskPlayerList,
    TaskBtnGroup,
    TaskTagsList,
  },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    task: { type: Object as () => Task, required: true },
    displayMode: {
      type: String as () => 'classic' | 'ultradense' | 'dense',
      default: 'classic',
    },
  },
  setup() {
    return {};
  },
  computed: {
    isUltraDense() {
      return this.displayMode == 'ultradense';
    },
    isDense() {
      return this.displayMode != 'classic';
    },
    showBadge() {
      return this.task.solved || this.task.workOnTasks.length > 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.solved {
  border-color: $positive;
}
.action-btn .q-btn {
  width: 30px;
}

.body--dark {
  .task {
    transition: transform 0.15s, box-shadow 0.15s;
    &:hover {
      box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.3);
    }
  }
}

.body--light {
  .task {
    transition: transform 0.15s, box-shadow 0.15s;
    &:hover {
      box-shadow: 0px 0px 5px rgba(25, 25, 25, 0.8);
    }
  }
}
</style>
