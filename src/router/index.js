import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Encounter from '@/views/Encounter.vue';
import Loader from '@/views/Loader.vue';
import Player from '@/views/Player.vue';
import Report from '@/views/Report.vue';
import Authorisation from '@/views/Authorisation';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/authorisation',
    name: 'Authorisation',
    component: Authorisation,
  },
  {
    path: '/load/:reportId',
    name: 'Loader',
    component: Loader,
  },
  {
    path: '/report/:reportId',
    name: 'Report',
    component: Report,
  },
  {
    path: '/report/:reportId/encounter/:encounterId',
    name: 'Encounter',
    component: Encounter,
  },
  {
    path: '/report/:reportId/player/:playerId',
    name: 'Player',
    component: Player,
  },
  {
    path: '/*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
