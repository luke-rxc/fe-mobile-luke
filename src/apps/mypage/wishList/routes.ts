import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/WishPage'))),
    path: '/mypage/wish',
    exact: true,
  },
];
