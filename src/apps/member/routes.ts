import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/MemberLoginPage')),
    path: '/member/login',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/MemberConfirmPage')),
    path: '/member/confirm',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/MemberOAuthPage')),
    path: '/member/oauth/popup',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/MemberLogoutPage')),
    path: '/member/logout',
    exact: true,
  },
];
