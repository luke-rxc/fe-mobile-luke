import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  // 라이브 페이지 > 상품
  {
    component: lazy(() => import('./pages/GoodsPage')),
    path: '/goods/live/:goodsPageId',
    exact: true,
    appCoverType: 'safe-area-top',
  },
  // 상품 > 옵션 > Picker
  {
    component: withAuth(lazy(() => import('./pages/PickerPage'))),
    path: '/goods/option/:type/:goodsId',
    exact: true,
  },
  // 이미지 뷰어
  {
    component: withAuth(lazy(() => import('./pages/ImageViewerPage'))),
    path: '/goods/option/image-viewer',
    exact: true,
    bodyTouchAction: 'manipulation',
  },
  // 상품 > 가격 더보기
  {
    component: lazy(() => import('./pages/PriceListPage')),
    path: '/goods/price-list/:goodsId',
    exact: true,
  },
];
