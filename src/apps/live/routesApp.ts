import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/LiveAuthAuctionEditPage'))),
    path: '/live/auth/auction/edit/:liveId?',
    exact: true,
    bodyHeight: 'calc(var(--vh, 1vh) * 100)',
  }, // 경매 필수정보 수정 페이지
  {
    component: withAuth(lazy(() => import('./pages/LiveAuthAuctionPage'))),
    path: '/live/auth/auction/:liveId?',
    exact: true,
    bodyHeight: 'calc(var(--vh, 1vh) * 100)',
  }, // 경매 인증 페이지
  {
    component: lazy(() => import('./pages/LiveFaqPage')),
    path: '/live/:liveId/faq',
    exact: true,
    bodyHeight: 'calc(var(--vh, 1vh) * 100)',
  }, // FAQ 페이지
];
