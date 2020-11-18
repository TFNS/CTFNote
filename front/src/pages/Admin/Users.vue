<template>
  <q-page padding class="q-gutter-md">
    <div class="text-h4">Users administration</div>
    <q-table
      hide-bottom
      :data="users"
      :columns="columns"
      :pagination="pagination"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="slug" auto-width :props="props">
            {{ props.row.slug }}
          </q-td>
          <q-td key="username" :props="props">
            {{ props.row.username }}
            <q-popup-edit
              v-model="props.row.username"
              buttons
              @save="updateUsername(props.row.slug, props.row.username)"
              title="Change username"
            >
              <q-input v-model="props.row.username" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="password" :props="props">
            {{ "*".repeat(10) }}
            <q-popup-edit
              v-model="props.row.password"
              buttons
              @save="updatePassword(props.row.slug, props.row.password)"
              title="Change password"
            >
              <q-input v-model="props.row.password" dense autofocus buttons />
            </q-popup-edit>
          </q-td>
          <q-td key="rights" :props="props" width="50%">
            <q-select
              filled
              v-model="props.row.rights"
              use-input
              use-chips
              multiple
              input-debounce="2000"
              @input="updateRights(props.row.slug, props.row.rights)"
              :options="Object.values(Rights)"
            />
          </q-td>
          <q-td key="actions" auto-width :props="props">
            <q-btn
              title="Delete user"
              icon="delete"
              color="negative"
              @click="askDelete(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="showDeleteUserDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete
            {{ userToDelete && userToDelete.username }} ?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative"  @click="deleteUser(userToDelete.slug)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { Rights } from "src/enums";
import { showErrors } from "src/utils";
export default {
  computed: { ...mapGetters(["users"]) },
  methods: {
    askDelete(user) {
      this.showDeleteUserDialog = true;
      this.userToDelete = user;
    },
    async deleteUser(slug) {
      const errors = await this.$store.dispatch("deleteUser", slug);
      showErrors(this, errors)
    },
    async updateUsername(slug, username) {
      const errors = await this.$store.dispatch("updateUser", [slug, { username }]);
      showErrors(this, errors)
    },
    async updatePassword(slug, password) {
      const errors = await this.$store.dispatch("updateUser", [slug, { password }]);
      showErrors(this, errors)
    },
    async updateRights(slug, rights) {
      const errors = await this.$store.dispatch("updateUser", [slug, { rights }]);
      showErrors(this, errors)
    }
  },
  data() {
    const pagination = {
      rowsPerPage: 0
    };
    const columns = [
      {
        name: "slug",
        label: "Slug",
        field: "slug",

        sortable: true
      },
      {
        name: "username",
        label: "Username",
        field: "username",

        sortable: true
      },
      {
        name: "password",
        label: "Password",
        field: () => "*".repeat(10)
      },
      {
        name: "rights",
        label: "Rights",
        field: row => `${row.rights}`
      },
      {
        name: "actions",
        label: "Delete",
        field: () => null
      }
    ];

    return {
      columns,
      pagination,
      Rights,
      showDeleteUserDialog: false,
      userToDelete: null
    };
  }
};
</script>
