<template>
  <svg :width="width" :height="height">
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
      :y2="height"
      style="stroke: #ffffff; stroke-width: 1"
    />
  </svg>
</template>

<script>
export default {
  name: 'ActiveTimeVisualisation',
  props: {
    width: {
      type: Number,
      required: true,
    },
    activeTimes: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    rowHeight: 18,
    rowPadding: 14,
    backgroundColour: '#272727',
  }),
  computed: {
    height() {
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
        array.push((tick / end) * this.width);
        tick += 60000;
      }
      array.push(this.width);
      return array;
    },
  },
  methods: {
    barYPos(index) {
      return index * (this.rowHeight + this.rowPadding);
    },
    entryXPos(entry) {
      return entry.start * this.width;
    },
    entryWidth(entry) {
      return (entry.end - entry.start) * this.width;
    },
    barStyle(player) {
      return `fill: ${player.class.colour}`;
    },
    adjustedTick(value) {
      const min = 1;
      const max = this.width - 1;
      return value < min ? min : value > max ? max : value;
    },
  },
};
</script>
