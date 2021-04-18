<template>
  <q-card>
    <q-card-section>
      <div class="row q-gutter-md">
        <div class="text-h6">
          Registered users
        </div>
        <div>
          <q-btn icon="person_add" round color="positive" size="sm" @click="inviteUser" />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
        flat
        bordered
        hide-bottom
        :pagination="pagination"
        :loading="$apollo.queries.users.loading"
        :columns="columns"
        :data="users"
      >
        <template #body-cell-id="{ value }">
          <q-td auto-width class="text-right">
            {{ value }}
          </q-td>
        </template>
        <template #body-cell-username="{ value }">
          <q-td class="text-right">
            {{ value }}
          </q-td>
        </template>
        <template #body-cell-role="{ row, value }">
          <q-td>
            <q-select dense :value="value" :options="Object.keys($ctfnote.roles)" @input="v => updateRole(row.id, v)" />
          </q-td>
        </template>
        <template #body-cell-btns="{ row }">
          <q-td auto-width>
            <div class="q-gutter-sm">
              <q-btn color="negative" title="Delete the user" size="sm" round icon="delete" @click="removeUser(row)" />
              <q-btn
                color="positive"
                title="Create a password reset token"
                size="sm"
                round
                icon="lock_clock"
                @click="resetPassword(row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import db from "src/gql";
import ResetPasswordLinkDialog from "../Dialogs/ResetPasswordLinkDialog";
import InviteUserDialog from "../Dialogs/InviteUserDialog.vue";

export default {
  apollo: {
    users: {
      query: db.admin.USERS,
      update: data => data.users.nodes
    }
  },
  data() {
    const pagination = {
      rowsPerPage: 0
    };
    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "username", label: "Login", field: "login", sortable: true },
      { name: "role", label: "Role", field: "role", sortable: true },
      { name: "btns" }
    ];
    return { columns, pagination };
  },
  methods: {
    removeUser(user) {
      this.$q
        .dialog({
          title: `Delete ${user.login} ?`,
          message: `This operation is irreversible.`,
          cancel: true,
          ok: {
            label: "Delete",
            color: "negative"
          }
        })
        .onOk(async () => {
          this.$apollo.mutate({
            mutation: db.admin.DELETE_USER,
            variables: {
              userId: user.id
            },
            refetchQueries: [{ query: db.admin.USERS }]
          });
        });
    },
    inviteUser() {
      this.$q.dialog({
        component: InviteUserDialog,
        parent: this
      });
    },
    updateRole(userId, role) {
      const performUpdate = () => {
        this.$apollo.mutate({
          mutation: db.admin.UPDATE_ROLE,
          variables: { userId, role },
          update: (store, { data: { updateUserRole } }) => {
            const query = {
              query: db.admin.USERS
            };

            const data = store.readQuery(query);
            const user = data.users.nodes.find(u => u.id === userId);

            user.role = updateUserRole.role;

            store.writeQuery({ ...query, data });
          }
        });
      };

      if (this.$ctfnote.me.id === userId) {
        this.$q
          .dialog({
            title: `Are you sure ?`,
            color: "negative",
            message: "You are about to modify your own role, are you sure ?",
            ok: "Change Role",
            cancel: true
          })
          .onOk(performUpdate);
        return;
      }

      performUpdate();
    },
    resetPassword(user) {
      this.$q.dialog({
        component: ResetPasswordLinkDialog,
        parent: this,
        user
      });
    }
  }
};
</script>
