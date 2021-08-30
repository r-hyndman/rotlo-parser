<template>
  <div class="d-flex flex-column">
    <div class="mt-4 text-h4">Stats</div>
    <div class="d-flex">
      <div class="mr-8">
        <div
          class="d-flex justify-space-between"
          v-for="(stat, index) in primaryStats"
          :key="index"
        >
          <div class="mr-4">{{ stat.name }}</div>
          <div>{{ stat.value }}</div>
        </div>
      </div>
      <div>
        <div
          class="d-flex justify-space-between"
          v-for="(stat, index) in secondaryStats"
          :key="index"
        >
          <div class="mr-4">{{ stat.name }}</div>
          <div>{{ stat.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerStats',
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
  computed: {
    primaryStats() {
      return Object.entries(this.stats.primary).map((entry) => {
        return {
          name: entry[0].charAt(0).toUpperCase() + entry[0].slice(1),
          value: entry[1],
        };
      });
    },
    secondaryStats() {
      return Object.entries(this.stats.secondary).map((entry) => {
        return {
          name: entry[0].charAt(0).toUpperCase() + entry[0].slice(1),
          value: entry[1],
        };
      });
    },
  },
};
</script>
