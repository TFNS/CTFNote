<template>
  <q-page>
    <q-card>
      <q-card-section class="q-pb-none q-pt-sm">
        <q-tabs dense active-color="secondary" indicator-color="secondary" align="left" narrow-indicator>
          <q-route-tab
            :to="tab.route"
            :label="tab.label"
            @click="(e, g) => navigate(e, g, idx)"
            :key="idx"
            v-for="(tab, idx) in tabs"
          />
        </q-tabs>
      </q-card-section>
      <q-separator />
      <q-card-section class="overflow-hidden">
        <transition
          :enter-active-class="slideIn"
          :leave-active-class="slideOut"
          @before-leave="floatElement"
          :duration="200"
        >
          <router-view :ctf="ctf" />
        </transition>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  props: {
    ctf: Object,
  },
  methods: {
    navigate(evt, go, idx) {
      if (idx < this.tabIndex) {
        this.slideIn = "animated slideInLeft";
        this.slideOut = "animated slideOutRight";
      } else {
        this.slideIn = "animated slideInRight";
        this.slideOut = "animated slideOutLeft";
      }
      this.tabIndex = idx;
    },
    floatElement(el) {
      const { width, heigt } = el.getBoundingClientRect();
      Object.assign(el.style, {
        width: `${width}px`,
        heigt: `${heigt}px`,
        position: "absolute",
        top: "16px",
        left: "16px",
      });
    },
  },
  computed: {
    taskStyle() {
      let backgroundImage = "none";
      if (this.$q.screen.gt.md) backgroundImage = `url(${this.ctf?.logoUrl})`;
      return { backgroundImage };
    },
  },
  data() {
    const tabs = [
      {
        label: "info",
        route: { name: "ctfinfo" },
      },
      {
        label: "tasks",
        route: { name: "ctftasks" },
      },
    ];
    if (this.$ctfnote.isMember) {
      tabs.push({
        label: "guests",
        route: { name: "ctfinvitations" },
      });
    }
    const tabIndex = tabs.findIndex((t) => t.route.name == this.$route.name);
    return {
      tabs,
      tabIndex,
      slideIn: "animated slideInLeft",
      slideOut: "animated slideOutRight",
    };
  },
};
</script>

<style lang="scss" scoped>
body.live-mode .blur {
  filter: blur(5px);
  transition: filter 0.2s;
  &:hover {
    filter: blur(0px);
    transition-delay: 0.2s;
  }
}
.float-away {
  position: absolute;
  width: 100vw;
  top: 16px;
}

.titlelink {
  color: inherit;
  text-decoration: none;
  position: relative;
  &:before {
    content: "";
    display: block;
    background: currentColor;
    position: absolute;
    transition: all 0.5s;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 2px;
  }

  &:hover:before {
    width: 100%;
  }
}
</style>