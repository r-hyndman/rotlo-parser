<template>
  <div class="d-flex flex-row mb-2">
    <div class="ml-10 name">Name</div>
    <horizontal-bar-header
      :height="height"
      :max="max"
      :start-time="startTime"
      :end-time="endTime"
    />
  </div>
</template>

<script>
import HorizontalBarHeader from '@/components/HorizontalBarHeader';
// import moment from 'moment';

export default {
  name: 'ActiveTimeHeader',
  components: {
    HorizontalBarHeader,
  },
  props: {
    height: {
      type: Number,
      default: 18,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  computed: {
    duration() {
      return this.endTime - this.startTime;
    },
  },
};
</script>

<style scoped>
.name {
  width: 16ch;
  max-width: 16ch;
}
</style>
