<template>
  <v-app>
    <v-app-bar app color="primary">
      <div class="d-flex link" @click="navHome">
        <v-avatar class="mr-4">
          <img
            src="../public/images/rotlo.png"
            :alt="guildName.full"
          />
        </v-avatar>
        <div class="text-h5 d-flex flex-column justify-space-around">
          {{ guildName.short }} Parser {{ version }}
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
export default {
  name: 'App',
  data: () => ({
    guildName: {
      full: 'Raiders of the Lost Orc',
      short: 'RotLO',
    },
    version: 'v0.2',
  }),
  methods: {
    navHome() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.link {
  cursor: pointer;
}
</style>
