import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/CartPage'))),
    path: '/bag/cart',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/OrderCheckoutPage'))),
    path: '/order/checkout/:id',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/OrderCompletePage'))),
    path: '/order/complete/:id',
    exact: true,
    appCoverType: 'full',
  },
];
