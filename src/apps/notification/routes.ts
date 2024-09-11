import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/NotificationPage')),
    path: '/notifications',
    exact: true,
  },
];
