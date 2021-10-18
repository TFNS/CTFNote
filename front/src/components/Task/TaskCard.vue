<template>
  <q-card bordered class="task" :class="{ solved: task.solved }">
    <task-menu
      :task="task"
      @edit-task="$emit('edit-task')"
      @solve-task="$emit('solve-task')"
      @delete-task="$emit('delete-task')"
      @start-work-on-task="$emit('start-work-on-task')"
      @stop-work-on-task="$emit('stop-work-on-task')"
    />
    <q-card-section>
      <task-badge :task="task" />
      <div class="row justify-between">
        <ctf-note-link
          tag="a"
          underline
          class="text-h6 col text-light"
          :ctf="ctf"
          :task="task"
          name="task"
          :label="task.title"
        />

        <div class="col col-auto">
          <q-chip
            class="text-white"
            clickable
            :style="colorHash(task.category)"
            @click="$emit('filter-category', task.category)"
          >
            {{ task.category || '?' }}
          </q-chip>
        </div>
      </div>
    </q-card-section>
    <q-separator v-show="!isUltraDense" inset />
    <q-card-section v-show="!isUltraDense" class="q-mb-xs">
      <div
        v-if="task.solved"
        class="task-description blur"
        style="font-family: monospace"
      >
        {{ task.flag }}
      </div>
      <div v-else class="task-description">
        {{ task.description || '...' }}
      </div>
    </q-card-section>
    <q-card-section v-show="!isDense">
      <div class="row q-gutter-sm">
        <ctf-note-link name="task" :ctf="ctf" :task="task">
          <q-btn class="col-auto" color="primary"> Open Task </q-btn>
        </ctf-note-link>
        <q-space class="col-md col-grow" />
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            :title="onItTitle"
            :icon="onItIcon"
            :color="onItColor"
            @click="updateOnIt(!onIt)"
          />
        </div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            title="Enter flag"
            icon="flag"
            color="positive"
            @click="$emit('solve-task')"
          />
        </div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            :title="`Edit ${task.title}`"
            icon="edit"
            color="warning"
            @click="$emit('edit-task')"
          />
        </div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            :title="`Delete ${task.title}`"
            icon="delete"
            color="negative"
            @click="$emit('delete-task')"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Ctf, Task } from 'src/ctfnote';
import { getMe } from 'src/ctfnote/me';
import { getTeam } from 'src/ctfnote/profiles';
import { colorHash } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import TaskBadge from './TaskBadge.vue';
import TaskMenu from './TaskMenu.vue';



export default defineComponent({
  components: { TaskBadge, CtfNoteLink, TaskMenu },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    task: { type: Object as () => Task, required: true },
    displayMode: {
      type: String as () => 'classic' | 'ultradense' | 'dense',
      default: 'classic',
    },
  },
  emits: [
    'solve-task',
    'edit-task',
    'delete-task',
    'start-work-on-task',
    'stop-work-on-task',
    'filter-category',
  ],
  setup() {
    const { result: me } = getMe();
    const { result: team } = getTeam();
    return { me, team };
  },
  computed: {
    isUltraDense() {
      return this.displayMode == 'ultradense';
    },
    isDense() {
      return this.displayMode != 'classic';
    },
    onItColor() {
      return this.onIt ? 'secondary' : 'primary';
    },
    onIt() {
      if (!this.me.profile?.id) return false;
      return this.task.workOnTasks.includes(this.me.profile.id);
    },
    onItIcon() {
      return this.onIt ? 'person_remove' : 'person_add_alt_1';
    },
    onItTitle() {
      return `${this.onIt ? 'Stop' : 'Start'} working on ${this.task.title}`;
    },
    showBadge() {
      return this.task.solved || this.task.workOnTasks.length > 0;
    },
  },
  methods: {
    colorHash(s?: string | null) {
      return { backgroundColor: colorHash(s ?? '') };
    },
    updateOnIt(v: boolean) {
      if (v) {
        this.$emit('start-work-on-task');
      } else {
        this.$emit('stop-work-on-task');
      }
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
