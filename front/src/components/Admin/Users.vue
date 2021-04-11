<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="text-h6">Registered users</div>
    </q-card-section>
    <q-card-section>
      <q-table
        flat
        bordered
        hide-bottom
        :pagination="pagination"
        :loading="$apollo.queries.profiles.loading"
        :columns="columns"
        :data="profiles"
      >
        <template #body-cell-id="{ value }">
          <q-td auto-width>{{ value }}</q-td>
        </template>
        <template #body-cell-username="{ value }">
          <q-td class="text-right">
            {{ value }}
            <q-popup-edit :value="value">
              <q-input :value="value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </template>
        <template #body-cell-role="{ row, value }">
          <q-td>
            <q-select dense :value="value" :options="Object.keys($ctfnote.roles)" @input="v => updateRole(row.id, v)" />
          </q-td>
        </template>
        <template #body-cell-btns>
          <q-td auto-width>
            <q-btn color="negative" size="sm" round icon="delete"/>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import db from "src/gql";
export default {
  apollo: {
    profiles: {
      query: db.profile.ALL,
      update: (data) => data.profiles.nodes,
    },
  },
  data() {
    const pagination = {
      rowsPerPage: 0,
    };
    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "username", label: "Username", field: "username", sortable: true },
      { name: "role", label: "Role", field: "role", sortable: true },
      { name: "btns"},
    ];
    return { columns, pagination };
  },
  methods: {
    updateRole(userId, role){
      this.$apollo.mutate({
        mutation: db.profile.UPDATE_ROLE,
        variables: {userId, role}
      })
    }
  }
};
</script>

<style>
</style>