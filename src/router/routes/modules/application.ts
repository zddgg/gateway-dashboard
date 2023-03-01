import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/application',
  name: 'Application',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.application',
    requiresAuth: true,
    icon: 'icon-list',
    order: 103,
  },
  children: [
    {
      path: 'list',
      name: 'ApplicationList',
      component: () => import('@/views/application/list/index.vue'),
      meta: {
        locale: 'menu.application.list',
        requiresAuth: true,
      },
    },
    {
      path: 'create',
      name: 'ApplicationCreate',
      component: () => import('@/views/application/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
    {
      path: 'detail/:appId',
      name: 'ApplicationDetail',
      component: () => import('@/views/application/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
