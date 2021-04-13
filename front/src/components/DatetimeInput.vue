<template>
  <q-input filled :value="model" :label="label">
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="model" :mask="mask">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time v-model="model" :mask="mask" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { getDateTime } from "src/utils";
import { date } from "quasar";
export default {
  props: {
    value: String,
    label: String,
  },
  data() {
    const mask = "YYYY/MM/DD HH:mm";
    const d = date.extractDate(this.value, "YYYY-MM-DDTHH:mm:ssZ");
    return { model: getDateTime(d), mask };
  },
  watch: {
    model(v) {
      const d = date.extractDate(v, this.mask);
      this.$emit("input", date.formatDate(d, "YYYY-MM-DDTHH:mm:ssZ"));
    },
  },
};
</script>