<template>
  <div class="pa-0 ma-0">
    <dev-alert type="view" />
    <div class="d-flex">
      <div>
        <div
          class="d-flex mb-2"
          v-for="(value, index) in damageDone"
          :key="index"
        >
          <v-img
            class="mr-4"
            max-height="24"
            max-width="24"
            :src="value.player.class.spec.icon"
          />
          <div class="name">{{ value.player.name }}</div>
        </div>
      </div>
      <div ref="container" style="width: 100%">
        <damage-done-visualisation
          :width="visualisationWidth"
          :damage-done="damageDone"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DamageDoneVisualisation from '@/components/DamageDoneVisualisation';
import DevAlert from '@/components/DevAlert';
import { mapGetters } from 'vuex';

export default {
  name: 'DamageDoneView',
  props: {
    damageDone: {
      type: Array,
      required: true,
    },
  },
  components: {
    DamageDoneVisualisation,
    DevAlert,
  },
  data: () => ({
    imageWidth: 24,
    containerWidth: 0,
    visualisationWidth: 0,
    isLoaded: false,
    resizeObserver: null,
  }),
  mounted() {
    this.containerWidth = this.$refs.container.clientWidth;
    this.resizeObserver = new ResizeObserver(this.onResize).observe(
      this.$refs.container
    );
    this.isLoaded = true;
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$refs.container);
    }
  },
  computed: {
    ...mapGetters('report', ['report']),
  },
  methods: {
    onResize() {
      this.visualisationWidth = this.containerWidth - this.imageWidth;
    },
  },
};
</script>

<style scoped>
.name {
  width: 16ch;
  max-width: 16ch;
}
</style>
