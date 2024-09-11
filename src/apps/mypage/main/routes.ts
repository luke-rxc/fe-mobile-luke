import withAuth from '@hocs/withAuth';
import { lazy } from 'react';

export default [
  {
    component: withAuth(lazy(() => import('./pages/MypageMainPage'))),
    path: '/mypage',
    exact: true,
  },
];
