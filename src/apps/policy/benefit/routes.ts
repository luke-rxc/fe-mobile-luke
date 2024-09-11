import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/PolicyBenefitPage')),
    path: '/policy/benefit/:version?',
    exact: true,
  },
];
