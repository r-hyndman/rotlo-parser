<template>
  <v-container v-if="isLoaded">
    <page-header
      :title="encounter.name"
      :subtitle="report.raid.name"
    />
    <v-toolbar class="my-4">
      <!-- Select Fight -->
      <v-col cols="3">
        <v-select
          v-model="selectedFight"
          class="mt-7 mr-4"
          dense
          :items="fightNames"
          label="Fight"
        />
      </v-col>
      <v-spacer></v-spacer>
      <!-- Select View -->
      <v-col cols="2">
        <v-select
          v-model="selectedView"
          class="mt-7 mr-4"
          dense
          :items="viewOptions"
          item-text="text"
          item-value="component"
          label="View"
          return-object
        />
      </v-col>
      <!-- Select Role Filter -->
      <v-col cols="2">
        <v-select
          v-model="selectedRoleFilter"
          class="mt-7 mr-4"
          dense
          :items="refinedRoleFilters"
          label="Role"
        />
      </v-col>
      <!-- Select Class Filter -->
      <v-col cols="2">
        <v-select
          v-model="selectedClassFilter"
          class="mt-7 mr-4"
          dense
          :items="refinedClassFilters"
          label="Class"
        />
      </v-col>
      <!-- Select Sort Option -->
      <v-col cols="2">
        <v-select
          v-model="selectedSortOption"
          class="mt-7 mr-4"
          dense
          :items="viewSortOptions"
          item-text="text"
          item-value="function"
          label="Sort"
          return-object
        />
      </v-col>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              class="ma-0 pa-0"
              @click="toggleSortDirection"
            >
              <v-icon v-bind="attrs" v-on="on" :class="sortDirection">
                filter_list
              </v-icon>
            </v-btn>
          </template>
          <span>Reverse Sort</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              class="ma-0 pa-0"
              @click="resetSortAndFilters"
            >
              <v-icon v-bind="attrs" v-on="on">restart_alt</v-icon>
            </v-btn>
          </template>
          <span>Reset Filters</span>
        </v-tooltip>
      </div>
    </v-toolbar>
    <v-row>
      <v-col>
        <component
          :is="selectedView.component"
          v-bind="selectedViewProps"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import PageHeader from '@/components/PageHeader';
import ActiveTimeView from '@/components/ActiveTimeView';
// import DpsView from '@/components/DpsView';
import DamageDoneView from '@/components/DamageDoneView';
import { clamp01, objectHasKey, tryAddObjectProperty } from '@/utils';
import { Class, Role } from '@/enums';

