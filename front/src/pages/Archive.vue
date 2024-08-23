<template>
  <q-page padding>
    <q-card>
      <q-card-section class="col flex gap-md items-center">
        <q-icon size="md" name="archive" />
        <div class="text-h6">CTF Archive</div>
        <q-space />
        <div class="text-subtitle2">Total: {{ ctfs.length }}</div>
      </q-card-section>
      <q-table
        v-if="$q.screen.gt.sm"
        flat
        :columns="columns"
        :pagination="{ rowsPerPage: 0 }"
        :rows="ctfs"
        hide-pagination
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="title">
              <ctf-note-link name="ctf" :ctf="props.row">
                <q-btn flat class="full-width">
                  <div class="ellipsis">
                    {{ props.row.title }}
                  </div>
                  <q-space />
                </q-btn>
              </ctf-note-link>
            </q-td>
            <q-td key="startTime" auto-width>
              <time-chip :date="props.row.startTime" />
            </q-td>
            <q-td key="endTime" auto-width>
              <time-chip :date="props.row.endTime" />
            </q-td>
            <q-td key="link" auto-width>
              <link-chip v-if="props.row.ctfUrl" :url="props.row.ctfUrl" />
            </q-td>
            <q-td key="ctftime" auto-width>
              <div class="flex no-wrap items-center q-pr-sm justify-end gap-sm">
                <weight-badge v-if="props.row.ctftimeUrl" :ctf="props.row" />
                <ctf-time-link
                  v-if="props.row.ctftimeUrl"
                  mini
                  class="ctftime-link"
                  :ctf="props.row"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-card-section v-else class="q-px-none">
        <q-list separator>
          <q-expansion-item
            v-for="ctf of ctfs"
            :key="ctf.nodeId"
            :label="ctf.title"
            class="full-width"
          >
            <template #header>
              <q-item-section>{{ ctf.title }} </q-item-section>
              <q-item-section side>
                {{ date.formatDate(ctf.startTime, 'YYYY MMM DD') }}
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="column gap-sm">
                <div class="row items-center justify-between gap-sm">
                  <time-chip :date="ctf.startTime" label="Start:" />
                  <time-chip :date="ctf.endTime" label="End:" />
                </div>
                <div class="row items-center justify-between gap-sm">
                  <link-chip v-if="ctf.ctfUrl" :url="ctf.ctfUrl" />
                  <q-space />
                  <div v-if="ctf.ctftimeUrl" class="row gap-sm items-center">
                    <weight-badge :ctf="ctf" />
                    <ctf-time-link mini class="ctftime-link" :ctf="ctf" />
                  </div>
                </div>
                <div class="row items-center gap-sm q-pt-sm">
                  <ctf-note-link name="ctf" :ctf="ctf">
                    <q-btn
                      dense
                      padding="6px"
                      color="primary"
                      label="Open CTF"
                      icon="flag"
                    />
                  </ctf-note-link>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import CtfTimeLink from 'src/components/CTF/CtfTimeLink.vue';
import WeightBadge from 'src/components/CTF/WeightBadge.vue';
import CtfNoteLink from 'src/components/Utils/CtfNoteLink.vue';
import LinkChip from 'src/components/Utils/LinkChip.vue';
import TimeChip from 'src/components/Utils/TimeChip.vue';
import ctfnote from 'src/ctfnote';
import { date } from 'quasar';
import { Ctf } from 'src/ctfnote/models';
import { computed } from 'vue';

const columns: QTableColumn<Ctf>[] = [
  {
    name: 'title',
    label: 'Title',
    align: 'left',
    field: 'title',
    headerStyle: 'padding-left: 32px',
    sortable: true,
  },
  {
    name: 'startTime',
    label: 'Start Time',
    align: 'left',
    field: 'startTime',
    sortable: true,
  },
  {
    name: 'endTime',
    label: 'End Time',
    align: 'left',
    field: 'endTime',
    sortable: true,
  },
  {
    name: 'link',
    label: 'Link',
    align: 'left',
    field: 'ctfUrl',
  },
  {
    name: 'ctftime',
    label: 'CTFTime',
    align: 'left',

    sortable: true,
    field: (row) => (row.ctfUrl ? row.weight : -1),
  },
];

const { result } = ctfnote.ctfs.getAllCtfs();

const ctfs = computed(() => {
  return Array.from(result.value).sort((a, b) => {
    return a.startTime.getTime() - b.startTime.getTime();
  });
});
</script>
