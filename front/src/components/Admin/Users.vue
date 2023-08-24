<template>
  <q-card bordered>
    <q-card-section>
      <div class="row q-gutter-md">
        <div class="text-h6">Registered users</div>
        <div>
          <q-btn
            icon="person_add"
            round
            color="positive"
            size="sm"
            @click="inviteUser"
          >
            <q-tooltip>Create an invitation link</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
        flat
        bordered
        :rows-per-page-options="[0]"
        :loading="loading"
        :columns="columns"
        :rows="users"
        hide-pagination
      >
        <template #body-cell-id="{ value }">
          <q-td auto-width class="text-right">
            {{ value }}
          </q-td>
        </template>
        <template #body-cell-login="{ value }">
          <q-td class="text-right">
            {{ value }}
          </q-td>
        </template>
        <template #body-cell-lastactive="{ value }">
          <q-td class="text-right">
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
            <select-role
              dense
              :model-value="value"
              @update:model-value="(v) => updateRole(row, v)"
            />
          </q-td>
        </template>
        <template #body-cell-btns="{ row }">
          <q-td auto-width>
            <div class="q-gutter-sm">
              <q-btn
                color="negative"
                title="Delete the user"
                size="sm"
                round
                icon="delete"
                @click="removeUser(row)"
              >
                <q-tooltip>Remove the user</q-tooltip>
              </q-btn>
              <q-btn
                color="positive"
                size="sm"
                round
                icon="lock_clock"
                @click="resetPassword(row)"
              >
                <q-tooltip>Generate a password reset link</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { date } from 'quasar';
import { Role, User } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';

import { defineComponent } from 'vue';
import InviteUserDialog from '../Dialogs/InviteUserDialog.vue';
import ResetPasswordDialog from '../Dialogs/ResetPasswordDialog.vue';
import SelectRole from '../Utils/SelectRole.vue';

const pagination = {
  rowsNumber: 0,
  rowsPerPage: 0,
};
const columns = [
  {
    name: 'id',
    label: 'ID',
    field: (u: User) => u.profile.id,
    sortable: true,
  },
  { name: 'login', label: 'Login', field: 'login', sortable: true },
  {
    name: 'lastactive',
    label: 'Last active',
    field: (u: User) => {
      return date.formatDate(u.profile.lastactive, 'YYYY-MM-DD HH:mm:ss');
    },
    sortable: true,
  },
  {
    name: 'username',
    label: 'Username',
    field: (u: User) => u.profile.username,
    sortable: true,
  },
  { name: 'role', label: 'Role', field: 'role', sortable: true },
  {
    name: 'discordId',
    label: 'Discord ID',
    field: (u: User) => u.profile.discordId,
    sortable: true,
  },
  { name: 'btns' },
];

export default defineComponent({
  components: { SelectRole },
  setup() {
    const { result: users, loading, refetch } = ctfnote.admin.getUsers();
    return {
      me: ctfnote.me.injectMe(),
      deleteUser: ctfnote.admin.useDeleteUser(),
      updateUserRole: ctfnote.admin.useUpdateUserRole(),
      pagination,
      users,
      columns,
      loading,
      refetch,
    };
  },
  methods: {
    inviteUser(user: User) {
      this.$q.dialog({
        component: InviteUserDialog,
        componentProps: {
          user,
        },
      });
    },
    removeUser(user: User) {
      this.$q
        .dialog({
          title: `Delete ${user.login ?? ''} ?`,
          message: 'This operation is irreversible.',
          cancel: {
            label: 'Cancel',
            color: 'warning',
            flat: true,
          },
          ok: {
            label: `Delete ${user.login}`,
            color: 'negative',
          },
        })
        .onOk(() => {
          if (!user.id) return;
          void this.deleteUser(user.id).then(() => {
            void this.refetch();
          });
        });
    },
    resetPassword(user: User) {
      this.$q.dialog({
        component: ResetPasswordDialog,
        componentProps: {
          user,
        },
      });
    },
    async updateRole(user: User, role: Role) {
      const profile = user.profile;
      const performUpdate = async () => {
        this.loading = true;
        await this.updateUserRole(user, role);
        await this.refetch();
        this.loading = false;
      };

      const roleStr = role.toString().slice(5);

      if (profile.id == this.me.profile?.id) {
        this.$q
          .dialog({
            title: 'Are you sure ?',
            color: 'negative',
            message:
              'You are about to modify your own role, do you want to continue ?',

            cancel: {
              label: 'Cancel',
              color: 'warning',
              flat: true,
            },
            ok: {
              label: `Change to ${roleStr}`,
              color: 'negative',
            },
          })
          .onOk(() => {
            void performUpdate();
          });
      } else {
        await performUpdate();
      }
    },
  },
});
</script>

<style scoped></style>
