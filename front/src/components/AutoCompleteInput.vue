<template>
  <q-input
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :shadow-text="inputShadowText"
    @keydown="processInputFill"
    @focus="processInputFill"
  />
</template>

<script>
import { event } from "quasar";

const { stopAndPrevent } = event;

export default {
  props: {
    choices: Array,
    value: String
  },
  data() {
    return {
      textareaModel: "",
      inputFillCancelled: false,
      textareaFillCancelled: false,
      matchOffset: 0
    };
  },

  computed: {
    inputShadowText() {
      const matches = this.choices.filter(c => c.startsWith(this.value));
      if (matches.length == 0) {
        return "";
      }
      const mod = (x, y) => ((x % y) + y) % y;
      const match = matches[mod(this.matchOffset, matches.length)];
      return match.slice(this.value.length);
    }
  },

  methods: {
    processInputFill(e) {
      if (e === void 0) {
        return;
      }
      if (e.keyCode === 38) {
        this.matchOffset += 1;
      }
      if (e.keyCode === 40) {
        this.matchOffset -= 1;
      }
      if (e.keyCode === 9) {
        if (this.inputShadowText.length > 0) {
          stopAndPrevent(e);
          this.$emit("input", (typeof this.value === "string" ? this.value : "") + this.inputShadowText);
        }
      }
    }
  }
};
</script>

<style></style>
