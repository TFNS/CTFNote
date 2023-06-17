<template>
  <div class="text-h6">
    <q-btn-dropdown stretch flat round>
      <template #label>
        <div class="row q-gutter-md items-center">
          <task-menu v-if="task" :task="task" :context-menu="true" />
          <div>{{ title }}</div>
        </div>
      </template>
      <template #default>
        <q-list>
          <q-item v-for="t of sortedTasks" :key="t.nodeId" clickable>
            <q-item-section @click="taskLink(t)">
              <q-item-label>
                <div class="row" style="max-width: 200px">
                  <div class="col">
                    <div class="ellipsis">
                      {{ t.title }}
                    </div>
                  </div>
                  <div v-show="t.solved" class="col col-auto q-ml-xs">
                    <q-badge icon="flag" color="green" rounded>
                      <q-icon name="flag" />
                    </q-badge>
                  </div>
                </div>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="settings" flat round>
                <task-menu v-if="t" :task="t" :context-menu="false" />
              </q-btn>
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
import { tagsSortFn } from 'src/ctfnote/tags';

export default defineComponent({
  components: { TaskMenu },
  props: {
    ctf: { type: Object as () => Ctf, required: true },
    taskId: { type: Number, default: null },
  },
  computed: {
    task() {
      return this.ctf.tasks.find((t) => t.id == this.taskId);
    },
    title() {
      if (this.task) {
        return this.task.title;
      }
      return 'Open task';
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

<style scoped></style>