export default {
  name: 'Encounter',
  components: {
    PageHeader,
    ActiveTimeView,
    // DpsView,
    DamageDoneView,
  },
  data: () => ({
    reportId: undefined,
    encounterId: undefined,
    isLoaded: false,
    playerData: {},
    startTime: {},
    endTime: {},
    selectedFight: undefined,
    selectedView: undefined,
    selectedClassFilter: undefined,
    selectedRoleFilter: undefined,
    selectedSortOption: undefined,
    sortReverse: false,
  }),
  mounted() {
    this.reportId = this.$route.params.reportId;
    this.encounterId = this.$route.params.encounterId;

    for (let fight of this.encounter.fights) {
      this.startTime[fight.id] = Number.MAX_VALUE;
      this.endTime[fight.id] = Number.MIN_VALUE;

      this.playerData[fight.id] = {
        activeTimes: this.calculateActiveTime(fight.id),
        // dps: [], //this.calculateDps(fight.id),
        damageDone: this.calculateDamageDone(fight.id),
      };
    }

    this.selectedFight = this.fightTitle(this.encounter.fights[0], 0);
    this.selectedView = this.viewOptions[0];
    this.resetSortAndFilters();

    this.isLoaded = true;
  },
  watch: {
    selectedView() {
      this.tryResetSort();
    },
  },
  computed: {
    ...mapGetters('report', ['report']),
    encounter() {
      return Object.values(this.report.raid.encounters).find(
        (e) => e.id == this.encounterId
      );
    },
    viewOptions() {
      return [
        {
          text: 'Active Time',
          component: 'active-time-view',
          props: {
            activeTimes: this.activeTimes(this.selectedFightId),
          },
        },
        {
          text: 'Damage Done',
          component: 'damage-done-view',
          props: {
            damageDone: this.damageDone(this.selectedFightId),
          },
        },
      ];
    },
    defaultClassFilters() {
      return ['Any', Object.values(Class)];
    },
    refinedClassFilters() {
      let playersWithRoleMatchingFilter = this.playersInEncounter;
      if (this.selectedRoleFilter !== 'Any') {
        playersWithRoleMatchingFilter =
          playersWithRoleMatchingFilter.filter(
            (player) => player.role === this.selectedRoleFilter
          );
      }

      return [
        'Any',
        ...playersWithRoleMatchingFilter
          .map((player) => player.class.name)
          .sort(),
      ];
    },
    classesInEncounter() {
      return this.playersInEncounter.map(
        (player) => player.class.name
      );
    },
    playerIdsInEncounter() {
      return Object.keys(this.encounter.fights[0].data);
    },
    playersInEncounter() {
      return Object.values(this.report.raid.roster).filter((player) =>
        this.playerIdsInEncounter.includes(`${player.id}`)
      );
    },
    specsInEncounter() {
      return this.playersInEncounter.map(
        (player) => player.class.spec.name
      );
    },
    defaultRoleFilters() {
      return ['Any', ...Object.values(Role)];
    },
    refinedRoleFilters() {
      let playersWithClassMatchingFilter = this.playersInEncounter;
      if (this.selectedClassFilter !== 'Any') {
        playersWithClassMatchingFilter =
          playersWithClassMatchingFilter.filter(
            (player) => player.class.name === this.selectedClassFilter
          );
      }

      return [
        'Any',
        ...playersWithClassMatchingFilter
          .map((player) => player.role)
          .sort(),
      ];
    },
    sortOptions() {
      return {
        default: [
          // Sort by name
          {
            text: 'Name',
            function: (a, b) => {
              return a.player.name < b.player.name
                ? -1
                : a.player.name > b.player.name
                ? 1
                : 0;
            },
          },
          // Sort by class
          {
            text: 'Class',
            function: (a, b) => {
              return a.player.class.name < b.player.class.name
                ? -1
                : a.player.class.name > b.player.class.name
                ? 1
                : 0;
            },
          },
          // Sort by role
          {
            text: 'Role',
            function: (a, b) => {
              return a.player.role < b.player.role
                ? -1
                : a.player.role > b.player.role
                ? 1
                : 0;
            },
          },
        ],
        'active-time-view': [
          // Sort by start time
          {
            text: 'Start Time',
            function: (a, b) => {
              return a.entryData[0].start < b.entryData[0].start
                ? -1
                : a.entryData[0].start > b.entryData[0].start
                ? 1
                : 0;
            },
          },
          // Sort by end time
          {
            text: 'End Time',
            function: (a, b) => {
              const lastIndexA = a.entryData.length - 1;
              const lastIndexB = b.entryData.length - 1;
              return a.entryData[lastIndexA].end <
                b.entryData[lastIndexB].end
                ? -1
                : a.entryData[lastIndexA].end >
                  b.entryData[lastIndexB].end
                ? 1
                : 0;
            },
          },
        ],
        'damage-done-view': [
          {
            // Sort by value
            text: 'Damage Done',
            function: (a, b) => {
              return a.value < b.value
                ? 1
                : a.value > b.value
                ? -1
                : 0;
            },
          },
        ],
      };
    },
    viewSortOptions() {
      return [
        ...this.sortOptions[this.selectedView.component],
        ...this.sortOptions.default,
      ];
    },
    fightNames() {
      let index = 0;
      return this.encounter.fights.map((fight) => {
        return this.fightTitle(fight, index++);
      });
    },
    selectedFightId() {
      let index = 0;
      for (let fight of this.encounter.fights) {
        if (this.fightTitle(fight, index++) === this.selectedFight) {
          return fight.id;
        }
      }
      return this.encounter.fights[0].id;
    },
    sortDirection() {
      return {
        't-flipped-y': this.sortReverse,
      };
    },
    selectedViewProps() {
      return this.viewOptions.find((option) => {
        return option.component === this.selectedView.component;
      }).props;
    },
  },
  methods: {
    applySortAndFilters(array) {
      if (!this.selectedSortOption) {
        return array;
      }

      array.sort((a, b) => this.selectedSortOption.function(a, b));

      if (this.sortReverse) {
        array = array.reverse();
      }

      if (this.selectedRoleFilter !== 'Any') {
        array = array.filter(
          (entry) => entry.player.role === this.selectedRoleFilter
        );
      }

      if (this.selectedClassFilter !== 'Any') {
        array = array.filter(
          (entry) =>
            entry.player.class.name === this.selectedClassFilter
        );
      }

      return array;
    },
    activeTimes(fightIndex) {
      if (
        this.selectedView &&
        this.selectedView.component &&
        this.selectedView.component === 'active-time-view'
      ) {
        return this.applySortAndFilters(
          Object.values(this.playerData[fightIndex].activeTimes)
        );
      } else {
        Object.values(this.playerData[fightIndex].activeTimes);
      }
    },
    damageDone(fightIndex) {
      if (
        this.selectedView &&
        this.selectedView.component &&
        this.selectedView.component === 'damage-done-view'
      ) {
        return this.applySortAndFilters(
          Object.values(this.playerData[fightIndex].damageDone)
        );
      } else {
        Object.values(this.playerData[fightIndex].damageDone);
      }
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

        // For each combat event in the data array
        for (let combatEvent of playerCombatData.data) {
          if (this.isCombatAbility(combatEvent.type)) {
            // Set the start time if not already set
            if (!combatEvent.tick) {
              tryAddObjectProperty(
                newActiveTimeEntry,
                'start',
                combatEvent.timestamp
              );
            }

            // Ensure the start time is the earliest timestamp
            this.startTime[fightId] = Math.min(
              this.startTime[fightId],
              combatEvent.timestamp
            );

            // Ensure the end time is the latest timestamp
            this.endTime[fightId] = Math.max(
              this.endTime[fightId],
              combatEvent.timestamp
            );
          } else if (this.isDeathEvent(combatEvent.type)) {
            // Set the end time
            newActiveTimeEntry.end = combatEvent.timestamp;

            // Store this new entry in the array of entries
            activeTime[playerCombatData.id].entryData.push({
              ...newActiveTimeEntry,
            });

            // Reset the entry for later events, eg. After a battle res, soulstone or ankh
            newActiveTimeEntry = {};
          }
        }

        // Check if the new entry has no 'end' timestamp (player survived the fight)
        if (
          objectHasKey(newActiveTimeEntry, 'start') &&
          !objectHasKey(newActiveTimeEntry, 'end')
        ) {
          activeTime[playerCombatData.id].entryData.push(
            newActiveTimeEntry
          );
        }
      }

      const playerIdsToRemove = [];
      for (let [key, value] of Object.entries(activeTime)) {
        if (value.entryData && value.entryData.length === 0) {
          playerIdsToRemove.push(key);
          continue;
        }

        if (!objectHasKey(this.report.raid.roster, key)) {
          playerIdsToRemove.push(key);
          continue;
        }

        const playerReference = this.report.raid.roster[key];
        const lastElement = this.getlastArrayElement(value.entryData);

        // If this entry has no end time, set the end time to the end of the encounter
        if (
          objectHasKey(lastElement, 'start') &&
          !objectHasKey(lastElement, 'end')
        ) {
          lastElement.end = this.endTime[fightId];
        }

        // Provide some player data for the visualisation
        value.player = {
          id: playerReference.id,
          name: playerReference.name,
          class: playerReference.class,
          role: playerReference.role,
        };

        activeTime[key].startTime = this.startTime[fightId];
        activeTime[key].endTime = this.endTime[fightId];

        // Set the start and end times of each entry to a 0..1 value of the encounter duration
        for (let activeTimeEntry of value.entryData) {
          activeTimeEntry.start = clamp01(
            (activeTimeEntry.start - this.startTime[fightId]) /
              this.duration(fightId)
          );

          activeTimeEntry.end = clamp01(
            (activeTimeEntry.end - this.startTime[fightId]) /
              this.duration(fightId)
          );
        }
      }

      for (let id of playerIdsToRemove) {
        delete activeTime[id];
      }

      return activeTime;
    },
    calculateDamageDone(fightId) {
      const playerData = this.rawPlayerData(fightId);
      const damageDone = {};

      // Combat data associated with each playerId
      for (let playerCombatData of playerData) {
        damageDone[playerCombatData.id] = {
          value: 0,
          player: {},
        };

        // For each combat event in the data array
        for (let combatEvent of playerCombatData.data) {
          if (
            combatEvent.type === 'damage' &&
            combatEvent.sourceID == playerCombatData.id
          ) {
            damageDone[playerCombatData.id].value +=
              combatEvent.amount;
          }
        }
      }

      const playerIdsToRemove = [];
      for (let [key, value] of Object.entries(damageDone)) {
        if (value.entryData && value.entryData.length === 0) {
          continue;
        }

        if (!objectHasKey(this.report.raid.roster, key)) {
          continue;
        }
        const playerReference = this.report.raid.roster[key];

        // Provide some player data for the visualisation
        value.player = {
          id: playerReference.id,
          name: playerReference.name,
          class: playerReference.class,
          role: playerReference.role,
        };
      }

      for (let id of playerIdsToRemove) {
        delete damageDone[id];
      }

      return damageDone;
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
    toggleSortDirection() {
      this.sortReverse = !this.sortReverse;
    },
    resetSortAndFilters() {
      this.selectedSortOption =
        this.sortOptions[this.selectedView.component][0];
      this.selectedRoleFilter = this.defaultRoleFilters[0];
      this.selectedClassFilter = this.defaultClassFilters[0];
      this.selectedRoleFilter = this.refinedRoleFilters[0];
      this.selectedClassFilter = this.refinedClassFilters[0];
    },
    tryResetSort() {
      if (
        !this.sortOptions.default.some(
          (option) => option.text === this.selectedSortOption.text
        )
      ) {
        this.selectedSortOption = this.viewSortOptions[0];
      }
    },
  },
};
</script>

<style scoped>
.t-flipped-y {
  transform: scaleY(-1);
}
</style>
