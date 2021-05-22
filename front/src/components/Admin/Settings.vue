<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Global settings</div>
    </q-card-section>
    <q-card-section>
      <q-table flat hide-bottom :data="data" :columns="columns" row-key="name">
        <template #body-cell-value="props">
          <q-td :props="props">
            <q-toggle
              @input="v => updateSetting(props.row.name, v)"
              v-model="props.row.value"
              color="positive"
              v-if="props.row.type == 'boolean'"
            />
            <template v-if="props.row.type == 'string'">
              {{ props.row.value }}

              <q-popup-edit auto-save @save="v => updateSetting(props.row.name, v)" v-model="props.row.value">
                <q-input v-model="props.row.value" dense autofocus />
              </q-popup-edit>
            </template>
            <template v-if="props.row.type == 'number'">
              nb {{ props.row.value }}

              <q-popup-edit auto-save @save="v => updateSetting(props.row.name, parseInt(v))" v-model="props.row.value">
                <q-input type="number" v-model="props.row.value" dense autofocus />
              </q-popup-edit>
            </template>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import db from "src/gql";
export default {
  data() {
    const ignoreColumns = ["__typename", "nodeId"];
    const data = Object.entries(this.$ctfnote.settings)
      .filter(([name]) => !ignoreColumns.includes(name))
      .map(([name, value]) => ({
        name,
        type: typeof value,
        value
      }));
    const columns = [
      { name: "name", label: "Setting", field: "name" },
      { name: "value", label: "Value", field: "value" }
    ];
    return { columns, data };
  },
  methods: {
    updateSetting(setting, v) {
      this.$apollo
        .mutate({
          mutation: db.settings.UPDATE,
          variables: { settings: { [setting]: v } }
        })
        .then(() => {
          this.$ctfnote.settings[setting] = v;
        });
    }
  }
};
</script>
