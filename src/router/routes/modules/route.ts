import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/route',
  name: 'Route',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.route',
    requiresAuth: true,
    icon: 'icon-list',
    order: 100,
  },
  children: [
    {
      path: 'list',
      name: 'RouteList',
      component: () => import('@/views/route/list/index.vue'),
      meta: {
        locale: 'menu.route.list',
        requiresAuth: true,
      },
    },
    {
      path: 'create',
      name: 'RouteCreate',
      component: () => import('@/views/route/detail/index.vue'),
      meta: {
        locale: 'menu.route.create',
        requiresAuth: true,
        hideInMenu: true,
      },
    },
    {
      path: 'detail/:routeId',
      name: 'RouteDetail',
      component: () => import('@/views/route/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
