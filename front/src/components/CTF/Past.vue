<template>
  <q-card>
    <q-card-section>
      <q-table flat :pagination="pagination" :data="ctfs" :loading="$apollo.queries.ctfs.loading" :columns="columns">
        <template #body-cell-title="props">
          <q-td :props="props">
            <q-btn
              flat
              :to="{ name: 'ctfinfo', params: { ctfId: props.row.id, ctfSlug: props.row.slug } }"
              :label="props.value"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import db from "src/gql";
import { formatTime } from "src/utils";

export default {
  data() {
    const pagination = { rowsPerPage: 20 };
    const columns = [
      { name: "title", classes: "text-center", align: "center", sortable: true, label: "Title", field: "title" },
      {
        name: "data",
        align: "right",
        sortable: true,
        label: "Date",
        field: (task) => task.startTime,
        format: (t) => formatTime(t),
      },
    ];
    return {columns, pagination };
  },
  apollo: {
    ctfs: {
      query: db.ctf.PAST,
      fetchPolicy: "cache-and-network",
      update: (data) => data.pastCtf.nodes,
    },
  },
};
</script>