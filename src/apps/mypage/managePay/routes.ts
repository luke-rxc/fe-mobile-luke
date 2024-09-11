import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  // Prizm-Pay 목록
  {
    component: withAuth(lazy(() => import('./pages/MypageUserPrizmPayListPage'))),
    path: '/mypage/manage-pay',
    exact: true,
  },

  // Prizm-Pay 등록
  {
    component: withAuth(lazy(() => import('./pages/MypageUserPrizmPayRegisterPage'))),
    path: '/mypage/manage-pay/register',
    exact: true,
  },
  // Prizm-Pay 별칭 수정
  {
    component: withAuth(lazy(() => import('./pages/MypageUserPrizmPayUpdatePage'))),
    path: '/mypage/manage-pay/detail/:id',
    exact: true,
  },
  // Prizm-Pay 재등록 안내
  {
    component: withAuth(lazy(() => import('./pages/MypageUserPrizmPayRegisterEntryPage'))),
    path: '/mypage/manage-pay/register-entry',
    exact: true,
  },
];
