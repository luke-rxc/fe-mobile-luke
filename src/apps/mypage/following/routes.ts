import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/FollowingPage'))),
    path: '/mypage/following',
    exact: true,
  },
];
