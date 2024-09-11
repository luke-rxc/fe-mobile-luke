import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/ProfilePage'))),
    path: '/mypage/profile',
    exact: true,
  },
];
