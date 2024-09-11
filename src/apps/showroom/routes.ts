import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/ShowroomPage')),
    path: '/showroom/:code',
    exact: true,
    appCoverType: 'safe-area-bottom',
    disableInitialScroll: true,
  },
];
