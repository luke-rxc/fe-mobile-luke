import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  // 주문 내역
  {
    component: withAuth(lazy(() => import('./pages/PointPage'))),
    path: '/mypage/reward',
    exact: true,
  },
];
