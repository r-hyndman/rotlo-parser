<template>
  <v-container>
    <page-header
      :title="report.raid.name"
      :subtitle="report.raid.date"
    />
    <roster :tanks="tanks" :dps="dps" :healers="healers" />
    <encounters :encounters="encounters" />
  </v-container>
</template>

<script>
import Roster from '@/components/Roster';
import Encounters from '@/components/Encounters';
import PageHeader from '@/components/PageHeader';
import { Role } from '@/enums';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    Roster,
    Encounters,
    PageHeader,
  },
  computed: {
    ...mapGetters('report', ['report', 'reports']),
    encounters() {
      return Object.values(this.report.raid.encounters);
    },
    tanks() {
      return Object.values(this.report.raid.roster).filter(
        (player) => player.role === Role.TANK
      );
    },
    dps() {
      return Object.values(this.report.raid.roster).filter(
        (player) =>
          player.role === Role.MELEE ||
          player.role === Role.RANGED ||
          player.role === Role.SPELL
      );
    },
    healers() {
      return Object.values(this.report.raid.roster).filter(
        (player) => player.role === Role.HEALER
      );
    },
  },
  methods: {
    bossImage(bossName) {
      const filename = bossName.replace(' ', '_').toLowerCase();
      return `./images/icons/bosses/${filename}.jpeg`;
    },
  },
};
</script>
