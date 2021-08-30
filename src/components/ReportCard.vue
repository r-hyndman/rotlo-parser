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
export default {
  name: 'ReportCard',
  props: {
    report: {
      type: Object,
      required: true,
    },
  },
  methods: {
    loadReport() {
      this.$router.push(`report/${this.report.id}`);
    },
  },
};
</script>
