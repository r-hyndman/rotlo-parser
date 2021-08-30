<template>
  <div class="d-flex flex-row mb-2">
    <v-img
      class="mr-4"
      max-height="24"
      max-width="24"
      :src="classIcon"
    />
    <div class="name">{{ player.name }}</div>
    <div class="d-flex flex-column justify-space-around">
      <horizontal-bar
        :entry-data="entryData"
        :height="height"
        :max="max"
        :colour="classColour"
      />
    </div>
  </div>
</template>

<script>
import HorizontalBar from '@/components/HorizontalBar';
import { ClassColour } from '@/enums';

export default {
  name: 'ActiveTimeEntry',
  components: {
    HorizontalBar,
  },
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
    player: {
      type: Object,
      required: true,
    },
  },
  computed: {
    classColour() {
      return ClassColour[this.player.class.toUpperCase()];
    },
    classIcon() {
      const playerSpec = this.player.spec
        ? this.player.spec
        : this.player.class === 'Warrior'
        ? 'Protection'
        : '';
      const playerClass = this.player.class || '';
      const filename = `${playerClass}/${playerSpec}`;
      return `../../../images/icons/${filename}.png`;
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
