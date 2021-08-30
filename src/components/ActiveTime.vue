<template>
  <div class="pa-0 ma-0">
    <active-time-header
      :start-time="activeTimes[0].startTime"
      :end-time="activeTimes[0].endTime"
      :max="maxValue"
    />
    <active-time-entry
      v-for="(activeEntry, index) in activeTimes"
      :key="index"
      :max="maxValue"
      :entry-data="activeEntry.entryData"
      :player="activeEntry.player"
    />
  </div>
</template>

<script>
import ActiveTimeHeader from '@/components/ActiveTimeHeader';
import ActiveTimeEntry from '@/components/ActiveTimeEntry';

export default {
  name: 'ActiveTime',
  props: {
    activeTimes: {
      type: Array,
      required: true,
    },
  },
  components: {
    ActiveTimeHeader,
    ActiveTimeEntry,
  },
  data: () => ({
    maxValue: 1200,
  }),
};
</script>
