import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/upstream',
  name: 'Upstream',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.upstream',
    requiresAuth: true,
    icon: 'icon-list',
    order: 101,
  },
  children: [
    {
      path: 'list',
      name: 'UpstreamList',
      component: () => import('@/views/upstream/list/index.vue'),
      meta: {
        locale: 'menu.upstream.list',
        requiresAuth: true,
      },
    },
    {
      path: 'create',
      name: 'UpstreamCreate',
      component: () => import('@/views/upstream/detail/index.vue'),
      meta: {
        locale: 'menu.upstream.create',
        requiresAuth: true,
        hideInMenu: true,
      },
    },
    {
      path: 'detail/:upstreamId',
      name: 'UpstreamDetail',
      component: () => import('@/views/upstream/detail/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
