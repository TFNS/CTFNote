<template>
  <q-page class="page q-pa-md">
    <q-card class="">
      <q-card-section>
        <div class="text-h6">Team</div>
      </q-card-section>
      <q-table
        :columns="columns"
        :rows="team"
        hide-pagination
        :pagination="pagination"
      >
        <template #body-cell-username="props">
          <q-td key="username" :props="props">
            <user-badge :profile="props.row" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Role } from 'src/ctfnote';
import { getTeam } from 'src/ctfnote/profiles';
import { defineComponent } from 'vue';
import UserBadge from '../components/Profile/UserBadge.vue';

export default defineComponent({
  components: { UserBadge },
  setup() {
    const { result: team } = getTeam();
    const pagination = {
      rowsPerPage: 0,
    };
    const columns = [
      {
        name: 'role',
        sortable: true,
        field: 'role',
        headerStyle: 'max-width: 150px',
        style: 'text-transform: capitalize; width: 150px;',
        label: 'role',
        format: (r: Role) => r.slice(5).toLowerCase(),
      },
      {
        name: 'username',
        headerStyle: 'col-auto',
        style: 'width: 300px;',
        size: 'auto',
        sortable: true,
        field: 'username',
        label: 'Username',
      },
      {
        name: 'description',
        field: 'description',
        sortable: true,
        label: 'Description',
      },
    ];
    return { team, columns, pagination };
  },
});
</script>

<style scoped></style>
