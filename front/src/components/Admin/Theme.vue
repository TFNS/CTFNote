<template>
  <div class="row q-gutter-md">
    <div class="col">
      <q-card>
        <q-card-section class="text-h6"> Colors </q-card-section>

        <q-card-section class="row q-pt-none q-gutter-md">
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
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
          <q-btn label="reset" color="warning" flat @click="reset" />
          <q-btn
            label="save"
            :disable="!needSave"
            color="positive"
            @click="saveStyle"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import ctfnote from 'src/ctfnote';
import {
  defaultColorsNames,
  SettingsColor,
  SettingsColorMap,
} from 'src/ctfnote/models';
import { defineComponent, reactive, watch } from 'vue';
import ColorPicker from '../Utils/ColorPicker.vue';

type ColorPairs = [SettingsColor, string][];

export default defineComponent({
  components: { ColorPicker },
  setup() {
    const settings = ctfnote.settings.injectSettings();
    const colors = reactive(Object.assign({}, ctfnote.settings.defaultColors));

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
      resolveAndNotify: ctfnote.ui.useNotify().resolveAndNotify,
      updateSettings: ctfnote.settings.useUpdateSettings(),
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
      for (const [name, value] of Object.entries(
        ctfnote.settings.defaultColors
      ) as ColorPairs) {
        this.colors[name] = value;
      }
    },
    saveStyle() {
      void this.resolveAndNotify(
        this.updateSettings({
          style: JSON.stringify(this.colors),
        }),
        { message: 'Theme changed!', icon: 'palette' }
      );
    },
  },
});
</script>

<style scoped></style>
