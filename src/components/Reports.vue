<template>
  <div v-if="hasReports">
    <v-row>
      <v-col>
        <div class="mt-4 text-h4">Reports</div>
        <div class="grid-wrapper">
          <report-card
            v-for="(report, index) in reports"
            :key="index"
            :report="report"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReportCard from '@/components/ReportCard';

export default {
  name: 'Reports',
  components: {
    ReportCard,
  },
  computed: {
    ...mapGetters('report', ['reports']),
    hasReports() {
      return this.reports !== {};
    },
  },
};
</script>

<style scoped>
.grid-wrapper {
  width: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, auto);
  grid-auto-flow: row;
}
</style>
