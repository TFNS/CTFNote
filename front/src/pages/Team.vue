<template>
  <q-page class="page q-pa-md">
    <q-card class="">
      <q-card-section>
        <div class="text-h6">Team</div>
      </q-card-section>
      <q-table :columns="columns" :rows="team" :rows-per-page-options="0">
        <template #body-cell-username="props">
          <q-td key="username" :props="props">
            <user-badge :profile="props.row" />
          </q-td>
        </template>
        <template #body-cell-description="props">
          <q-td key="description" :props="props"
            ><q-markdown no-html :src="props.value" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Role, TeamKey } from 'src/ctfnote';
import { injectStrict } from 'src/utils';
import { defineComponent } from 'vue';
import UserBadge from '../components/Profile/UserBadge.vue';

export default defineComponent({
  components: { UserBadge },
  setup() {
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
    return { team: injectStrict(TeamKey), columns };
  },
});
</script>

<style scoped></style>
