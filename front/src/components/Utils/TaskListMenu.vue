<template>
  <div class="text-h6">
    <q-btn-dropdown stretch flat round :split="!!task" :to="taskLink(task)">
      <template #label>
        <div class="row q-gutter-md items-center">
          <div>{{ title }}</div>
          <div class="col">
            <q-badge v-if="task" :style="colorHash(task.category)">
              {{ task.category }}
            </q-badge>
          </div>
        </div>
      </template>
      <template #default>
        <q-list>
          <q-item
            v-for="t of sortedTasks"
            :key="t.nodeId"
            v-close-popup
            clickable
            :to="taskLink(t)"
          >
            <q-item-section>
              <q-item-label>
                <div>
                  {{ t.title }}
                  <q-badge
                    v-if="t.solved"
                    color="positive"
                    class="q-ml-sm"
                    transparent
                  >
                    ⚑
                  </q-badge>
                </div>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip class="text-white" :style="colorHash(t.category)">{{
                t.category
              }}</q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-btn-dropdown>
  </div>
</template>

<script lang="ts">
import { Ctf, Task } from 'src/ctfnote';
import { colorHash } from 'src/ctfnote/utils';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {},
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
      return this.ctf.tasks.slice().sort((a, b) => {
        const acat = (a.category ?? '').toLowerCase();
        const bcat = (b.category ?? '').toLowerCase();
        if (acat == bcat) {
          const atitle = a.title.toLowerCase();
          const btitle = a.title.toLowerCase();
          return atitle == btitle ? 0 : atitle < btitle ? -1 : 1;
        }
        return acat < bcat ? -1 : 1;
      });
    },
  },
  methods: {
    taskLink(task: Task | null = null) {
      if (!task) {
        return null;
      }
      return {
        name: 'task',
        params: {
          ctfId: this.ctf.id,
          ctfSlug: this.ctf.slug,
          taskId: task.id,
          taskSlug: task.slug,
        },
      };
    },

    colorHash(s?: string | null) {
      return { backgroundColor: colorHash(s ?? '') };
    },
  },
});
</script>

<style scoped></style>
