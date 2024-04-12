<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <q-table
        v-model:pagination="pagination"
        no-data-label="No CTF available."
        flat
        dense
        :rows="ctfs"
        :loading="loading"
        :columns="columns"
        :rows-per-page-options="rowsPerPageOptions"
        @request="onRequest"
      >
        <template #body="props">
          <q-tr :props="props" style="height: 42px">
            <card-admin-menu :ctf="props.row" />
            <q-td key="title" :props="props">
              <ctf-note-link
                :ctf="props.row"
                name="ctf"
                class="stretched-link"
              />
              <span class="text-weight-medium">{{ props.row.title }}</span>
            </q-td>
            <q-td key="date" :props="props">
              <ctf-note-link
                :ctf="props.row"
                name="ctf"
                class="stretched-link"
              />
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
import { useStoredSettings } from 'src/extensions/storedSettings';
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
    const { makePersistant } = useStoredSettings();

    const rowsPerPage = makePersistant('ctf-rows-per-page', ref(50));

    const pagination = ref({
      rowsNumber: 0,
      rowsPerPage: rowsPerPage,
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

    watch(
      () => pagination.value.rowsPerPage,
      (v) => {
        rowsPerPage.value = v;
      },
      { immediate: true }
    );

    return {
      ctfs: computed(() => pastCtfs.value.ctfs),
      loading,
      pagination,
      rowsPerPage,
      rowsPerPageOptions: [25, 50, 75, 100, 150, 200, 250],
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

<style scoped lang="scss">
/* Bootstrap stretched-link class (https://github.com/twbs/bootstrap/blob/868705bed08f0824ec560e0397a023266786a26b/scss/helpers/_stretched-link.scss) */
.stretched-link::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  content: '';
}
</style>
