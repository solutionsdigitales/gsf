import { createRouter, createWebHashHistory } from 'vue-router';
// import Dashboard from './components/Dashboard.vue';

const routes = [
  {
    path: '/sign_in',
    name: 'sign_in',
    component: () => import('./modules/user/signIn.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('./AppHome.vue'),
    children: [
      {
        path: '/home',
        name: 'landing',
        component: () => import('./modules/landingPage.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('./modules/Dashboard.vue'),
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('./modules/user/user.registry.vue'),
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('./modules/role/role.registry.vue'),
      },
          {
        path: '/services',
        name: 'services',
        component: () => import('./modules/service/service.registry.vue'),
      },
      {
        path: '/members',
        name: 'members',
        component: () => import('./modules/member/member.registry.vue'),
      },
      {
        path: '/cellules',
        name: 'cellules',
        component: () => import('./modules/cellule/cellule.registry.vue'),
      },
      {
        path: '/price_list',
        name: 'price_list',
        component: () => import('./modules/priceList/priceList.registry.vue'),
      },
      {
        path: '/payments',
        name: 'payments',
        component: () => import('./modules/payment/registry.vue'),
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./modules/NotFound.vue'),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
