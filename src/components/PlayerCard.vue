<template>
  <v-card @click="loadPlayer" class="pa-4">
    <div class="d-flex">
      <v-img
        class="mr-4"
        max-height="24"
        max-width="24"
        :src="classIcon"
      />
      <div :style="playerClass">{{ player.name }}</div>
    </div>
  </v-card>
</template>

<script>
import { ClassColour } from '@/enums';

export default {
  name: 'PlayerCard',
  props: {
    player: {
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
    playerClass() {
      return `color: ${ClassColour[this.player.class.toUpperCase()]}`;
    },
    classIcon() {
      const playerSpec = this.player.spec
        ? this.player.spec
        : this.player.class === 'Warrior'
        ? 'Protection'
        : '';
      const playerClass = this.player.class || '';
      return `../images/icons/${playerClass}/${playerSpec}.png`.toLowerCase();
    },
  },
  methods: {
    loadPlayer() {
      this.$router.push(`${this.reportId}/player/${this.player.id}`);
    },
  },
};
</script>
