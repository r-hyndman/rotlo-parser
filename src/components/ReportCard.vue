<template>
  <v-card @click="loadReport" class="pa-4">
    <div class="d-flex">
      <div>
        <div class="text-h6">{{ report.raid.name }}</div>
        <div>{{ report.id }}</div>
        <div>{{ report.raid.date }}</div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ReportCard',
  props: {
    report: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions({
      setReport: 'report/setReport',
    }),
    loadReport() {
      this.setReport(this.report.id);
      this.$router.push({
        name: 'Report',
        params: { reportId: this.report.id },
      });
    },
  },
};
</script>
