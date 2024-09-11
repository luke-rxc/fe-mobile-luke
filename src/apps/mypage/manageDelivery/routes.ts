import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  {
    component: withAuth(lazy(() => import('./pages/MypageManageDeliveryListPage'))),
    path: '/mypage/manage-delivery',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/MypageManageDeliveryRegisterPage'))),
    path: '/mypage/manage-delivery/register',
    exact: true,
  },
  {
    component: withAuth(lazy(() => import('./pages/MypageManageDeliveryUpdatePage'))),
    path: '/mypage/manage-delivery/detail/:id',
    exact: true,
  },
];
