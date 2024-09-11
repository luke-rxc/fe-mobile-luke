import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/PolicyTermPage')),
    path: '/policy/term/:version?',
    exact: true,
  },
];
