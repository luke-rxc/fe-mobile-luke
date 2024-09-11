import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/AuthAdultPage')),
    path: '/member/auth/adult',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/AuthAdultCompletePage')),
    path: '/member/auth/adult/complete',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/MemberFollowPage')),
    path: '/member/follow',
    exact: true,
  },
];
