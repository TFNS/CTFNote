<template>
  <q-card class="edit-ctf">
    <q-form @submit="editCtf">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ title }}</div>
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
              <q-input v-model="form.ctfTimeUrl" label="CTFTime Link" />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-input v-model="form.logoUrl" clearable label="Logo link">
                <template v-slot:after>
                  <q-btn round color="primary" icon="backup" @click="$refs.logoUpload.$el.click()" />
                </template>
              </q-input>
              <q-file
                class="hidden"
                ref="logoUpload"
                clearable
                @clear="form.logoUrl = ''"
                @input="uploadFile"
                accept=".jpg, image/*"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col">
              <q-input filled v-model="form.start" label="Start on">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.start" :events="isFinish" mask="YYYY/MM/DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.start" mask="YYYY/MM/DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input filled v-model="form.finish" label="Finish on">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.finish" :events="isStart" mask="YYYY/MM/DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.finish" mask="YYYY/MM/DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-tabs v-model="descPanel" dense indicator-color="primary" align="left" narrow-indicator>
                <q-tab name="description" label="Description" />
                <q-tab name="credentials" label="Credentials" />
              </q-tabs>
              <q-tab-panels v-model="descPanel" animated class="shadow-2 rounded-borders">
                <q-tab-panel name="description" class="q-pa-sm">
                  <q-input v-model="form.description" type="textarea" label="Description" />
                </q-tab-panel>
                <q-tab-panel name="credentials" class="q-pa-sm">
                  <q-input v-model="form.credentials" type="textarea" label="Credentials" />
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="q-gutter-md justify-end">
        <q-btn color="positive" type="submit" :label="editText" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { showErrors, getDate, getDateTime } from "../utils";
export default {
  props: {
    ctf: Object
  },
  data() {
    const form = {
      title: null,
      weight: null,
      ctfUrl: null,
      logoUrl: null,
      ctfTimeUrl: null,
      description: null,
      start: null,
      finish: null
    };
    if (this.ctf) {
      Object.assign(form, this.ctf);
      form.start = getDateTime(new Date(this.ctf.start));
      form.finish = getDateTime(new Date(this.ctf.finish));
    }
    return {
      newCtf: !Boolean(this.ctf),
      datePanel: "start",
      descPanel: "description",
      form
    };
  },
  computed: {
    editText() {
      return this.newCtf ? "Create" : `Update`;
    },
    title() {
      return this.newCtf ? "Create CTF" : `Edit ${this.ctf.title}`;
    }
  },
  methods: {
    isStart(date) {
      date = date.replace(/\//g, "-");
      return this.form.start && this.form.start.indexOf(date) == 0;
    },
    isFinish(date) {
      // hei viimeistely
      date = date.replace(/\//g, "-");
      return this.form.finish && this.form.finish.indexOf(date) == 0;
    },
    async editCtf() {
      let errors = null;
      const ctf = { ...this.form };
      ctf.start = new Date(ctf.start);
      ctf.finish = new Date(ctf.finish);

      if (this.newCtf) {
        errors = await this.$store.dispatch("createCtf", ctf);
      } else {
        errors = await this.$store.dispatch("updateCtf", [this.ctf.slug, ctf]);
      }
      if (errors) {
        showErrors(this, errors);
      } else {
        this.$emit("save");
      }
    },
    uploadFile(file) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        this.form.logoUrl = reader.result;
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style scoped>
.edit-ctf {
  min-width: 50%;
  max-width: 100%;
}
</style>
