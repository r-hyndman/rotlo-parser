<template>
  <svg :width="width" :height="height">
    <line
      v-for="(tick, index) in ticks"
      :key="index"
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
  name: 'HorizontalBarHeader',
  props: {
    height: {
      type: Number,
      default: 18,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
  },
  computed: {
    width() {
      return this.max - this.min;
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
    adjustedTick(value) {
      const min = 1;
      const max = this.width - 1;
      return value < min ? min : value > max ? max : value;
    },
  },
};
</script>
