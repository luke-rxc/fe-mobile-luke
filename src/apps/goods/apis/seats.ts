import { baseApiClient } from '@utils/api';
import { AllSeatInfoSchema, SingleSeateInfoSchema, LayoutLockSchema } from '../schemas';

export interface SeatInfoRequestParam {
  goodsId: number;
  scheduleAt?: number;
  scheduleId?: number | null;
}

export interface LayoutLockRequestParam {
  goodsId: number;
  scheduleId: number | null;
  layoutIds: number[];
}

/**
 * 구역정보/회차/좌석 전체 레이아웃 조회 API
 *
 * @param SeatInfoRequestParam
 * @returns
 */
export const getSeatInfo = ({ goodsId, scheduleAt, scheduleId }: SeatInfoRequestParam) => {
  const optionalQueryParam = scheduleId ? `&scheduleId=${scheduleId}` : '';
  return baseApiClient.get<AllSeatInfoSchema>(
    `/v1/goods/${goodsId}/culture-schedule?scheduleAt=${scheduleAt}${optionalQueryParam}`,
  );
};

/**
 * 단일 선택 회차 및 좌석 레이아웃 조회 API
 *
 * @param SeatInfoRequestParam
 * @returns
 */
export const getSingleSeatInfo = ({ goodsId, scheduleId }: SeatInfoRequestParam) => {
  return baseApiClient.get<SingleSeateInfoSchema>(`/v1/goods/${goodsId}/culture-schedule/${scheduleId}`);
};

/**
 * 좌석 점유 생성 API
 *
 * @param LayoutLockRequestParam
 * @returns
 */
export const createLayoutLock = ({ goodsId, scheduleId, layoutIds }: LayoutLockRequestParam) => {
  const requestData = { layoutIds };
  return baseApiClient.post<LayoutLockSchema[]>(
    `/v1/goods/${goodsId}/culture-schedule/${scheduleId}/layout-lock`,
    requestData,
  );
};
