<template>
  <v-container
    v-if="!isAuthorised"
    class="d-flex justify-space-around"
    fill-height
  >
    <div
      class="
        d-flex
        h-100
        flex-column
        justify-space-around
        align-center
      "
    >
      <div>
        <div class="text-h2">{{ app.guild.long }}</div>
        <div class="text-h5">
          {{ app.name.long }} {{ app.version }}
        </div>
      </div>
      <div>
        <div class="mt-12 text-h5">
          Please
          <v-btn @click="doAuth">Authorise</v-btn>
          to continue
        </div>
      </div>
      <div class="text-overline">Loston@Remulos</div>
    </div>
  </v-container>
  <v-container v-else>
    <v-toolbar class="my-4">
      <v-col cols="4">
        <div class="d-flex">
          <div class="mr-4 d-flex flex-column justify-space-around">
            Enter a
          </div>
          <div class="mr-4 d-flex flex-column justify-space-around">
            <v-text-field
              class="mt-7"
              dense
              v-model="reportId"
              label="WarcraftLogs Report ID"
              outlined
              min-width="240"
            ></v-text-field>
          </div>
          <div class="mr-4 d-flex flex-column justify-space-around">
            to begin
          </div>
          <div class="mr-4 d-flex flex-column justify-space-around">
            <v-btn @click="loadReport(reportId)" color="primary"
              >Go</v-btn
            >
          </div>
        </div>
      </v-col>
      <v-col cols="8" class="d-flex justify-end">
        <v-btn
          v-for="(reportId, index) of preloadedIds"
          :key="index"
          color="primary"
          class="mr-2"
          @click="loadReport(reportId)"
        >
          <span>{{ reportId }}</span>
        </v-btn>
      </v-col>
    </v-toolbar>
    <v-row>
      <v-col cols="12">
        <reports />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Reports from '@/components/Reports';
import { authorise } from '@/plugins/auth';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    Reports,
  },
  data: () => ({
    reportId: undefined,
    authState: '',
    isAuthorised: false,
    preloadedIds: [
      'y7zHJgcB2bVnpYwv',
      'TaV38NXk4WzDhJFn',
      'QKMyRXtwL9CVq1p8',
      'D1Ffzqr6Hd8axW4w',
    ],
  }),
  mounted() {
    const authToken = window.sessionStorage.getItem('access_token');
    if (authToken !== undefined && authToken !== null) {
      this.setToken(authToken);
    }
  },
  watch: {
    token(value) {
      if (!this.isAuthorised) {
        this.isAuthorised = !!value;
      }
    },
  },
  computed: {
    ...mapGetters('app', ['app']),
    ...mapGetters('auth', ['token']),
  },
  methods: {
    ...mapActions({
      setToken: 'auth/setToken',
    }),
    loadReport(reportId) {
      if (reportId.length === 16) {
        this.$router.push({
          name: 'Loader',
          params: { reportId: reportId },
        });
      }
    },
    doAuth() {
      authorise();
    },
  },
};
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.w-100 {
  width: 100%;
}
</style>
