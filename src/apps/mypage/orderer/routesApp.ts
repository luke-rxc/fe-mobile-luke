import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  /**
   * 주소 검색
   */
  {
    component: withAuth(lazy(() => import('./pages/OrdererAuthPage'))),
    path: '/mypage/auth/order',
    exact: true,
  },
];
