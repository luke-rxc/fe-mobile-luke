import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  // 공지사항 목록
  {
    component: lazy(() => import('./pages/CsNoticeListPage')),
    path: '/cs/notice',
    exact: true,
  },
  // 공지사항 상세
  {
    component: lazy(() => import('./pages/CsNoticeDetailPage')),
    path: '/cs/notice/:articleId',
    exact: true,
  },
  // FAQ 목록
  {
    component: lazy(() => import('./pages/CsFaqListPage')),
    path: '/cs/faq',
    exact: true,
  },
  // FAQ 상세
  {
    component: lazy(() => import('./pages/CsFaqDetailPage')),
    path: '/cs/faq/:articleId',
    exact: true,
  },
  // 1:1 문의 목록
  {
    component: withAuth(lazy(() => import('./pages/CsQnaListPage'))),
    path: '/cs/qna',
    exact: true,
    appCoverType: 'full',
  },
  // 1:1 문의 상세
  {
    component: withAuth(lazy(() => import('./pages/CsQnaDetailPage'))),
    path: '/cs/qna/:requestId',
    exact: true,
  },
  // 1:1 문의 등록
  {
    component: withAuth(lazy(() => import('./pages/CsQnaRegisterPage'))),
    path: '/cs/qna-register',
    exact: true,
  },
];
