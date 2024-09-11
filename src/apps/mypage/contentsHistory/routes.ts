import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/ContentsHistoryPage')),
    path: '/mypage/contents-history',
    exact: true,
  },
];
