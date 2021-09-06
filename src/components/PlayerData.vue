<template>
  <div class="d-flex justify-space-between" v-if="isLoaded">
    <div>{{ playerName }}</div>
    <div>damage: {{ damageDone }}</div>
    <div>duration: {{ duration }}</div>
    <div>dps: {{ dps }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlayerData',
  props: {
    playerId: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    isLoaded: false,
    damageDone: 0,
    startTime: undefined,
    endTime: undefined,
    duration: undefined,
    dps: 0,
  }),
  mounted() {
    this.reportId = this.$route.params.reportId;
    this.isLoaded = true;
    this.calculateDps();
  },
  computed: {
    ...mapGetters('report', ['report']),
    playerName() {
      return this.report.players[this.playerId].name;
    },
  },
  methods: {
    calculateDps() {
      for (let entry of this.data) {
        if (entry.type === 'damage') {
          if (!this.startTime) {
            this.startTime = entry.timestamp;
          }
          this.damageDone += entry.amount;
          this.endTime = entry.timestamp;
        } else if (entry.type === 'heal' || entry.type === 'cast') {
          if (!this.startTime) {
            this.startTime = entry.timestamp;
          }
        } else if (entry.type === 'death') {
          if (!this.startTime) {
            this.startTime = entry.timestamp;
          }
          this.endTime = entry.timestamp;
          break;
        }
      }
      this.duration = this.endTime - this.startTime;
      this.dps = (this.damageDone / this.duration) * 1000;
    },
  },
};
</script>
