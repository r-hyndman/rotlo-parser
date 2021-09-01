<template>
  <v-row>
    <v-col>
      <div class="my-4 text-h4">Encounters</div>
      <v-row>
        <v-col
          xl="4"
          lg="4"
          md="6"
          sm="6"
          cols="12"
          v-for="(encounter, index) in uniqueEncounters"
          :key="index"
        >
          <encounter-card :encounter="encounter" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import EncounterCard from './EncounterCard';

export default {
  name: 'Encounter',
  components: {
    EncounterCard,
  },
  props: {
    encounters: {
      type: Array,
      required: true,
    },
  },
  computed: {
    uniqueEncounters() {
      return Object.values(this.encounters);
    },
  },
};
</script>
