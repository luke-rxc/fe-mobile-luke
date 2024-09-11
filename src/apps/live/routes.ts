import { lazy } from 'react';

export default [
  {
    component: lazy(() => import('./pages/LiveDetailPage')),
    path: '/live/:liveId',
    exact: true,
    bodyOverflowHidden: true,
  }, // 라이브 상세 페이지
  {
    component: lazy(() => import('./pages/LiveEndPage')),
    path: '/live/:liveId/end',
    exact: true,
  }, // 라이브 종료 페이지
  {
    component: lazy(() => import('./pages/LiveGoodsPage')),
    path: '/live/:liveId/goods',
    exact: true,
  }, // 라이브 종료 상품 페이지
  {
    component: lazy(() => import('./pages/LiveSchedulePage')),
    path: '/live/:liveId/schedule',
    exact: true,
  }, // 라이브 종료 스케줄 페이지
];
