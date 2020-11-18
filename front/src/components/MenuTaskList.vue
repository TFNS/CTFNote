<template>
  <q-item clickable tag="a" :to="task.to">
    <q-item-section>
      <q-item-label icon="check">{{ task.title }}</q-item-label>
    </q-item-section>
    <q-item-section avatar v-if="task.solved">
      <q-icon color="positive" name="check" />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "EssentialLink",
  props: {
    task: {
      type: Object,
      required: true
    }
  }
};
</script>
