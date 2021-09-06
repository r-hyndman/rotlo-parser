<template>
  <v-container v-if="isLoaded">
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
import { mapGetters } from 'vuex';
import PageHeader from '@/components/PageHeader';
import PlayerStats from '@/components/PlayerStats';
import { Role } from '@/enums';

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
    this.playerId = this.$route.params.playerId;
    this.isLoaded = true;
  },
  computed: {
    ...mapGetters('report', ['report']),
    player() {
      return this.report.raid.roster[this.playerId];
    },
    playerDetails() {
      return `${this.player.class.spec.name} ${this.player.class.name} [${this.player.talents}]`;
    },
    stats() {
      let role =
        this.player.role === Role.TANK
          ? 'defense'
          : this.player.role === Role.HEALER
          ? 'spell'
          : this.player.role;

      return {
        primary: this.player.stats.base,
        secondary: this.player.stats[role.toLowerCase()],
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
  },
};
</script>
