<template>
  <div class="head column q-px-md" :style="style">
    <div class="col q-py-md">
      <div class="row q-gutter-md items-center">
        <logo-link :ctf="ctf" />
        <div class="text-h4">
          {{ ctf.title }}
        </div>
        <btn-edit round @click="editCtf" />
        <btn-delete round @click="deleteCtf" />
        <q-space />
        <weight-badge :ctf="ctf" />
        <ctf-time-link :ctf="ctf" />
      </div>
    </div>

    <div class="col q-py-md">
      <div class="q-gutter-md items-center">
        <div>Start: {{ startTime }}</div>
        <div>End: {{ endTime }}</div>
      </div>
    </div>
    <div class="col q-py-md">
      <div class="row q-gutter-md">
        <div class="col">
          <div class="column q-gutter-sm">
            <div class="text-h6">Description</div>
            <q-markdown no-html :src="ctf.description" />
          </div>
        </div>
        <q-separator vertical />
        <div class="col">
          <div class="column q-gutter-sm">
            <div class="row">
              <div class="text-h6 q-mr-md">Credentials</div>
              <q-btn round size="sm" color="primary" v-if="$ctfnote.isManager" icon="edit" @click="editCredentials">
                <q-tooltip>Edit the credentials</q-tooltip>
              </q-btn>
            </div>
            <q-markdown no-html :src="credentials" class="blur" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditCtfDialog from "../Dialogs/EditCtfDialog.vue";
import * as utils from "src/utils";
import db from "src/gql";
import LogoLink from "./LogoLink.vue";
import CtfTimeLink from "./CtfTimeLink.vue";
import WeightBadge from "./WeightBadge.vue";
import BtnEdit from "./BtnEdit.vue";
import BtnDelete from "./BtnDelete.vue";
export default {
  components: { LogoLink, CtfTimeLink, WeightBadge, BtnEdit, BtnDelete },
  props: {
    ctf: { type: Object, required: true }
  },
  apollo: {
    credentials: {
      query: db.secret.GET,
      variables() {
        return { ctfId: this.ctf.id };
      },
      update: data => data.ctfSecret.credentials
    }
  },
  computed: {
    style() {
      return { "--bgUrl": `url(${this.ctf.logoUrl})` };
    },
    startTime() {
      return utils.getDateTime(this.ctf.startTime);
    },
    endTime() {
      return utils.getDateTime(this.ctf.endTime);
    }
  },
  methods: {
    editCredentials() {
      this.$q
        .dialog({
          title: "Edit credentials",
          color: "primary",
          prompt: {
            model: "",
            type: "textarea"
          },
          cancel: true
        })
        .onOk(async credz => {
          this.$apollo.mutate({
            mutation: db.secret.UPDATE,
            variables: { ctfId: this.ctf.id, credentials: credz },
            update: store => {
              const query = {
                query: db.secret.GET,
                variables: { ctfId: this.ctf.id }
              };
              const data = store.readQuery(query);
              data.ctfSecret.credentials = credz;
              store.writeQuery({ ...query, data });
            }
          });
        });
    },
    editCtf() {
      this.$q.dialog({
        component: EditCtfDialog,
        parent: this,
        ctf: this.ctf
      });
    },
    async deleteCtf() {
      this.$q
        .dialog({
          title: `Delete ${this.ctf.title} ?`,
          color: "negative",
          message: `This will delete all the tasks, but not the pads.`,
          ok: "Delete",
          cancel: true
        })
        .onOk(async () => {
          await this.$apollo.mutate({
            mutation: db.ctf.DELETE,
            variables: {
              id: this.ctf.id
            },
            refetchQueries: ["IncomingCtfs", "PastCtfs"]
          });
          this.$router.push({ name: "index" });
        });
    }
  }
};
</script>

<style lang="scss" scopped>
.head * {
  z-index: 1;
}
.head::before {
  z-index: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  content: "";
  opacity: 0.3;
  background: var(--bgUrl);
  background-position: 90% 50%;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
