<template>
  <v-row class="mt-8">
    <v-col>
      <div class="text-h2">{{ title }}</div>
      <div class="text-overline">{{ subtitle }}</div>
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
};
</script>
