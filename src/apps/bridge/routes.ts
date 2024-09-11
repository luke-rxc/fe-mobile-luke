import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/BridgePage')),
    path: '/bridge/:landingType(thrill)/:code',
    exact: true,
  },
];
