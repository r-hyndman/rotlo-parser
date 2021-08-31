<template>
  <div class="pa-0 ma-0">
    <div class="d-flex justify-space-around">
      <v-alert type="error" dismissible width="600">
        This view is still in development
      </v-alert>
    </div>
    <!-- <active-time-header
      :start-time="activeTimes[0].startTime"
      :end-time="activeTimes[0].endTime"
      :max="visualisationWidth"
    /> -->
    <div class="d-flex">
      <div class="left">
        <div
          class="d-flex mb-2"
          v-for="(activeEntry, index) in activeTimes"
          :key="index"
        >
          <v-img
            class="mr-4"
            max-height="24"
            max-width="24"
            :src="classIcon(activeEntry.player)"
          />
          <div class="name">{{ activeEntry.player.name }}</div>
        </div>
      </div>
      <div class="middle">
        <svg
          :width="visualisationWidth"
          :height="visualisationHeight"
        >
          <g
            v-for="(activeEntry, index) in activeTimes"
            :key="`g_${index}`"
          >
            <rect
              x="0"
              :y="barYPos(index)"
              width="100%"
              :height="rowHeight"
              :style="background"
            />
            <rect
              v-for="(entry, i) in activeEntry.entryData"
              :key="i"
              :x="entryXPos(entry)"
              :y="barYPos(index)"
              :width="entryWidth(entry)"
              :height="rowHeight"
              :style="barStyle(activeEntry.player)"
            />
          </g>
          <line
            v-for="(tick, index) in ticks"
            :key="`line_${index}`"
            :x1="adjustedTick(tick)"
            y1="0"
            :x2="adjustedTick(tick)"
            :y2="visualisationHeight"
            style="stroke: #ffffff; stroke-width: 1"
          />
        </svg>
      </div>
      <div class="right"></div>
    </div>
    <!-- <hr />
    <div
      class="d-flex flex-row mb-2"
      v-for="(activeEntry, index) in activeTimes"
      :key="index"
    >
      <v-img
        class="mr-4"
        max-height="24"
        max-width="24"
        :src="classIcon(activeEntry.player)"
      />
      <div class="name">{{ activeEntry.player.name }}</div>
      <div class="d-flex flex-column justify-space-around">
        <horizontal-bar
          :entry-data="activeEntry.entryData"
          :height="rowHeight"
          :max="visualisationWidth"
          :colour="classColour(activeEntry.player)"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
// import ActiveTimeHeader from '@/components/ActiveTimeHeader';
// import ActiveTimeEntry from '@/components/ActiveTimeEntry';
// import HorizontalBar from '@/components/HorizontalBar';
import { ClassColour } from '@/enums';

export default {
  name: 'ActiveTimeVisualisation',
  props: {
    activeTimes: {
      type: Array,
      required: true,
    },
  },
  components: {
    // ActiveTimeHeader,
    // ActiveTimeEntry,
    // HorizontalBar,
  },
  data: () => ({
    visualisationWidth: 1200,
    rowHeight: 18,
    rowPadding: 14,
    backgroundColour: '#272727',
  }),
  computed: {
    visualisationHeight() {
      return (
        this.activeTimes.length * (this.rowHeight + this.rowPadding) -
        this.rowPadding
      );
    },
    startTime() {
      return this.activeTimes[0].startTime;
    },
    endTime() {
      return this.activeTimes[0].endTime;
    },
    background() {
      return `fill: ${this.backgroundColour}`;
    },
    ticks() {
      const array = [];
      let end = this.endTime - this.startTime;
      let tick = 0;
      while (tick < end) {
        array.push((tick / end) * this.visualisationWidth);
        tick += 60000;
      }
      array.push(this.visualisationWidth);
      return array;
    },
  },
  methods: {
    barYPos(index) {
      return index * (this.rowHeight + this.rowPadding);
    },
    entryXPos(entry) {
      return entry.start * this.visualisationWidth;
    },
    entryWidth(entry) {
      return (entry.end - entry.start) * this.visualisationWidth;
    },
    barStyle(player) {
      return `fill: ${this.classColour(player)}`;
    },
    classColour(player) {
      return ClassColour[player.class.toUpperCase()];
    },
    classIcon(player) {
      const playerSpec = player.spec
        ? player.spec
        : player.class === 'Warrior'
        ? 'Protection'
        : '';
      const playerClass = player.class || '';
      const filename = `${playerClass}/${playerSpec}`.toLowerCase();
      return `../../../images/icons/${filename}.png`;
    },
    adjustedTick(value) {
      const min = 1;
      const max = this.visualisationWidth - 1;
      return value < min ? min : value > max ? max : value;
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
