<template>
  <q-dialog ref="dialog" @hide="$emit('hide')">
    <q-card class="ctfnote-dialog">
      <q-form @submit="submit">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ title }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />
        <q-card-section>
          <div class="col q-col-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input v-model="form.title" required label="Title" />
              </div>
              <div class="col-auto">
                <q-input v-model.number="form.weight" step="0.01" type="number" label="Weight" />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input v-model="form.ctfUrl" label="CTF link" />
              </div>
              <div class="col">
                <q-input v-model="form.ctftimeUrl" label="CTFTime Link" />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <logo-field v-model="form.logoUrl" />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col">
                <datetime-input v-model="form.startTime" label="Start on" />
              </div>
              <div class="col">
                <datetime-input v-model="form.endTime" label="End on" />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col">
                <q-input v-model="form.description" type="textarea" label="Description" hint="markdown" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-gutter-md justify-end">
          <q-btn color="warning" label="Cancel" @click="hide" />
          <q-btn color="positive" type="submit" :label="editText" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import DatetimeInput from "../DatetimeInput.vue";
import db from "src/gql";
import LogoField from "../LogoField.vue";
export default {
  components: { DatetimeInput, LogoField },
  props: {
    ctf: { type: Object, default: null }
  },
  data() {
    const now = new Date().toISOString().split(".")[0] + "Z";
    const form = {
      title: this.ctf?.title,
      weight: this.ctf?.weight,
      ctfUrl: this.ctf?.ctfUrl,
      ctftimeUrl: this.ctf?.ctftimeUrl,
      logoUrl: this.ctf?.logoUrl,
      startTime: this.ctf?.startTime || now,
      endTime: this.ctf?.endTime || now,
      description: this.ctf?.description,
      credentials: this.ctf?.credentials
    };
    return {
      panel: "description",
      form
    };
  },
  computed: {
    editText() {
      return this.ctf ? "Edit" : "Create";
    },
    title() {
      return this.ctf ? `Edit ${this.ctf.title}` : "Create CTF";
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    editCtf(id, ctf) {
      this.$apollo.mutate({
        mutation: db.ctf.UPDATE,
        variables: { id, ...ctf }
      });
      this.hide();
    },
    createCtf(ctf) {
      this.$apollo.mutate({
        mutation: db.ctf.CREATE,
        variables: ctf
      });
      this.hide();
    },
    async submit() {
      if (this.ctf) {
        await this.editCtf(this.ctf.id, this.form);
      } else {
        await this.createCtf(this.form);
      }
      this.$emit("ok", this.form);
    }
  }
};
</script>
