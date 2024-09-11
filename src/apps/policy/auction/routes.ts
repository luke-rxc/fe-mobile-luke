import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/PolicyAuctionPage')),
    path: '/policy/auction/:version?',
    exact: true,
  },
];
