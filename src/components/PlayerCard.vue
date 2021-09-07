<template>
  <v-card @click="loadPlayer" class="pa-4">
    <div class="d-flex">
      <v-img
        class="mr-4"
        max-height="24"
        max-width="24"
        :src="playerIcon"
      />
      <div :style="playerClass">{{ player.name }}</div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'PlayerCard',
  props: {
    player: {
      type: Object,
      required: true,
    },
  },
  computed: {
    playerClass() {
      return `color: ${this.player.class.colour}`;
    },
    playerIcon() {
      return `../images/icons/${this.player.class.spec.icon}`;
    },
  },
  methods: {
    loadPlayer() {
      this.$router.push({
        name: 'Player',
        params: {
          reportId: this.$route.params.reportId,
          playerId: this.player.id,
        },
      });
    },
  },
};
</script>
