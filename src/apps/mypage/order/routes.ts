import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  // 주문 내역
  {
    component: withAuth(lazy(() => import('./pages/OrderListPage'))),
    path: '/mypage/orders',
    exact: true,
  },

  // 주문 상세
  {
    component: withAuth(lazy(() => import('./pages/OrderDetailsPage'))),
    path: '/mypage/orders/:id',
    exact: true,
  },

  // 티켓 상품 부분 취소 프로세스
  {
    component: withAuth(lazy(() => import('./pages/ClaimCancelTicketProcessPage'))),
    path: '/mypage/claims/:orderId/cancel-ticket/:processType(reason|confirm)',
    exact: true,
  },

  // 배송 상품 부분 취소
  {
    component: withAuth(lazy(() => import('./pages/ClaimCancelPartialProcessPage'))),
    path: '/mypage/claims/:orderId/cancel-partial/:processType(bundle|reason|confirm)',
    exact: true,
  },

  // 배송 상품 전체 취소
  {
    component: withAuth(lazy(() => import('./pages/ClaimCancelFullProcessPage'))),
    path: '/mypage/claims/:orderId/cancel-full/:processType(reason|confirm)',
    exact: true,
  },

  // 반품 프로세스
  {
    component: withAuth(lazy(() => import('./pages/ClaimReturnPage'))),
    path: '/mypage/claims/:orderId/return/:processType(bundle|reason|recall|confirm)',
    exact: true,
  },

  // 교환 프로세스
  {
    component: withAuth(lazy(() => import('./pages/ClaimExchangePage'))),
    path: '/mypage/claims/:orderId/exchange/:processType(bundle|reason|recall|confirm)',
    exact: true,
  },

  // 반품 상세
  {
    component: withAuth(lazy(() => import('./pages/ClaimReturnDetailPage'))),
    path: '/mypage/claims/:orderId/return-detail',
    exact: true,
  },

  // 교환 상세
  {
    component: withAuth(lazy(() => import('./pages/ClaimExchangeDetailPage'))),
    path: '/mypage/claims/:orderId/exchange-detail',
    exact: true,
  },
];
