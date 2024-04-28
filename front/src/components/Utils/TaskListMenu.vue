<template>
  <div>
    <q-btn-dropdown flat no-caps style="padding-left: 14px; padding-right: 8px">
      <template #label>
        <div class="row q-gutter-sm items-center">
          <task-menu
            v-if="currentTask"
            :task="currentTask"
            :context-menu="true"
          />

          <div
            class="task-list-label"
            :class="{
              'task-list-label-xs': $q.screen.xs,
              'task-list-label-sm': $q.screen.sm,
              'task-list-label-md': $q.screen.gt.sm,
            }"
          >
            {{ title }}
          </div>

          <task-tags-list
            v-if="currentTask && $q.screen.gt.sm"
            condensed
            style="text-transform: none; font-weight: normal"
            dense
            :tags="currentTask.assignedTags"
          />
        </div>
      </template>
      <template #default>
        <q-list dense>
          <q-item
            v-for="task of sortedTasks"
            :key="task.nodeId"
            clickable
            style="height: 46px"
            @click="taskLink(task)"
          >
            <task-menu v-if="task" :task="task" :context-menu="true" />

            <q-item-section>
              <q-item-label>
                <div class="row" style="max-width: 400px">
                  <div style="width: 24px" class="col col-auto q-mr-md">
                    <task-badge :task="task" />
                  </div>

                  <div class="col">
                    <div class="ellipsis">
                      {{ task.title }}
                    </div>
                  </div>
                </div>
              </q-item-label>
            </q-item-section>

            <q-item-section v-if="$q.screen.gt.xs" side>
              <task-tags-list condensed :tags="task.assignedTags" />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-btn-dropdown>
  </div>
</template>

<script lang="ts">
import { Ctf, Task } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import TaskMenu from '../Task/TaskMenu.vue';
import TaskBadge from '../Task/TaskBadge.vue';
import TaskTagsList from '../Task/TaskTagsList.vue';
import { tagsSortFn } from 'src/ctfnote/tags';

export default defineComponent({
  components: {
    TaskMenu,
    TaskBadge,
    TaskTagsList,
  },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    taskId: { type: Number, default: null },
  },
  computed: {
    currentTask() {
      return this.ctf.tasks.find((t) => t.id == this.taskId);
    },
    title() {
      if (this.currentTask) {
        return this.currentTask.title;
      }
      return 'Open Task';
    },
    sortedTasks() {
      return this.ctf.tasks
        .slice()
        .sort(tagsSortFn)
        .sort((a) => {
          return a.solved ? 1 : -1;
        });
    },
  },
  methods: {
    taskLink(task: Task | null = null) {
      if (!task) {
        return null;
      }
      return this.$router.push({
        name: 'task',
        params: {
          ctfId: this.ctf.id,
          ctfSlug: this.ctf.slug,
          taskId: task.id,
          taskSlug: task.slug,
        },
      });
    },

    colorHash(s: string) {
      return { backgroundColor: ctfnote.utils.colorHash(s) };
    },
  },
});
</script>

<style scoped>
.task-list-label {
  text-overflow: ellipsis;
  overflow: hidden;
}

.task-list-label-xs {
  max-width: calc(100vw - 305px);
}

.task-list-label-sm {
  max-width: calc(100vw - 490px);
}

.task-list-label-md {
  max-width: calc(100vw - 910px);
}
</style>
