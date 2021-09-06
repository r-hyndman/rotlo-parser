<template>
  <div>
    <svg :width="width" :height="height">
      <g v-for="(damage, index) in damageDone" :key="`g_${index}`">
        <rect
          x="0"
          :y="barYPos(index)"
          width="100%"
          :height="rowHeight"
          :style="background"
        />
        <rect
          x="0"
          :y="barYPos(index)"
          :width="damageWidth(damage.value)"
          :height="rowHeight"
          :style="barStyle(damage.player)"
        />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'DamageDoneVisualisation',
  props: {
    width: {
      type: Number,
      required: true,
    },
    damageDone: {
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
    maxDamage() {
      let max = 0;
      for (let damage of this.damageDone) {
        max = Math.max(max, damage.value);
      }
      return max;
    },
    height() {
      return (
        this.damageDone.length * (this.rowHeight + this.rowPadding) -
        this.rowPadding
      );
    },
    background() {
      return `fill: ${this.backgroundColour}`;
    },
  },
  methods: {
    barYPos(index) {
      return index * (this.rowHeight + this.rowPadding);
    },
    damageWidth(damage) {
      if (damage > 0) {
        return (damage / this.maxDamage) * this.width;
      }
      return 0;
    },
    barStyle(player) {
      return `fill: ${player.class.colour}`;
    },
  },
};
</script>
