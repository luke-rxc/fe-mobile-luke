import zipWith from 'lodash/zipWith';
import addDays from 'date-fns/addDays';
import { getDateRangeText } from '@features/datePicker/utils';
import { TicketCalendarSchema } from '../schemas';
import { TicketCalendarInitialDataType, TicketCalendarReceiveDataType } from '../types';
import { TicketReservationEventType } from '../constants';
import { TicketCalendarProps } from '../components';

export type TicketCalendarModel = Omit<TicketCalendarProps, 'onClickComplete' | 'onClickDate' | 'className'>;

/**
 * 티켓(숙박) 예약 캘린더 Model
 */
export const toTicketCalendarModel = (schema: TicketCalendarSchema): TicketCalendarModel => {
  const { titles, values } = schema.option;
  const optionInfos = zipWith(titles, values, (title, value) => ({ title, text: value }));

  return { data: schema, optionInfos };
};

/**
 * InitialValues Model(OrderDetail => TicketCalendar)
 */
export const toTicketCalendarInitialDataModel = (exportId: number): TicketCalendarInitialDataType => {
  return {
    type: TicketReservationEventType.ON_CALENDAR_OPEN,
    data: { exportId },
  };
};

/**
 * ReceiveValues Model (TicketCalendar => OrderDetail)
 */
export const toTicketCalendarReceiveDataModel = <T extends { year: number; month: number; day: number }>(
  exportId: number,
  stayNights: number,
  bookingDateInfo: T,
): TicketCalendarReceiveDataType => {
  const { year, month, day } = bookingDateInfo;
  const startDate = new Date(year, month - 1, day).getTime();
  const endDate = addDays(startDate, stayNights);

  return {
    type: TicketReservationEventType.ON_CALENDAR_CLOSE,
    data: {
      exportId,
      selectedDateInfo: {
        label: getDateRangeText({ startDate, endDate, nights: stayNights, days: stayNights + 1 }),
        value: { exportId, stayNights, bookingDate: startDate },
      },
    },
  };
};
