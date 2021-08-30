<template>
  <v-container v-if="isLoaded">
    <!-- <v-btn class="floating" @click="navigateBack">Back</v-btn> -->
    <page-header :title="player.name" :subtitle="playerDetails" />
    <v-row>
      <v-col cols="8">
        <div class="mt-4 text-h4">Gear</div>
        <div
          v-for="(gear, index) in player.gear"
          :key="index"
          class="mb-2"
        >
          <div class="d-flex" v-if="gear.id > 0">
            <v-img
              class="mr-4"
              max-width="32"
              :src="itemUrl(gear.icon)"
            />
            <div
              class="d-flex flex-column justify-space-around"
              :style="itemQuality(gear.quality)"
            >
              {{ itemName(gear.id) }}
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <player-stats :stats="stats" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ItemQuality } from '@/enums';
import { mapState } from 'vuex';
import { statPriority } from '@/modules';
import PageHeader from '@/components/PageHeader';
import PlayerStats from '@/components/PlayerStats';

export default {
  name: 'Player',
  components: {
    PageHeader,
    PlayerStats,
  },
  data: () => ({
    reportId: undefined,
    playerId: undefined,
    isLoaded: false,
  }),
  mounted() {
    this.reportId = this.$route.params.reportId;
    this.playerId = this.$route.params.playerId;
    this.isLoaded = true;
  },
  computed: {
    ...mapState('report', ['reports']),
    player() {
      return this.reports[this.reportId].players[this.playerId];
    },
    playerDetails() {
      return `${this.player.spec ? this.player.spec : 'Protection'} ${
        this.player.class
      } [${this.player.talents}]`;
    },
    stats() {
      const classIndex = this.player.class.toLowerCase();
      const specIndex = this.player.spec
        ? this.player.spec.toLowerCase()
        : 'protection';
      const dpsStatPriority = statPriority.dps[classIndex][specIndex];
      const statType =
        this.player.role === 'tank'
          ? 'defense'
          : this.player.role === 'healer'
          ? 'spell'
          : dpsStatPriority;
      return {
        primary: this.player.stats.base,
        secondary: this.player.stats[statType],
      };
    },
  },
  methods: {
    itemName(id) {
      return `itemId: ${id}`;
    },
    itemUrl(icon) {
      return `https://assets.rpglogs.com/img/warcraft/abilities/${icon}`;
    },
    itemQuality(quality) {
      return `color: ${ItemQuality[quality].colour}`;
    },
    navigateBack() {
      this.$router.go(-1);
    },
  },
};
</script>
