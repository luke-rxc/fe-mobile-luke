import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/MainPage')),
    path: '/',
    exact: true,
  },
];
