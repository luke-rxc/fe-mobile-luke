import { lazy } from 'react';
import withAuth from '@hocs/withAuth';

export default [
  /**
   * 구매상품 부가정보
   */
  {
    component: withAuth(lazy(() => import('./pages/AdditionalInfoPage'))),
    path: '/mypage/orders/additional-info/:type(airlineticket)',
    exact: true,
  },
  /**
   * 티켓(숙박)예약 캘린더
   */
  {
    component: withAuth(lazy(() => import('./pages/DrawerTicketCalendarPage'))),
    path: '/mypage/orders/ticket-calendar/:exportId',
    exact: true,
  },
];
