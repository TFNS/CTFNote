<template>
  <q-card>
    <q-card-section>
      <q-table
        v-model:pagination="pagination"
        no-data-label="No CTF available."
        flat
        :rows="ctfs"
        :loading="loading"
        :columns="columns"
        :rows-per-page-options="rowsPerPageOptions"
        @request="onRequest"
      >
        <template #body="props">
          <q-tr :props="props">
            <card-admin-menu :ctf="props.row" />
            <q-td key="title" :props="props">
              <ctf-note-link :ctf="props.row" name="ctf">
                <q-btn flat :label="props.row.title" />
              </ctf-note-link>
            </q-td>
            <q-td key="date" :props="props">
              {{ formatTime(props.row) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { date } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import ctfnote from 'src/ctfnote';
import { computed, defineComponent, ref, watch } from 'vue';
import CtfNoteLink from '../Utils/CtfNoteLink.vue';
import CardAdminMenu from './CardAdminMenu.vue';

type OnRequestProps = {
  pagination: {
    rowsPerPage: number;
    page: number;
    rowsNumber: number;
  };
};

export default defineComponent({
  components: { CardAdminMenu, CtfNoteLink },
  setup() {
    const pagination = ref({
      rowsNumber: 0,
      rowsPerPage: 20,
      page: 1,
    });

    const { result: pastCtfs, loading } = ctfnote.ctfs.getPastCtfs(() => ({
      first: pagination.value.rowsPerPage,
      offset: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    }));

    watch(
      () => pastCtfs.value.total,
      (v) => {
        if (v !== 0) pagination.value.rowsNumber = v;
      },
      { immediate: true }
    );

    return {
      ctfs: computed(() => pastCtfs.value.ctfs),
      loading,
      pagination,
      rowsPerPageOptions: [5, 10, 15, 20, 30, 40, 50],
      columns: [
        {
          name: 'title',
          classes: 'text-center',
          align: 'center',
          label: 'Title',
        },
        {
          name: 'date',
          align: 'right',
          label: 'Date',
        },
      ],
    };
  },
  methods: {
    formatTime(ctf: Ctf) {
      return date.formatDate(ctf.startTime, 'YYYY-MM-DD');
    },
    onRequest(props: OnRequestProps) {
      const { rowsPerPage, page, rowsNumber } = props.pagination;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.page = page;
      this.pagination.rowsNumber = rowsNumber;
    },
  },
});
</script>
