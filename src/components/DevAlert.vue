<template>
  <div class="d-flex justify-space-around">
    <v-alert type="error" dismissible width="600">
      This {{ type }} is still in development
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'DevAlert',
  props: {
    type: {
      type: String,
      default: 'view',
    },
  },
};
</script>
