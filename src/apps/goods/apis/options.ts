import { baseApiClient } from '@utils/api';
import {
  CalendarOptionsSchema,
  GoodsCalendarSchema,
  DateTimesSchema,
  LayoutOptionsSchema,
  OptionComponentsSchema,
  PriceListSchema,
} from '../schemas';

export interface CalendarParams {
  type: OptionComponentsSchema;
  values: string[];
}

export interface CalendarPostParams {
  goodsId: number;
  components: OptionComponentsSchema[];
  parameters: CalendarParams[];
}

export interface CalendarOptionsParams {
  goodsId: number;
  days: string[];
}

export interface LayoutOptionsParams {
  goodsId: number;
  scheduleId: number;
  layoutIds: number[];
}

export interface LayoutLockParams {
  layoutIds: number[];
}

export interface LayoutLockDeleteParams {
  goodsId: number;
  layoutIds: number[];
}

export interface PricingTabeParam {
  goodsId: number;
}

// 달력 날짜 정보 불러오기
export const postCalendar = ({ goodsId, components, parameters }: CalendarPostParams): Promise<GoodsCalendarSchema> => {
  const params = { components, parameters };

  return baseApiClient.post<GoodsCalendarSchema>(`/v1/goods/${goodsId}/options/search/calendar-days`, params);
};

// 달력 날짜 정보 불러오기
export const postCalendarOptions = ({
  goodsId,
  components,
  parameters,
}: CalendarPostParams): Promise<CalendarOptionsSchema> => {
  const params = { components, parameters };

  return baseApiClient.post<CalendarOptionsSchema>(`/v1/goods/${goodsId}/options/search/calendar-options`, params);
};

// 날짜 및 회차 정보 불러오기
export const postCalendarDayTimes = ({
  goodsId,
  components,
  parameters,
}: CalendarPostParams): Promise<DateTimesSchema> => {
  const params = { components, parameters };

  return baseApiClient.post<DateTimesSchema>(`/v1/goods/${goodsId}/options/search/calendar-day-times`, params);
};

// 권종 옵션 정보 불러오기
export const getLayoutOptions = ({
  goodsId,
  scheduleId,
  layoutIds,
}: LayoutOptionsParams): Promise<LayoutOptionsSchema> => {
  return baseApiClient.get<LayoutOptionsSchema>(
    `/v1/goods/${goodsId}/culture-schedule/${scheduleId}/layout-options?layoutIds=${layoutIds}`,
  );
};

// 좌석 점유 해지
export const deleteLayoutLock = ({ goodsId, layoutIds }: LayoutLockDeleteParams): Promise<unknown> => {
  const params = { layoutIds };

  return baseApiClient.delete<unknown>(`/v1/goods/${goodsId}/culture-schedule/layout-lock`, params);
};

// 날짜별 요금 정보 불러오기
export const getPriceList = ({ goodsId }: PricingTabeParam): Promise<PriceListSchema> => {
  return baseApiClient.get<PriceListSchema>(`v1/goods/${goodsId}/options/pricing-table`);
};
