<template>
  <v-container v-if="isLoaded">
    <page-header :title="encounter.name" subtitle="" />
    <v-row v-for="(fight, index) in encounter.fights" :key="index">
      <v-col>
        <div class="my-4 text-h4">{{ fightTitle(fight, index) }}</div>
        <!-- <player-data
          v-for="(player, i) in playerData[index]"
          :key="i"
          :playerId="player.id"
          :data="player.data"
        /> -->
        <div class="text-h5">Active Time</div>
        <active-time
          class="d-flex flex-column"
          :active-times="activeTimes(fight.id)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import PageHeader from '@/components/PageHeader';
import ActiveTime from '@/components/ActiveTime';
import { objectHasProperty } from '@/utils/functions';

export default {
  name: 'Encounter',
  components: {
    PageHeader,
    ActiveTime,
  },
  data: () => ({
    reportId: undefined,
    encounterId: undefined,
    isLoaded: false,
    playerData: {},
    startTime: {},
    endTime: {},
  }),
  mounted() {
    this.reportId = this.$route.params.reportId;
    this.encounterId = this.$route.params.encounterId;

    for (let fight of this.encounter.fights) {
      this.startTime[fight.id] = Number.MAX_VALUE;
      this.endTime[fight.id] = Number.MIN_VALUE;
      this.playerData[fight.id] = {
        activeTimes: this.calculateActiveTime(fight.id),
      };
    }

    this.isLoaded = true;
  },
  computed: {
    ...mapGetters('report', ['report']),
    encounter() {
      return Object.values(this.report.encounters).find(
        (e) => e.id == this.encounterId
      );
    },
  },
  methods: {
    activeTimes(index) {
      return Object.values(this.playerData[index].activeTimes);
    },
    duration(fightId) {
      return this.endTime[fightId] - this.startTime[fightId];
    },
    fightDuration(fight) {
      let diff = fight.endTime - fight.startTime;
      return moment
        .utc(moment.duration(diff).asMilliseconds())
        .format('m:ss');
    },
    fightTitle(fight, index) {
      const outcome = fight.kill ? 'Kill' : `Wipe ${index + 1}`;
      const duration = this.fightDuration(fight);
      const percent = fight.kill ? '' : ` - ${fight.percentage}%`;

      return `${outcome} (${duration})${percent}`;
    },
    rawPlayerData(fightIndex) {
      return Object.entries(
        this.encounter.fights.find((f) => f.id === fightIndex).data
      ).map((entry) => {
        return {
          id: entry[0],
          data: entry[1],
        };
      });
    },
    calculateActiveTime(fightId) {
      const playerData = this.rawPlayerData(fightId);
      const activeTime = {};

      // Combat data associated with each playerId
      for (let playerCombatData of playerData) {
        activeTime[playerCombatData.id] = {
          entryData: [],
          player: {},
          startTime: undefined,
          endTime: undefined,
        };
        let newActiveTimeEntry = {};
        const playerReference =
          this.report.players[playerCombatData.id];

        // For each combat event in the data array
        for (let combatEvent of playerCombatData.data) {
          if (this.isCombatAbility(combatEvent.type)) {
            // Set the start time if not already set
            if (!combatEvent.tick) {
              this.trySetObjectProperty(
                newActiveTimeEntry,
                'start',
                combatEvent.timestamp
              );
            }

            if (
              activeTime[playerCombatData.id].entryData.length > 0
            ) {
              if (playerReference.name === 'Wetcheeks') {
                console.log(
                  playerReference.name,
                  'post-death',
                  combatEvent
                );
              }
            }

            // Ensure the start time the earliest timestamp
            this.startTime[fightId] = Math.min(
              this.startTime[fightId],
              combatEvent.timestamp
            );

            // Ensure the end time the latest timestamp
            this.endTime[fightId] = Math.max(
              this.endTime[fightId],
              combatEvent.timestamp
            );
          } else if (this.isDeathEvent(combatEvent.type)) {
            // Set the end time
            newActiveTimeEntry.end = combatEvent.timestamp;

            // Store this new entry in the array of entries
            activeTime[playerCombatData.id].entryData.push(
              newActiveTimeEntry
            );

            // Reset the entry for later events, eg. After a battle res, soulstone or ankh
            newActiveTimeEntry = {};
          } else {
            if (
              activeTime[playerCombatData.id].entryData.length > 0
            ) {
              if (playerReference.name === 'Wetcheeks') {
                console.log(
                  playerReference.name,
                  'post-death',
                  combatEvent
                );
              }
            }
          }
        }

        // Check if the new entry has no 'end' timestamp (player survived the fight)
        if (
          objectHasProperty(newActiveTimeEntry, 'start') &&
          !objectHasProperty(newActiveTimeEntry, 'end')
        ) {
          activeTime[playerCombatData.id].entryData.push(
            newActiveTimeEntry
          );
        }
      }

      for (let [key, value] of Object.entries(activeTime)) {
        const playerReference = this.report.players[key];
        const lastElement = this.getlastArrayElement(value.entryData);
        if (playerReference.name === 'Wetcheeks') {
          console.log(
            playerReference.name,
            lastElement,
            value.entryData
          );
        }

        // If this entry has no end time, set the end time to the end of the encounter
        // if (!lastElement.end) {
        //   lastElement.end = this.endTime[fightId];
        // }

        if (
          objectHasProperty(lastElement, 'start') &&
          !objectHasProperty(lastElement, 'end')
        ) {
          lastElement.end = this.endTime[fightId];
        }

        // Provide some player data for the visualisation
        value.player = {
          id: playerReference.id,
          name: playerReference.name,
          class: playerReference.class,
          spec: playerReference.spec,
        };

        activeTime[key].startTime = this.startTime[fightId];
        activeTime[key].endTime = this.endTime[fightId];

        // Set the start and end times of each entry to a 0..1 value of the encounter duration
        for (let activeTimeEntry of value.entryData) {
          activeTimeEntry.start = this.clamp01(
            (activeTimeEntry.start - this.startTime[fightId]) /
              this.duration(fightId)
          );

          activeTimeEntry.end = this.clamp01(
            (activeTimeEntry.end - this.startTime[fightId]) /
              this.duration(fightId)
          );
        }
      }

      return activeTime;
    },
    isCombatAbility(type) {
      return type === 'heal' || type === 'cast' || type === 'damage';
    },
    isDeathEvent(type) {
      return type === 'death';
    },
    getlastArrayElement(array) {
      return array[array.length - 1];
    },
    clamp01(value) {
      return value < 0 ? 0 : value > 1 ? 1 : value;
    },
    trySetObjectProperty(object, key, value) {
      if (!objectHasProperty(object, key)) {
        object[key] = value;
      }
    },
  },
};
</script>
