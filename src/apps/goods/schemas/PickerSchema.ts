import { TikcetKind } from '@constants/goods';
import {
  CalendarDaysSchema,
  CalendarSchema,
  DayOfWeekSchema,
  MonthsSchema,
} from '@features/datePicker/schemas/DatePickerSchema';
import { OptionInfoSchema, OptionItemSchema, OptionSchema } from './OptionSchema';

export type TicketUITypeSchema = 'CALENDAR_SINGLE' | 'CALENDAR_MULTI' | 'SEAT' | 'DEFAULT';

interface GoodsCalendarDaysSchema extends CalendarDaysSchema {
  options?: OptionInfoSchema[];
}

export interface GoodsMonthsSchema extends Omit<MonthsSchema, 'days'> {
  days: GoodsCalendarDaysSchema[];
}

export interface GoodsCalendarSchema extends Omit<CalendarSchema, 'months' | 'stayDays'> {
  goodsId: number;
  months: GoodsMonthsSchema[];
  ticketUI: TicketUITypeSchema;
  ticketKind: TikcetKind;
  displayPrice: boolean;
  stayDays: number;
}

export interface CalendarOptionsSchema extends Pick<OptionSchema, 'titleList' | 'itemList'> {
  goodsId: number;
}

export interface DayTimesSchema {
  dateTime: number;
  minPrice: number;
  maxPrice: number;
  enable: boolean;
  purchasableStock: number;
  selectedValue: string;
  options?: OptionInfoSchema[];
}

export interface DateTimeDaysSchema {
  year: number;
  month: number;
  day: number;
  dayOfWeek: DayOfWeekSchema;
  times: DayTimesSchema[];
}

export interface DateTimesSchema {
  goodsId: number;
  days: DateTimeDaysSchema[];
  ticketUI: TicketUITypeSchema;
  ticketKind: TikcetKind;
  userMaxPurchaseEa: number;
  displayPrice: boolean;
}

export interface LayoutOptionSchema {
  id: number;
  name: string;
  items: OptionItemSchema[];
}

export interface LayoutOptionsSchema {
  layoutCount: number;
  layouts: LayoutOptionSchema[];
}
