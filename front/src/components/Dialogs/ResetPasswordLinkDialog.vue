<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="import-task-dialog">
      <q-card-section class="row">
        <div class="text-h6">New Reset Password Link For '{{ user.username }}'</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none" v-if="!!link">
        <q-input filled bottom-slots>
          <template v-slot:before>
            <q-icon name="lock" />
          </template>

          <template v-slot:append>
            <q-btn round dense flat icon="refresh" @click="retrievelink()" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section v-if="!!!link">
        <q-skeleton type="QInput" />
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="warning" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import db from "src/gql";

export default {
  props: { user: Object },
  created() {
    this.retrieveLink();
  },
  data() {
    return {
      link: null,
    };
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },

    async retrieveLink() {
      this.link = null;

      const data = this.$apollo.mutate({
        mutation: db.auth.RESET_PASSWORD_LINK,
        variables: {
          userId: this.user.id,
        },
      });

      console.log(data);
    },
  },
};
</script>

<style>
.import-task-dialog {
  min-width: calc(min(600px, 90vw));
}
</style>