import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/PolicyFinanceTermPage')),
    path: '/policy/finance-term/:version?',
    exact: true,
  },
];
