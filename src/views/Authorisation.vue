<template>
  <div></div>
</template>

<script>
import { fetchToken } from '@/plugins/auth';
import { objectHasKey } from '@/utils/functions';
import { mapActions } from 'vuex';

export default {
  name: 'Authorisation',
  mounted() {
    if (objectHasKey(this.$route.query, 'code')) {
      fetchToken(this.$route.query.code, this.setToken);
    }
    this.$router.push({ name: 'Home' });
  },
  methods: {
    ...mapActions({
      setToken: 'auth/setToken',
    }),
  },
};
</script>
