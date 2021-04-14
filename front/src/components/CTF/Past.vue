<template>
  <q-card>
    <q-card-section>
      <q-table
        no-data-label="No CTF available."
        flat
        :pagination="pagination"
        :data="ctfs"
        :loading="$apollo.queries.ctfs.loading"
        :columns="columns"
      >
        <template #body-cell-title="props">
          <q-td :props="props">
            <q-btn
              flat
              :to="{ name: 'ctfinfo', params: { ctfId: props.row.id, ctfSlug: props.row.slug } }"
              :label="props.value"
              :disable="!props.row.granted"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import db from "src/gql";
import { getDateTime } from "src/utils";

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
        field: task => task.startTime,
        format: t => getDateTime(t)
      }
    ];
    return { columns, pagination };
  },
  apollo: {
    ctfs: {
      query: db.ctf.PAST,
      update: data => data.pastCtf.nodes
    }
  }
};
</script>
