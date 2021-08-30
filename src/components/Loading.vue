<template>
  <v-container class="d-flex justify-space-around" fill-height>
    <div
      class="d-flex flex-column align-center"
      :style="componentWidth"
    >
      <v-progress-linear
        :width="width"
        color="primary"
        class="mb-6"
        :value="percentLoaded"
        :buffer-value="bufferAmount"
        stream
        rounded
      />
      <div>Fetching {{ loadingMessage }}...</div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    loadingMessage: {
      type: String,
      required: true,
    },
    loadedCount: {
      type: Number,
      required: true,
    },
    queryCount: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    width: 600,
  }),
  computed: {
    componentWidth() {
      return `width: ${this.width}px`;
    },
    percentLoaded() {
      return (this.loadedCount / this.queryCount) * 100;
    },
    bufferAmount() {
      return 1 - this.percentLoaded;
    },
    percentage() {
      return `${Math.round(this.percentLoaded)}%`;
    },
  },
};
</script>
