import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/ReviewListPage')),
    path: '/review/list/:type(showroom|goods)/:id',
    exact: true,
  },
  /** v1.39.0 이하 버전 대응 */
  {
    component: lazy(() => import('./pages/ReviewListPage')),
    path: '/review/list/:goodsId',
    exact: true,
  },
  {
    component: lazy(() => import('./pages/ReviewDetailPage')),
    path: '/review/detail/:reviewId',
    exact: true,
    appCoverType: 'safe-area-top',
  },
];
