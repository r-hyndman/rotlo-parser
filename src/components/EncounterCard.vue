<template>
  <v-card @click="loadEncounter" class="pa-4">
    <div class="d-flex">
      <v-img
        class="mr-4"
        max-height="56"
        max-width="56"
        :src="bossIcon"
      />
      <div>
        <div class="text-h6">{{ encounter.name }}</div>
        <div>{{ fights }}</div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'EncounterCard',
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    reportId: undefined,
  }),
  mounted() {
    this.reportId = this.$route.params.reportId;
  },
  computed: {
    bossIcon() {
      const filename = this.encounter.name
        .replace(/ /g, '_')
        .replace(/'/g, '')
        .toLowerCase();
      return `../images/icons/bosses/${filename}.jpeg`;
    },
    fights() {
      const wipeCount = this.encounter.fights.filter(
        (fight) => fight.kill === false
      ).length;
      const kill = this.encounter.fights.some((fight) => fight.kill);

      const killOutput = kill
        ? wipeCount === 0
          ? '1 Kill'
          : '1 Kill, '
        : '';
      const wipeOutput =
        wipeCount > 1
          ? `${wipeCount} Wipes`
          : wipeCount > 0
          ? `${wipeCount} Wipe`
          : '';

      return `${killOutput}${wipeOutput}`;
    },
  },
  methods: {
    loadEncounter() {
      this.$router.push({
        name: 'Encounter',
        params: {
          reportId: this.reportId,
          encounterId: this.encounter.fights[0].id,
        },
      });
    },
  },
};
</script>
