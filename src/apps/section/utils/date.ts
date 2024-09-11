import { startOfDay, endOfDay, addDays, format, parse, differenceInDays } from 'date-fns';

type GetStartOfDayOptions = {
  addDays?: number;
  format?: string;
};

export function getStartOfDay(date: Date, options: GetStartOfDayOptions = {}) {
  const { addDays: amount = 0 } = options;

  return startOfDay(addDays(date, amount));
}

export function getEndOfDay(date: Date, options: GetStartOfDayOptions = {}) {
  const { addDays: amount = 0 } = options;

  return endOfDay(addDays(date, amount));
}

export function getStartOfTomorrow() {
  return getStartOfDay(new Date(), { addDays: 1 });
}

export function getEndOfAfterTomorrow() {
  return getEndOfDay(new Date(), { addDays: 2 });
}

export function getEndOfTwoDaysAfterTomorrow() {
  return getEndOfDay(new Date(), { addDays: 3 });
}

export function getStayNights(
  startDate: Date | number,
  endDate: Date | number,
  { withoutTime = true }: { withoutTime?: boolean } = {},
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (withoutTime) {
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  }

  return differenceInDays(end, start);
}

type IsValidPeriodDateParams = {
  startDate?: string | number | Date;
  endDate?: string | number | Date;
};

export function isValidPeriodDate(
  period: IsValidPeriodDateParams,
  { dateFormat = 'yyyyMMdd' } = {},
): period is Required<IsValidPeriodDateParams> {
  const { startDate, endDate } = period;

  if (!startDate || !endDate) return false;

  try {
    const start = typeof startDate === 'string' ? parse(startDate, dateFormat, new Date()) : startDate;
    const end = typeof endDate === 'string' ? parse(endDate, dateFormat, new Date()) : endDate;

    return differenceInDays(end, start) > 0;
  } catch (error) {
    return false;
  }
}

type PeriodStringToDateParams = {
  startDate: string;
  endDate: string;
};

export function periodStringToDate({ startDate, endDate }: PeriodStringToDateParams, { dateFormat = 'yyyyMMdd' } = {}) {
  const start = parse(startDate, dateFormat, new Date());
  const end = parse(endDate, dateFormat, new Date());

  return { startDate: getStartOfDay(start).getTime(), endDate: getEndOfDay(end).getTime() };
}

type PeriodDateToStringParams = {
  startDate: number | Date;
  endDate: number | Date;
};

export function periodDateToString({ startDate, endDate }: PeriodDateToStringParams, { dateFormat = 'yyyyMMdd' } = {}) {
  return { startDate: format(startDate, dateFormat), endDate: format(endDate, dateFormat) };
}

export function stringArrayToNumberArray(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((v) => Number(v)).filter(Number.isInteger);
  }

  const number = Number(value);

  return Number.isInteger(number) ? [number] : [];
}
