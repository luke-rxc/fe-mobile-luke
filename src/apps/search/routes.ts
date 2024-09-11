import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/SearchPage')),
    path: '/search',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/SearchGoodsListPage')),
    path: '/search/goodslist',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/SearchShowroomListPage')),
    path: '/search/showroomlist',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/SearchContentListPage')),
    path: '/search/contentlist',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/SearchScheduleLiveListPage')),
    path: '/search/schedulelivelist',
    exact: true,
  },
];
