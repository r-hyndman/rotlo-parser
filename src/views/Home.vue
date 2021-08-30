<template>
  <v-container>
    <v-row v-if="!isAuthorised">
      <v-col>
        <v-btn @click="doAuth"> Authorise </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="4">
        <v-text-field
          v-model="reportId"
          label="WarcraftLogs Report ID"
          outlined
        ></v-text-field>
        <v-btn @click="loadReport(reportId)">Go</v-btn>
      </v-col>
      <v-col cols="8">
        <v-btn class="mr-2" @click="loadReport('TaV38NXk4WzDhJFn')">
          <span>TaV38NXk4WzDhJFn</span>
        </v-btn>
        <v-btn class="mr-2" @click="loadReport('QKMyRXtwL9CVq1p8')">
          <span>QKMyRXtwL9CVq1p8</span>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <reports />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Reports from '@/components/Reports';
import { authorise } from '@/plugins/auth';

export default {
  name: 'Home',
  components: {
    Reports,
  },
  data: () => ({
    reportId: undefined,
    authState: '',
    isAuthorised: false,
  }),
  mounted() {
    const authToken = window.sessionStorage.getItem('access_token');
    if (authToken !== undefined && authToken !== null) {
      console.log('authToken', authToken);
      this.isAuthorised = true;
    }
  },
  methods: {
    loadReport(reportId) {
      if (reportId.length === 16) {
        this.$router.push(`report/${reportId}`);
      }
    },
    doAuth() {
      authorise();
    },
  },
};
</script>
