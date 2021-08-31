<template>
  <v-row class="mt-8">
    <v-col class="d-flex">
      <div class="d-flex flex-column juatify-space-around">
        <v-btn fab x-large @click="navBack" class="mr-6">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </div>
      <div class="d-flex flex-column">
        <div class="text-h2">{{ title }}</div>
        <div class="text-overline">{{ subtitle }}</div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
  methods: {
    navBack() {
      this.$router.go(-1);
    },
  },
};
</script>
