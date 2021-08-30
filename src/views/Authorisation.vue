<template>
  <div></div>
</template>

<script>
import { fetchToken } from '@/plugins/auth';
import { objectHasProperty } from '@/utils/functions';

export default {
  name: 'Authorisation',
  mounted() {
    if (objectHasProperty(this.$route.query, 'code')) {
      fetchToken(this.$route.query.code);
    }
    this.$router.push('/');
  },
};
</script>
