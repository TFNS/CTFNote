<template>
  <q-page class="page q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Team</div>
      </q-card-section>

      <q-table
        flat
        dense
        :columns="columns"
        :rows="team"
        hide-pagination
        :pagination="pagination"
      >
        <template #body-cell-username="props">
          <q-td key="username" :props="props">
            <user-badge :profile="props.row" class="q-mx-none" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Role } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { defineComponent } from 'vue';
import UserBadge from '../components/Profile/UserBadge.vue';

export default defineComponent({
  components: { UserBadge },
  setup() {
    const team = ctfnote.profiles.injectTeam();
    const pagination = {
      rowsPerPage: 0,
    };
    const columns = [
      {
        name: 'role',
        label: 'Role',
        sortable: true,
        field: 'role',
        style: 'width: 75px; max-width: 75px; text-transform: capitalize',
        align: 'left',
        format: (r: Role) => r.slice(5).toLowerCase(),
      },
      {
        name: 'username',
        headerStyle: 'col-auto',
        size: 'auto',
        sortable: true,
        field: 'username',
        label: 'Username',
        style: 'width: 165px; max-width: 165px',
        align: 'left',
      },
      {
        name: 'description',
        field: 'description',
        sortable: true,
        label: 'Description',
        align: 'left',
      },
    ];
    return { team, columns, pagination };
  },
});
</script>

<style scoped></style>
