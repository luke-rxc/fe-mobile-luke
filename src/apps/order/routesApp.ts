import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/OrderPayPage'))),
    path: '/order/checkout/:id/pay',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/OrderBidCheckoutPage'))),
    path: '/order/bid-checkout/:id',
    exact: true,
  },
];
