import withAuth from '@hocs/withAuth';
import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/SettingPage')),
    path: '/mypage/setting',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/AccountPage'))),
    path: '/mypage/account',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/WithdrawPage'))),
    path: '/mypage/withdraw',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/WithdrawConfirmPage')),
    path: '/mypage/withdraw-confirm',
    exact: true,
  },
];
