<template>
  <q-card>
    <q-card-section>
      <q-table
        no-data-label="No CTF available."
        flat
        :pagination.sync="pagination"
        :data="ctfs"
        :loading="loading"
        :columns="columns"
        @request="onRequest"
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

const MAX_PER_PAGE = 100;

export default {
  mounted() {
    this.onRequest({ pagination: this.pagination });
  },
  data() {
    return {
      columns: [
        { name: "title", classes: "text-center", align: "center", sortable: true, label: "Title", field: "title" },
        {
          name: "data",
          align: "right",
          sortable: true,
          label: "Date",
          field: (task) => task.startTime,
          format: (t) => getDateTime(t),
        },
      ],
      pagination: { rowsNumber: 500, rowsPerPage: 15 },
      ctfs: [],
      loading: false,
    };
  },
  methods: {
    async onRequest(props) {
      const { rowsPerPage } = props.pagination;

      let page = props.pagination.page;

      if (page === void 0) {
        page = 1;
      }
      page--;

      let first = rowsPerPage > MAX_PER_PAGE ? MAX_PER_PAGE : rowsPerPage;

      if (first == 0) first = MAX_PER_PAGE;

      const offset = page * first;

      this.loading = true;
      const {
        data: {
          pastCtf: { totalCount, nodes: ctfs },
        },
      } = await this.$apollo.mutate({
        mutation: db.ctf.PAST,
        variables: { first, offset },
      });
      this.loading = false;

      this.ctfs = ctfs;

      this.pagination.rowsNumber = totalCount;
      this.pagination.rowsPerPage = first;
      this.pagination.page = page + 1;
    },
  },
};
</script>
