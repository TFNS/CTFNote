<template>
  <q-expansion-item v-model="expanded" :label="title" :header-style="style">
    <q-list>
      <q-item clickable tag="a" :to="$ctfnote.taskLink(ctf, task)" v-for="task in tasks" :key="task.id" :task="task">
        <q-item-section>
          <q-item-label icon="check">
            {{ task.title }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon :color="$ctfnote.taskIconColor(task)" :name="$ctfnote.taskIcon(task)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script>
import { colorHash } from "../utils";
export default {
  props: {
    ctf: { type: Object, required: true },
    title: { type: String, required: true },
    tasks: { type: Array, required: true }
  },
  data() {
    return { expanded: true };
  },
  computed: {
    style() {
      return { fontWeight: "bold", backgroundColor: colorHash(this.title) };
    }
  }
};
</script>
