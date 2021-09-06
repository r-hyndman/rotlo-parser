<template>
  <loading
    :primary-loading-message="primaryLoadingMessage"
    :primary-count="queryCount"
    :primary-total="primaryTotal"
    :secondary-loading-message="secondaryLoadingMessage"
    :secondary-count="secondaryCount[secondaryQueriesKeys[0]]"
    :secondary-total="secondaryTotal[secondaryQueriesKeys[0]]"
  />
</template>

<script>
import moment from 'moment';
import Loading from '@/components/Loading';
import { ClassColour, Role } from '@/enums';
import {
  Class,
  Encounter,
  Fight,
  Player,
  Query,
  Raid,
} from '@/models';
import { sendQuery } from '@/modules';
import {
  determinePlayerRole,
  getClassFromString,
  getSpecFromString,
  objectHasKey,
  tryAddObjectProperty,
} from '@/utils/functions';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Loader',
  components: {
    Loading,
  },
  data: () => ({
    report: {},
    primaryLoadingMessage: '',
    primaryQueries: [],
    primaryIndex: 0,
    secondaryLoadingMessage: '',
    secondaryQueries: {},
    secondaryQueriesKeys: [],
    secondaryCount: {},
    secondaryTotal: {},
    totalQueries: 0,
    queryCount: 0,
    estimations: {
      numPlayers: 10,
      numFights: 5,
    },
  }),
  mounted() {
    const reportId = this.$route.params.reportId;

    if (this.reportExists(reportId)) {
      this.setReport(reportId);
      this.openReport();
    }

    this.report.id = reportId;
    this.primaryQueries = this.defaultQueries;
    this.totalQueries = this.primaryQueries.length;

    this.sendNextQuery();
  },
  computed: {
    ...mapGetters('report', ['reports']),
    ...mapGetters('auth', ['token']),
    primaryTotal() {
      const estimated =
        this.primaryQueries.length +
        this.estimations.numPlayers *
          (this.estimations.numFights + 1) +
        1;
      return Math.max(estimated, this.totalQueries);
    },
    defaultQueries() {
      return [
        new Query({
          name: 'raid information',
          callback: this.saveRaidInfo,
          query: `
          {
            reportData {
              report(code: "${this.report.id}") {
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
        }),
        new Query({
          name: 'encounters',
          callback: this.saveEncounters,
          query: `
          {
            reportData {
              report(code: "${this.report.id}") {
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
        }),
        new Query({
          name: 'abilities',
          callback: this.saveAbilities,
          query: `
          {
            reportData {
              report(code: "${this.report.id}") {
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
        }),
        new Query({
          name: 'players',
          callback: this.savePlayers,
          query: `
          {
            reportData {
              report(code: "${this.report.id}") {
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
        }),
      ];
    },
  },
  methods: {
    ...mapActions({
      addReport: 'report/addReport',
      setReport: 'report/setReport',
    }),
    reportExists(reportId) {
      return objectHasKey(this.reports, reportId);
    },
    openReport() {
      this.$router.push({
        name: 'Report',
        params: {
          reportId: this.report.id,
        },
      });
    },
    sendNextQuery() {
      if (this.secondaryQueriesKeys.length > 0) {
        const queryKey = this.secondaryQueriesKeys[0];

        // if this is not the first query
        if (this.secondaryCount[queryKey] > 0) {
          this.queryCount++;
          this.secondaryQueries[queryKey].shift();
        }

        if (this.secondaryQueries[queryKey].length > 0) {
          this.secondaryLoadingMessage =
            this.secondaryQueries[queryKey][0].name;
          this.secondaryCount[queryKey]++;
          sendQuery(this.secondaryQueries[queryKey][0], this.token);
        } else {
          this.secondaryCount[queryKey] = 0;
          this.secondaryTotal[queryKey] = 0;
          this.secondaryQueriesKeys.shift();
          this.sendNextQuery();
        }
      } else {
        if (this.primaryIndex > 0) {
          this.queryCount++;
          this.primaryQueries.shift();
        }
        if (this.primaryQueries.length === 0) {
          this.addReport(this.report);
          this.openReport();
        } else {
          this.primaryLoadingMessage = this.primaryQueries[0].name;
          if (this.primaryIndex < this.primaryTotal) {
            this.primaryIndex++;
            sendQuery(this.primaryQueries[0], this.token);
          }
        }
      }
    },
    saveRaidInfo(response) {
      // Retrieve the raid info from the API response
      const raidInfo = response.data.data.reportData.report;

      // Make sure the raid date is in a readable format
      const raidDate = moment(raidInfo.startTime).format(
        'ddd MMM do YYYY'
      );

      // Check to see if this report includes more than one raid
      // eg. Gruul's Lair and Magtheridon's Lair
      const raidNames = [];
      for (let fight of raidInfo.fights) {
        if (raidNames.indexOf(fight.gameZone.name) === -1) {
          raidNames.push(fight.gameZone.name);
        }
      }

      this.estimations.numFights = raidInfo.fights.length;

      const raidName = raidNames.join(', ');

      // Save the raid
      this.report.raid = new Raid({
        name: raidName,
        date: raidDate,
        roster: {},
        encounters: {},
      });

      // Perform the next query
      this.sendNextQuery();
    },
    saveEncounters(response) {
      // Retrieve the encounter data from the API response
      const fights = response.data.data.reportData.report.fights;

      let encounterIndex = 0; // The current encounter index
      let fightId = 0; // The current fight index

      const encounterIndices = {}; // All the unique encounter indices

      for (let fight of fights) {
        this.estimations.numPlayers = fight.friendlyPlayers.length;

        if (
          tryAddObjectProperty(
            encounterIndices,
            fight.name,
            encounterIndex
          )
        ) {
          // This is the first attempt on a new encounter
          this.report.raid.encounters[encounterIndex++] =
            new Encounter({
              id: fight.id,
              name: fight.name,
              fights: [],
            });

          // Reset the fight index to 0
          fightId = 0;
        } else {
          // This is another attempt on the same encounter
          fightId++;
        }

        // Add a new fight to the encounter
        const encounterId = encounterIndices[fight.name];
        this.report.raid.encounters[encounterId].fights.push(
          new Fight({
            id: fight.id,
            startTime: fight.startTime,
            endTime: fight.endTime,
            percentage: fight.fightPercentage,
            kill: fight.kill,
            data: {},
          })
        );

        const playerIndices = {};
        const fightIndex =
          this.report.raid.encounters[encounterId].fights.length;

        // Find all the players involved with the encounter
        for (let playerId of fight.friendlyPlayers) {
          if (
            tryAddObjectProperty(playerIndices, playerId, playerId)
          ) {
            // Add a new player
            this.report.raid.roster[playerId] = new Player({
              id: playerId,
              name: '',
              class: {},
              role: '',
              gear: {},
              stats: {},
              talents: [],
            });

            // Add a query to fetch player data for this encounter
            const extraAttempts =
              fightIndex > 1 ? ` (${fightIndex})` : '';
            this.addSecondaryQuery(
              `${fight.name}_${fightIndex}`,
              new Query({
                name: `fight data for ${fight.name}${extraAttempts}`,
                callback: this.saveFightData,
                args: {
                  encounterId: encounterId,
                  fightId: fightId,
                },
                query: `
                {
                  reportData {
                    report(code: "${this.report.id}") {
                      events(startTime: ${fight.startTime}, endTime: ${fight.endTime}, sourceID: ${playerId}) {
                        data
                      }
                    }
                  }
                }`,
              })
            );
            this.totalQueries++;
          }
        }
      }

      // Perform the next query
      this.sendNextQuery();
    },
    saveAbilities(response) {
      this.report.abilities =
        response.data.data.reportData.report.masterData.abilities;

      // Perform the next query
      this.sendNextQuery();
    },
    savePlayers(response) {
      const players =
        response.data.data.reportData.report.masterData.actors;

      const encounters = Object.values(this.report.raid.encounters);
      const lastEncounter = encounters[encounters.length - 1];
      const lastFight =
        lastEncounter.fights[lastEncounter.fights.length - 1];
      const startTime = lastFight.startTime;
      const endTime = lastFight.endTime;

      this.primaryQueries.push(
        new Query({
          name: `player roles`,
          callback: this.savePlayerRoles,
          query: `
          {
            reportData {
              report(code: "${this.report.id}") {
                table(startTime: ${startTime}, endTime: ${endTime})
              }
            }
          }`,
        })
      );
      this.totalQueries++;

      for (let player of players) {
        if (objectHasKey(this.report.raid.roster, player.id)) {
          let [playerClass, playerSpec] = player.icon.split('-');
          this.report.raid.roster[player.id].name = player.name;
          this.report.raid.roster[player.id].class = new Class({
            name: getClassFromString(playerClass),
            spec: getSpecFromString(playerClass, playerSpec),
            colour: ClassColour[playerClass.toUpperCase()],
          });

          this.addSecondaryQuery(
            'players',
            new Query({
              name: `player data for ${player.name}`,
              callback: this.savePlayerData,
              query: `
              {
                reportData {
                  report(code: "${this.report.id}") {
                    events(startTime: ${startTime}, endTime: ${endTime}, sourceID: ${player.id}, dataType: CombatantInfo) {
                      data
                    }
                  }
                }
              }`,
            })
          );
          this.totalQueries++;
        }
      }

      // Perform the next query
      this.sendNextQuery();
    },
    savePlayerRoles(response) {
      const playerData =
        response.data.data.reportData.report.table.data;

      const dps = playerData.playerDetails.dps;
      const healers = playerData.playerDetails.healers;
      const tanks = playerData.playerDetails.tanks;

      for (let player of dps) {
        this.report.raid.roster[player.id].role =
          determinePlayerRole(player);
      }

      for (let player of healers) {
        this.report.raid.roster[player.id].role = Role.HEALER;
      }

      for (let player of tanks) {
        this.report.raid.roster[player.id].role = Role.TANK;
      }

      // Perform the next query
      this.sendNextQuery();
    },
    savePlayerData(response) {
      const events = response.data.data.reportData.report.events;
      if (!events.data.length > 0) {
        this.sendNextQuery();
      }
      const playerData = events.data[0];

      if (
        !objectHasKey(this.report.raid.roster, playerData.sourceID)
      ) {
        return;
      }

      const player = this.report.raid.roster[playerData.sourceID];
      player.gear = playerData.gear;
      player.stats = {
        base: {
          strength: playerData.strength,
          agility: playerData.agility,
          stamina: playerData.stamina,
          intellect: playerData.intellect,
          spirit: playerData.spirit,
        },
        defense: {
          dodge: playerData.dodge,
          parry: playerData.parry,
          block: playerData.block,
          armor: playerData.armor,
        },
        melee: {
          crit: playerData.critMelee,
          hit: playerData.hitMelee,
          expertise: playerData.expertise,
        },
        ranged: {
          crit: playerData.critRanged,
          hit: playerData.hitRanged,
        },
        spell: {
          crit: playerData.critSpell,
          hit: playerData.hitSpell,
        },
      };
      player.talents = [
        playerData.talents[0].id,
        playerData.talents[1].id,
        playerData.talents[2].id,
      ];

      // Perform the next query
      this.sendNextQuery();
    },
    saveFightData(response, args) {
      const fightData =
        response.data.data.reportData.report.events.data;

      const encounterId = args.encounterId;
      const fightId = args.fightId;
      const playerId = fightData[0].sourceID;
      const encounter = this.report.raid.encounters[encounterId];
      const fight = encounter.fights[fightId];

      fight.data[playerId] = fightData.slice(1);

      // Perform the next query
      this.sendNextQuery();
    },
    addSecondaryQuery(id, query) {
      if (tryAddObjectProperty(this.secondaryQueries, id, [])) {
        tryAddObjectProperty(this.secondaryCount, id, 0);
        tryAddObjectProperty(this.secondaryTotal, id, 0);
        this.secondaryQueriesKeys.push(id);
      }
      this.secondaryQueries[id].push(query);
      this.secondaryTotal[id]++;
    },
  },
};
</script>
