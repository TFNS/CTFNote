<template>
  <q-page padding class="q-gutter-md">
    <div class="text-h4">CTFNote Settings</div>
    <q-table hide-bottom :data="settings" :columns="columns" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="key" auto-width :props="props">
            <b>{{ props.row.key }}</b>
          </q-td>
          <q-td key="value" class="config-value" :props="props">
            <div v-if="props.row.type === 'boolean'">
              <q-toggle v-model="props.row.value" @input="update(props.row.key, props.row.value)" color="positive" />
            </div>
            <div v-if="props.row.type === 'string'">
              {{ props.row.value }}
              <q-popup-edit
                buttons
                v-model="props.row.value"
                @save="update(props.row.key, props.row.value)"
                title="Change string value"
              >
                <q-input v-model="props.row.value" dense autofocus buttons />
              </q-popup-edit>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editStringDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="secondary" text-color="white" />
          <span class="q-ml-sm">Which value do you want to set ?</span>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editStringValue" @keydown.enter.prevent="submitStringValue()"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn flat label="Submit" color="primary" @click="submitStringValue()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import api from "src/api";
export default {
  name: "Config",
  data: () => ({
    editStringDialog: false,
    editStringValue: "",

    settings: [],
    columns: [
      {
        name: "key",
        label: "Key",
        field: "key",
        sortable: true
      },

      {
        name: "value",
        label: "Value",
        field: "value",
        sortable: true
      }
    ]
  }),
  methods: {
    async update(key, value) {
      try {
        const config = await api.setConfiguration({ [key]: value });
        this.settings = await this.parseConfiguration(config);
      } catch (e) {
        console.error(e);
      }
    },
    async submitStringValue() {
      const value = this.editStringValue;

      this.editStringValue = "";
      this.editStringDialog = false;
    },
    async getConfiguration() {
      try {
        return await api.getConfiguration();
      } catch (e) {
        return null;
      }
    },
    async parseConfiguration(configuration) {
      const settings = [];

      for (const [key, value] of Object.entries(configuration || {})) {
        settings.push({ key, value, type: typeof value });
      }

      return settings;
    }
  },
  async mounted() {
    // Check permissions
    // Use store to fetch permissions list
    // If the user does not have any permission in the HTTP response  it's because he's not admin
    this.settings = await this.parseConfiguration(await this.getConfiguration());
  }
};
</script>
<style lang="scss" scoped>
.config-value {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
