import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/CouponListPage'))),
    path: '/mypage/coupon',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/CouponRegisterPage'))),
    path: '/mypage/coupon/register',
    exact: true,
  },
];
