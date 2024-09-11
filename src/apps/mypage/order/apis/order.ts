import { baseApiClient } from '@utils/api';
import { OrderListSchema, OrderDetailsSchema, TicketCalendarSchema } from '../schemas';

/**
 * 주문 내역 목록 API
 *
 * @param GetOrderHistoriesParam
 * @returns
 */
export const getOrderList = ({ size = 20, nextParameter = '' }: GetOrderHistoriesParam) => {
  return baseApiClient.get<OrderListSchema>(`/v1/order/history?size=${size}&${nextParameter}`);
};

export interface GetOrderHistoriesParam {
  /** 리스트 사이즈 */
  size?: number;
  /** 다음 데이터 리스트 요청을 위한 파라미터 */
  nextParameter?: string;
}

/**
 * 주문 내역 상세 API
 *
 * @param GetOrderDetailRequestParam
 * @returns
 */
export const getOrderDetails = ({ orderId }: GetOrderDetailRequestParam) => {
  return baseApiClient.get<OrderDetailsSchema>(`/v1/order/history/${orderId}`);
};

export interface GetOrderDetailRequestParam {
  orderId: number | string;
}

/**
 * 예약 확정(요청) API
 */
export const postTicketReservation = ({ items }: PostTicketReservationParam) => {
  return baseApiClient.post<void>(`/v1/export/accom-specify-date`, { items });
};

export interface PostTicketReservationParam {
  items: { exportId: number; stayNights: number; bookingDate: number }[];
}

/**
 * 캘린더 조회 API
 */
export const getTicketCalendar = ({ exportId }: GetTicketCalendarParam) => {
  return baseApiClient.get<TicketCalendarSchema>(`/v1/export/${exportId}/accom-calendar-days`);
};

export interface GetTicketCalendarParam {
  exportId: number;
}
