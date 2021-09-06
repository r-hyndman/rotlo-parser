<template>
  <v-container class="d-flex justify-space-around" fill-height>
    <div
      class="d-flex flex-column align-center"
      :style="componentWidth"
    >
      <v-progress-linear
        :width="width"
        color="primary"
        class="mb-2"
        :value="primaryPercentLoaded"
        :buffer-value="primaryBufferAmount"
        stream
        rounded
      />
      <v-progress-linear
        :width="width"
        color="green"
        class="mb-2"
        :value="secondaryPercentLoaded"
        :buffer-value="secondaryBufferAmount"
        stream
        rounded
      />
      <div>
        {{ finalLoadingMessage }}
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    primaryLoadingMessage: {
      type: String,
      required: true,
    },
    primaryCount: {
      type: Number,
      required: true,
    },
    primaryTotal: {
      type: Number,
      required: true,
    },
    secondaryLoadingMessage: {
      type: String,
      default: '',
    },
    secondaryCount: {
      type: Number,
      default: 0,
    },
    secondaryTotal: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    width: 600,
  }),
  computed: {
    componentWidth() {
      return `width: ${this.width}px`;
    },
    primaryPercentLoaded() {
      return (this.primaryCount / this.primaryTotal) * 100;
    },
    primaryBufferAmount() {
      return 1 - this.primaryPercentLoaded;
    },
    primaryPercentage() {
      return `${Math.round(this.primaryPercentLoaded)}%`;
    },
    secondaryPercentLoaded() {
      return this.secondaryCount > 0
        ? (this.secondaryCount / this.secondaryTotal) * 100
        : 0;
    },
    secondaryBufferAmount() {
      return 1 - this.secondaryPercentLoaded ?? 0;
    },
    secondaryPercentage() {
      return `${Math.round(this.secondaryPercentLoaded)}%`;
    },
    finalLoadingMessage() {
      return this.secondaryLoadingMessage === ''
        ? `Fetching ${this.primaryLoadingMessage}`
        : `Fetching ${this.secondaryLoadingMessage}...`;
    },
  },
};
</script>
