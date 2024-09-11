import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/PolicyPrivacyPage')),
    path: '/policy/privacy/:version?',
    exact: true,
  },
];
