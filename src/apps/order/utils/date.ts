import { format, getYear } from 'date-fns';
import { ko } from 'date-fns/locale';

const MONTH_DATE_DAY = 'M월 d일(iii)';
const YEAR_MONTH_DATE_DAY = `yyyy년 ${MONTH_DATE_DAY}`;
const THIS_YEAR = new Date().getFullYear();

export const getDateRangeText = (bookingStartDate: number, bookingEndDate: number, nights: number) => {
  const isBookingStartThisYear = getYear(bookingStartDate) === THIS_YEAR;
  const bookingStartDateFormat = isBookingStartThisYear ? MONTH_DATE_DAY : YEAR_MONTH_DATE_DAY;
  const bookingEndDateFormat = getBookingEndDateFormat(bookingStartDate, bookingEndDate);
  const days = nights + 1;

  return `${format(bookingStartDate, bookingStartDateFormat, { locale: ko })} - ${format(
    bookingEndDate,
    bookingEndDateFormat,
    { locale: ko },
  )}, ${nights}박 ${days}일`;
};

const getBookingEndDateFormat = (bookingStartDate: number, bookingEndDate: number) => {
  const bookingStartYear = getYear(bookingStartDate);
  const bookingEndYear = getYear(bookingEndDate);
  return bookingStartYear === bookingEndYear ? MONTH_DATE_DAY : YEAR_MONTH_DATE_DAY;
};
