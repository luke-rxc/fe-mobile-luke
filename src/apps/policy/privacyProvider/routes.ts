import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/PrivacyProviderPage')),
    path: '/policy/privacy-provider',
    exact: true,
  },
];
