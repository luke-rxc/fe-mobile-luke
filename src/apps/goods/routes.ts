import { lazy } from 'react';

export default [
  {
    // 상품
    component: lazy(() => import('./pages/GoodsPage')),
    path: '/goods/:goodsPageId',
    exact: true,
    appCoverType: 'full',
  },
  {
    // 상품 > 상품고시
    component: lazy(() => import('./pages/GoodsInformationPage')),
    path: '/goods/information/:goodsId',
    exact: true,
  },
  {
    // 상품 > 상품고시(티켓)
    component: lazy(() => import('./pages/GoodsInformationTicketPage')),
    path: '/goods/information/ticket/:goodsId',
    exact: true,
  },
  {
    // 상품 > 상품상세
    component: lazy(() => import('./pages/GoodsDetailPage')),
    path: '/goods/detail/:goodsId',
    exact: true,
    bodyTouchAction: 'manipulation',
  },
  {
    // 상품 > 이용 안내
    component: lazy(() => import('./pages/GoodsDetailInfoPage')),
    path: '/goods/detail/info/:goodsId',
    exact: true,
  },
  {
    // 상품 > 배송, 교환, 환불 정보
    component: lazy(() => import('./pages/GoodsCsPage')),
    path: '/goods/cs/:goodsId',
    exact: true,
  },
];
