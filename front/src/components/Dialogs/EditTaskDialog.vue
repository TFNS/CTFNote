<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="import-task-dialog">
      <q-card-section class="row">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input label="Title" v-model="form.title" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input label="Category" v-model="form.category" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input label="Description" v-model="form.description" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input label="Flag" v-model="form.flag" />
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="warning" label="Cancel" v-close-popup />
        <q-btn color="positive" type="submit" :label="editText" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import db from "src/gql";

export default {
  props: { task: Object, ctfId: Number },
  data() {
    const originalTitle = this.task?.title || 'Task'
    const form = {
      title: this.task?.title,
      description: this.task?.description,
      category: this.task?.category,
      solved: this.task?.solved,
      flag: this.task?.flag,
    };
    return {
      form,
      originalTitle
    };
  },
  computed: {
    editText() {
      return this.task ? "Edit" : "Create";
    },
    title() {
      return this.task ? `Edit task ${this.originalTitle}` : "Create task";
    },
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    async updateTask(id, task) {
      await this.$apollo.mutate({
        mutation: db.task.UPDATE,
        variables: { id, ...task },
      });
    },
    async createTask(task) {
      await this.$apollo.mutate({
        mutation: db.task.CREATE,
        variables: { ...task, ctfId: this.ctfId },
      });
    },
    async submit() {
      if (this.task) {
        await this.updateTask(this.task.id, this.form);
      } else {
        await this.createTask(this.form);
      }
      this.$emit("ok", this.form);
      this.hide();
    },
  },
};
</script>

<style>
.import-task-dialog {
  min-width: 50%;
  max-width: 100%;
}
</style>