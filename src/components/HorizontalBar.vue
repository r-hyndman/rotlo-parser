<template>
  <svg :width="width" :height="height">
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :style="background"
    />
    <rect
      v-for="(entry, index) in entryData"
      :key="index"
      :x="entry.start * max"
      y="0"
      :width="(entry.end - entry.start) * width"
      :height="height"
      :style="style"
    />
  </svg>
</template>

<script>
export default {
  name: 'HorizontalBar',
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
    entryData: {
      type: Array,
      required: true,
    },
    colour: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    backgroundColour: '#123456',
  }),
  computed: {
    width() {
      return this.max - this.min;
    },
    background() {
      return `fill: ${this.backgroundColour}`;
    },
    style() {
      return `fill: ${this.colour}`;
    },
  },
};
</script>
