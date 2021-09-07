<template>
  <div class="pa-0 ma-0">
    <dev-alert type="view" />
    <div class="d-flex">
      <div>
        <div
          class="d-flex mb-2"
          v-for="(value, index) in activeTimes"
          :key="index"
        >
          <v-img
            class="mr-4"
            max-height="24"
            max-width="24"
            :src="playerIcon(value.player)"
          />
          <div class="name">{{ value.player.name }}</div>
        </div>
      </div>
      <div ref="container" style="width: 100%">
        <active-time-visualisation
          v-if="hasData"
          :width="visualisationWidth"
          :active-times="activeTimes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ActiveTimeVisualisation from '@/components/ActiveTimeVisualisation';
import DevAlert from '@/components/DevAlert';
import { mapGetters } from 'vuex';

export default {
  name: 'ActiveTimeView',
  props: {
    activeTimes: {
      type: Array,
      required: true,
    },
  },
  components: {
    ActiveTimeVisualisation,
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
    hasData() {
      return this.activeTimes.length > 0;
    },
  },
  methods: {
    onResize() {
      this.visualisationWidth = this.containerWidth - this.imageWidth;
    },
    playerIcon(player) {
      return require('../../public/images/icons/' +
        player.class.spec.icon);
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
