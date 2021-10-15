<template>
  <router-link :to="route" :class="cls" class="link">
    <slot>{{ label }}</slot>
  </router-link>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import { defineComponent } from 'vue';
import { Ctf, Task } from 'src/ctfnote';
import slugify from 'slugify';

export default defineComponent({
  props: {
    name: { type: String, required: true },
    label: { type: String as () => string | null, default: null },
    ctf: { type: Object as () => Ctf | null, default: null },
    task: { type: Object as () => Task | null, default: null },
    glow: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },
  },
  setup() {
    return {};
  },
  computed: {
    route(): RouteLocationRaw {
      const params: Record<string, string> = {};
      if (this.ctf) {
        params['ctfId'] = this.ctf.id.toString();
        params['ctfSlug'] = slugify(this.ctf.title);
      }
      if (this.task) {
        params['taskId'] = this.task.id.toString();
        params['taskSlug'] = slugify(this.task.title);
      }
      return { name: this.name, params };
    },
    cls() {
      const cls = [];
      if (this.glow) {
        cls.push('glow');
      }
      if (this.underline) {
        cls.push('underline');
      }
      return cls;
    },
  },
});
</script>

<style lang="scss" scoped>
.link {
  color: inherit;
  text-decoration: none;
  &.glow {
    transition: text-shadow 0.1s;
    &:hover {
      text-shadow: 0px 0px 3px rgba(255, 255, 255, 0.5);
    }
  }
  &.underline {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
