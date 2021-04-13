<template>
  <div>
    <left-menu-category-list
      :title="category"
      :tasks="tasks"
      :ctf="ctf"
      :key="category"
      v-for="[category, tasks] of menu"
    />
    <q-list v-if="Object.keys(menu).length == 0">
      <q-item-label header>
        No tasks yet
      </q-item-label>
    </q-list>
  </div>
</template>

<script>
import db from "src/gql";
import LeftMenuCategoryList from "./LeftMenuCategoryList.vue";
export default {
  components: { LeftMenuCategoryList },
  props: {
    ctf: { type: Object, required: true }
  },
  apollo: {
    tasks: {
      query: db.task.ALL,
      variables() {
        return { ctfId: this.ctf.id };
      },
      update: data => data.tasks.nodes
    }
  },
  computed: {
    menu() {
      const tasks = this.tasks || [];
      const categories = {};
      for (const task of tasks) {
        if (!(task.category in categories)) {
          categories[task.category] = [];
        }
        categories[task.category].push(task);
      }
      return Object.entries(categories).sort();
    }
  }
};
</script>
