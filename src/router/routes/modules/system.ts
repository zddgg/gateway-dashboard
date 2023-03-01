import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/system',
  name: 'System',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-list',
    order: 104,
  },
  children: [
    {
      path: 'node',
      name: 'NodeList',
      component: () => import('@/views/system/node/list/index.vue'),
      meta: {
        locale: 'menu.system.node.list',
        requiresAuth: true,
      },
    },
    {
      path: 'cluster',
      name: 'ClusterList',
      component: () => import('@/views/system/cluster/list/index.vue'),
      meta: {
        locale: 'menu.system.cluster.list',
        requiresAuth: true,
      },
    },
    {
      path: 'secret/list',
      name: 'SecretList',
      component: () => import('@/views/system/secret/list/index.vue'),
      meta: {
        locale: 'menu.system.secret.list',
        requiresAuth: true,
      },
    },
    {
      path: 'secret/create',
      name: 'SecretCreate',
      component: () => import('@/views/system/secret/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
    {
      path: 'secret/detail/:secretId',
      name: 'SecretDetail',
      component: () => import('@/views/system/secret/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
