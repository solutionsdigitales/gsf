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
        path: '/locations',
        name: 'locations',
        component: () => import('./modules/location/location.registry.vue'),
      },
      {
        path: '/services',
        name: 'services',
        component: () => import('./modules/service/service.registry.vue'),
      },
      {
        path: '/divisions',
        name: 'divisions',
        component: () => import('./modules/division/division.registry.vue'),
      },
      {
        path: '/projects',
        name: 'projects',
        component: () => import('./modules/project/project.registry.vue'),
      },
      {
        path: '/accounts',
        name: 'accounts',
        component: () => import('./modules/account/account.registry.vue'),
      },
      {
        path: '/vendors',
        name: 'vendors',
        component: () => import('./modules/vendor/vendor.registry.vue'),
      },
      {
        path: '/funding_sources',
        name: 'funding_sources',
        component: () => import('./modules/funding_source/funding_source.registry.vue'),
      },
      {
        path: '/budget_lines',
        name: 'budget_lines',
        component: () => import('./modules/budget_line/budgetLine.registry.vue'),
      },
      {
        path: '/activities',
        name: 'activities',
        component: () => import('./modules/activity/activity.registry.vue'),
      },
      {
        path: '/function_codes',
        name: 'function_codes',
        component: () => import('./modules/function_code/function_code.registry.vue'),
      },
      
      {
        path: '/entities',
        name: 'entities',
        component: () => import('./modules/entity/entity.registry.vue'),
      },
      {
        path: '/sub_projects',
        name: 'sub_projects',
        component: () => import('./modules/sub_project/sub_project.registry.vue'),
      },
      {
        path: '/employees',
        name: 'employees',
        component: () => import('./modules/employee/employee.registry.vue'),
      },
      {
        path: '/prf_registry',
        name: 'prf_registry',
        component: () => import('./modules/prf/registry.vue'),
      },
      {
        path: '/prf_registration',
        name: 'prf_registration',
        component: () => import('./modules/prf/new.vue'),
      },
      {
        path: '/fr_registry',
        name: 'fr_registry',
        component: () => import('./modules/ddf/registry.vue'),
      },
      {
        path: '/fr_registration',
        name: 'fr_registration',
        component: () => import('./modules/ddf/new.vue'),
      },
      {
        path: '/och_registry',
        name: 'och_registry',
        component: () => import('./modules/och/registry.vue'),
      },
      {
        path: '/och_registration',
        name: 'och_registration',
        component: () => import('./modules/och/new.vue'),
      },
      {
        path: '/prf_approve_view',
        name: 'prf_approve_view',
        component: () => import('./modules/prf/prf_approve_view.vue'),
      },
      {
        path: '/prf_notes',
        name: 'prf_notes',
        component: () => import('./modules/prf/prf_notes.vue'),
      },
      {
        path: '/prf_historic',
        name: 'prf_historic',
        component: () => import('./modules/prf/historic.vue'),
      },
      {
        path: '/exr_registry',
        name: 'exr_registry',
        component: () => import('./modules/expense_report/registry.vue'),
      },
      {
        path: '/exr_registration',
        name: 'exr_registration',
        component: () => import('./modules/expense_report/new.vue'),
      },
      {
        path: '/ta_setting',
        name: 'ta_setting',
        component: () => import('./modules/ta_setting/list'),
      },
      {
        path: '/ta_registry',
        name: 'ta_registry',
        component: () => import('./modules/ta/registry'),
      },
      {
        path: '/ta_registration',
        name: 'ta_registration',
        component: () => import('./modules/ta/new'),
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
