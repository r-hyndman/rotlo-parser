<template>
  <v-row>
    <v-col>
      <div class="my-4 text-h4">Roster</div>
      <div>
        <div class="my-4 text-h5">Tanks ({{ tanks.length }})</div>
        <v-row>
          <v-col
            xl="2"
            lg="2"
            md="3"
            sm="4"
            cols="12"
            v-for="(player, index) in tanks"
            :key="index"
          >
            <player-card :player="player" />
          </v-col>
        </v-row>
        <div class="my-4 text-h5">DPS ({{ dps.length }})</div>
        <v-row>
          <v-col
            xl="2"
            lg="2"
            md="3"
            sm="4"
            cols="12"
            v-for="(player, index) in dps"
            :key="index"
          >
            <player-card :player="player" />
          </v-col>
        </v-row>
        <div class="my-4 text-h5">Healers ({{ healers.length }})</div>
        <v-row>
          <v-col
            xl="2"
            lg="2"
            md="3"
            sm="4"
            cols="12"
            v-for="(player, index) in healers"
            :key="index"
          >
            <player-card :player="player" />
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import PlayerCard from './PlayerCard';

export default {
  name: 'Roster',
  components: {
    PlayerCard,
  },
  props: {
    tanks: {
      type: Array,
      required: true,
    },
    dps: {
      type: Array,
      required: true,
    },
    healers: {
      type: Array,
      required: true,
    },
  },
};
</script>
