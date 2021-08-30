<template>
  <loading
    v-if="isLoading"
    :loading-message="loadingMessage"
    :loadedCount="queryIndex"
    :queryCount="queryCount"
  />
  <v-container v-else>
    <page-header
      :title="report.raid.name"
      :subtitle="report.raid.date"
    />
    <roster
      :tanks="sortedTanks"
      :dps="sortedDps"
      :healers="sortedHealers"
    />
    <encounters :encounters="encounters" />
  </v-container>
</template>

<script>
import { sendQuery } from '@/modules';
import moment from 'moment';
import Roster from '@/components/Roster';
import Encounters from '@/components/Encounters';
import Loading from '@/components/Loading';
import { mapActions, mapGetters } from 'vuex';
import PageHeader from '@/components/PageHeader';
import { objectHasProperty } from '@/utils/functions';

export default {
  name: 'Home',
  components: {
    Roster,
    Encounters,
    Loading,
    PageHeader,
  },
  data: () => ({
    isLoading: true,
    loadingMessage: '',
    queryIndex: 0,
    playerIndex: 0,
    additionalQueries: [],
    playerQueries: [],
    fetchedReport: {},
    estimations: {
      numPlayers: 10,
      numFights: 5,
    },
  }),
  mounted() {
    if (this.reportExists(this.$route.params.reportId)) {
      this.setReport(this.$route.params.reportId);
      this.isLoading = false;
    } else {
      this.fetchReport();
    }
  },
  watch: {
    queryIndex(index) {
      if (this.isLoading) {
        if (index < this.queries.length) {
          this.fetchReport(index);
        } else {
          this.addReport(this.fetchedReport);
          this.fetchedReport = {};
          this.isLoading = false;
        }
      }
    },
  },
  computed: {
    ...mapGetters('report', ['report', 'reports']),
    ...mapGetters('auth', ['token']),
    queryCount() {
      const estimated =
        this.mainQueries.length +
        this.estimations.numPlayers *
          (this.estimations.numFights + 1) +
        1;
      return Math.max(estimated, this.queries.length);
    },
    mainQueries() {
      return [
        {
          name: 'raid information',
          callback: this.saveRaidInfo,
          query: `
          {
            reportData {
              report(code: "${this.$route.params.reportId}") {
                startTime
                endTime
                fights(killType: Encounters) {
                  gameZone {
                    name
                  }
                }
              }
            }
          }`,
        },
        {
          name: 'fights',
          callback: this.saveFights,
          query: `
          {
            reportData {
              report(code: "${this.$route.params.reportId}") {
                fights(killType: Encounters) {
                  id
                  name
                  startTime
                  endTime
                  kill
                  fightPercentage
                  friendlyPlayers
                }
              }
            }
          }`,
        },
        {
          name: 'abilities',
          callback: this.saveAbilities,
          query: `
          {
            reportData {
              report(code: "${this.$route.params.reportId}") {
                masterData(translate: false) {
                  abilities {
                    gameID
                    icon
                    name
                    type
                  }
                }
              }
            }
          }`,
        },
        {
          name: 'players',
          callback: this.saveActors,
          query: `
          {
            reportData {
              report(code: "${this.$route.params.reportId}") {
                masterData(translate: false) {
                  actors(type: "Player") {
                    id
                    icon
                    name
                  }
                }
              }
            }
          }`,
        },
      ];
    },
    queries() {
      return [
        ...this.mainQueries,
        ...this.additionalQueries,
        ...this.playerQueries,
      ];
    },
    encounters() {
      return Object.values(this.report.encounters);
    },
    sortedTanks() {
      return Object.values(this.report.players)
        .filter((player) => player.role === 'tank')
        .sort((a, b) => {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
    },
    sortedDps() {
      return Object.values(this.report.players)
        .filter((player) => player.role === 'dps')
        .sort((a, b) => {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
    },
    sortedHealers() {
      return Object.values(this.report.players)
        .filter((player) => player.role === 'healer')
        .sort((a, b) => {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
    },
  },
  methods: {
    ...mapActions({
      addReport: 'report/addReport',
      setReport: 'report/setReport',
    }),
    reportExists(reportId) {
      return objectHasProperty(this.reports, reportId);
    },
    bossImage(bossName) {
      const filename = bossName.replace(' ', '_').toLowerCase();
      return `./images/icons/bosses/${filename}.jpeg`;
    },
    fetchReport(index = 0) {
      const query = this.queries[index].query;
      const callback = this.queries[index].callback;
      const args = this.queries[index].args || {};
      this.loadingMessage = this.queries[index].name;
      this.fetchedReport.id = this.$route.params.reportId;
      sendQuery(query, callback, args);
    },
    saveRaidInfo(response) {
      const raidInfo = response.data.data.reportData.report;

      const raidDate = moment(raidInfo.startTime).format(
        'ddd MMM do YYYY'
      );
      let raids = [];
      for (let fight of raidInfo.fights) {
        if (raids.indexOf(fight.gameZone.name) === -1) {
          raids.push(fight.gameZone.name);
        }
      }

      this.estimations.numFights = raidInfo.fights.length;

      this.fetchedReport.raid = {
        date: raidDate,
        name: raids.join(', '),
        roster: [],
      };

      this.queryIndex++;
    },
    saveFights(response) {
      const fights = response.data.data.reportData.report.fights;

      this.fetchedReport.encounters = {};
      let bossIndex = 0;
      let fightId = 0;
      const bossIndices = {};

      for (let fight of fights) {
        this.estimations.numPlayers = fight.friendlyPlayers.length;

        if (!objectHasProperty(bossIndices, fight.name)) {
          bossIndices[fight.name] = bossIndex;
          this.fetchedReport.encounters[bossIndex++] = {
            id: fight.id,
            name: fight.name,
            fights: [],
          };
          fightId = 0;
        } else {
          fightId++;
        }

        this.fetchedReport.encounters[
          bossIndices[fight.name]
        ].fights.push({
          id: fight.id,
          startTime: fight.startTime,
          endTime: fight.endTime,
          percentage: fight.fightPercentage,
          kill: fight.kill,
        });

        for (let playerId of fight.friendlyPlayers) {
          if (
            this.fetchedReport.raid.roster.every(
              (p) => p.id !== playerId
            )
          ) {
            this.fetchedReport.raid.roster.push({
              id: playerId,
              name: '',
            });
          }

          this.additionalQueries.push({
            name: `fight data for ${fight.name}`,
            callback: this.saveFightData,
            args: { bossId: bossIndex, fightId: fightId },
            query: `
            {
              reportData {
                report(code: "${this.$route.params.reportId}") {
                  events(startTime: ${fight.startTime}, endTime: ${fight.endTime}, sourceID: ${playerId}) {
                    data
                  }
                }
              }
            }`,
          });
        }
      }
      this.queryIndex++;
    },
    saveAbilities(response) {
      this.fetchedReport.abilities =
        response.data.data.reportData.report.masterData.abilities;
      this.queryIndex++;
    },
    saveActors(response) {
      const players =
        response.data.data.reportData.report.masterData.actors;
      const encounters = Object.values(this.fetchedReport.encounters);
      const lastEncounter = encounters[encounters.length - 1];
      const lastFight =
        lastEncounter.fights[lastEncounter.fights.length - 1];
      const startTime = lastFight.startTime;
      const endTime = lastFight.endTime;

      this.additionalQueries.push({
        name: `player roles`,
        callback: this.savePlayerRoles,
        query: `
        {
          reportData {
            report(code: "${this.$route.params.reportId}") {
              table(startTime: ${startTime}, endTime: ${endTime})
            }
          }
        }`,
      });

      this.fetchedReport.players = {};
      for (let player of players) {
        if (
          this.fetchedReport.raid.roster.some(
            (p) => p.id === player.id
          )
        ) {
          this.fetchedReport.players[player.id] = {
            name: player.name,
            class: player.icon.split('-')[0],
            spec: player.icon.split('-')[1],
            id: player.id,
          };

          let playerInRoster = this.fetchedReport.raid.roster.find(
            (player) => player.id === player.id
          );
          playerInRoster.name = player.name;

          this.playerQueries.push({
            name: `player data for ${player.name}`,
            callback: this.savePlayerData,
            query: `
            {
              reportData {
                report(code: "${this.$route.params.reportId}") {
                  events(startTime: ${startTime}, endTime: ${endTime}, sourceID: ${player.id}, dataType: CombatantInfo) {
                    data
                  }
                }
              }
            }`,
          });
        }
      }
      this.queryIndex++;
    },
    savePlayerRoles(response) {
      const data = response.data.data.reportData.report.table.data;

      const dps = data.playerDetails.dps;
      for (let player of dps) {
        let rosteredPlayer = this.fetchedReport.raid.roster.find(
          (p) => p.id === player.id
        );
        let playerData = this.fetchedReport.players[player.id];
        playerData.role = 'dps';
        rosteredPlayer.name = player.name;
      }

      const healers = data.playerDetails.healers;
      for (let player of healers) {
        let rosteredPlayer = this.fetchedReport.raid.roster.find(
          (p) => p.id === player.id
        );
        let playerData = this.fetchedReport.players[player.id];
        playerData.role = 'healer';
        rosteredPlayer.name = player.name;
      }

      const tanks = data.playerDetails.tanks;
      for (let player of tanks) {
        let rosteredPlayer = this.fetchedReport.raid.roster.find(
          (p) => p.id === player.id
        );
        let playerData = this.fetchedReport.players[player.id];
        playerData.role = 'tank';
        rosteredPlayer.name = player.name;
      }

      this.queryIndex++;
    },
    savePlayerData(response) {
      const data =
        response.data.data.reportData.report.events.data[0];

      this.fetchedReport.players[data.sourceID].gear = data.gear;
      this.fetchedReport.players[data.sourceID].stats = {
        base: {
          strength: data.strength,
          agility: data.agility,
          stamina: data.stamina,
          intellect: data.intellect,
          spirit: data.spirit,
        },
        defense: {
          dodge: data.dodge,
          parry: data.parry,
          block: data.block,
          armor: data.armor,
        },
        melee: {
          crit: data.critMelee,
          hit: data.hitMelee,
          expertise: data.expertise,
        },
        ranged: {
          crit: data.critRanged,
          hit: data.hitRanged,
        },
        spell: {
          crit: data.critSpell,
          hit: data.hitSpell,
        },
      };
      this.fetchedReport.players[data.sourceID].talents = [
        data.talents[0].id,
        data.talents[1].id,
        data.talents[2].id,
      ];
      this.queryIndex++;
      this.playerIndex++;
    },
    saveFightData(response, args) {
      const data = response.data.data.reportData.report.events.data;
      const bossId = args.bossId;
      const fightId = args.fightId;
      const playerId = data[0].sourceID;
      const encounter = this.fetchedReport.encounters[bossId - 1];
      const fight = encounter.fights[fightId];
      if (!objectHasProperty(fight, 'data')) {
        fight.data = {};
      }
      fight.data[playerId] = data.slice(1);

      this.queryIndex++;
    },
  },
};
</script>
