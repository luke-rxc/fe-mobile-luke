import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/HomePage')),
    path: '/about',
    exact: true,
    bodyBackGroundColor: '#000',
  },
];
