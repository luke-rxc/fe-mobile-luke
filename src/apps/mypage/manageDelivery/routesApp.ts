import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  /**
   * 주소 검색
   */
  {
    component: withAuth(lazy(() => import('./pages/MypageManageDeliveryAddressPage'))),
    path: '/mypage/manage-delivery/address',
    exact: true,
  },
];
