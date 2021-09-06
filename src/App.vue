<template>
  <v-app>
    <v-app-bar v-if="isAuthorised" app color="primary">
      <div class="d-flex link" @click="navHome">
        <v-avatar class="mr-4">
          <img
            src="../public/images/rotlo.png"
            :alt="app.guild.long"
          />
        </v-avatar>
        <div class="text-h5 d-flex flex-column justify-space-around">
          {{ app.guild.short }} {{ app.name.short }} {{ app.version }}
        </div>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters('app', ['app']),
    ...mapGetters('auth', ['token']),
    isAuthorised() {
      const authToken = window.sessionStorage.getItem('access_token');
      return (
        this.token !== undefined ||
        (authToken !== undefined && authToken !== null)
      );
    },
  },
  methods: {
    navHome() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
.link {
  cursor: pointer;
}
</style>
