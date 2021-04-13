<template>
  <div>
    <q-input v-model="model" clearable label="Logo link">
      <template v-slot:after>
        <q-btn round color="primary" icon="backup" @click="openPicker" />
      </template>
    </q-input>
    <q-file class="hidden" ref="picker" clearable @clear="clear" @input="upload" accept=".jpg, image/*" />
  </div>
</template>

<script>
export default {
  props: {
    value: String,
  },
  data() {
    return { model: this.value };
  },
  methods: {
    clear() {
      this.model = "";
    },
    openPicker() {
      this.$refs.picker.$el.click();
    },
    upload(file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.model = reader.result;
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    },
  },
  watch: {
    model(v) {
      this.$emit("input", v);
    },
  },
};
</script>