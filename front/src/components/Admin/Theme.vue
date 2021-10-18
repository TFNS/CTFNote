<template>
  <div v-if="!loading" class="row q-gutter-md">
    <div class="col">
      <q-card bordered>
        <q-card-section class="text-h6"> Colors </q-card-section>
        <q-card-section>
          <div class="row q-gutter-md">
            <div
              v-for="(color, label) in colors"
              :key="label"
              class="col col-auto"
            >
              <color-picker
                :model-value="color"
                :label="label"
                @update:model-value="(c) => updateStyle(label, c)"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="reset" color="warning" flat @click="reset" />
          <q-btn
            label="save"
            :disable="!needSave"
            :color="needSave ? 'positive' : 'grey-5'"
            @click="saveStyle"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <q-inner-loading :showing="loading">
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
</template>

<script lang="ts">
import {
  defaultColorsNames,
  SettingsColor,
  SettingsColorMap,
} from 'src/ctfnote';
import {
  defaultColors,
  getSettings,
  updateSettings,
} from 'src/ctfnote/settings';
import { defineComponent, reactive, watch } from 'vue';
import ColorPicker from '../Utils/ColorPicker.vue';

type ColorPairs = [SettingsColor, string][];

export default defineComponent({
  components: { ColorPicker },
  setup() {
    const { result: settings } = getSettings();
    const colors = reactive(Object.assign({}, defaultColors));

    watch(
      () => settings.value.style,
      (s) => {
        for (const name of defaultColorsNames) {
          colors[name] = s[name];
        }
      },
      { immediate: true }
    );

    watch(
      colors,
      (colors) => {
        const root = document.documentElement;
        for (const [name, value] of Object.entries(colors)) {
          root.style.setProperty(`--q-${name}`, value);
        }
      },
      { immediate: true }
    );

    return {
      loading: false,
      settings,
      colors,
    };
  },
  computed: {
    style(): SettingsColorMap {
      return this.settings.style;
    },
    needSave(): boolean {
      for (const [name, value] of Object.entries(this.colors) as ColorPairs) {
        if (this.settings.style[name] !== value) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    updateStyle(name: string, color: string) {
      this.settings.registrationAllowed;
      this.colors[name as SettingsColor] = color;
    },
    reset() {
      for (const [name, value] of Object.entries(defaultColors) as ColorPairs) {
        this.colors[name] = value;
      }
    },
    saveStyle() {
      void updateSettings({
        style: JSON.stringify(this.colors),
      });
    },
  },
});
</script>

<style scoped></style>
