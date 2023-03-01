import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/enterprise',
  name: 'Enterprise',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.enterprise',
    requiresAuth: true,
    icon: 'icon-list',
    order: 102,
  },
  children: [
    {
      path: 'list',
      name: 'EnterpriseList',
      component: () => import('@/views/enterprise/list/index.vue'),
      meta: {
        locale: 'menu.enterprise.list',
        requiresAuth: true,
      },
    },
    {
      path: 'create',
      name: 'EnterpriseCreate',
      component: () => import('@/views/enterprise/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
    {
      path: 'detail/:enterpriseId',
      name: 'EnterpriseDetail',
      component: () => import('@/views/enterprise/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
