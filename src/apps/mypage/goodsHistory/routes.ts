import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/GoodsHistoryPage')),
    path: '/mypage/goods-history',
    exact: true,
  },
];
