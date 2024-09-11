import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';

/**
 * 제시된 date 인자를 dateFormat 형태로 변환
 *
 * @param {(number | Date)} date
 * @param {string} [dateFormat='yyyy/MM/dd HH:mm']
 * @return {string}
 */
export const toDateFormat = (date: number | Date, dateFormat = 'yyyy/MM/dd HH:mm') => {
  return format(date, dateFormat);
};

/**
 * 타임존 기준 변환 후 Date 반환 로직
 */

const transformTimeZoneDate = (timeStamp: number, defaultTimeZone = 9) => {
  const currentTimeZone = new Date(timeStamp).getTimezoneOffset() / 60;
  const timeZoneGap = defaultTimeZone + currentTimeZone;
  return new Date(timeStamp + timeZoneGap * 60 * 60 * 1000);
};

/**
 * 제시된 date 인자를 타임존 기준(default 한국) dateFormat 형태로 변환
 *
 * @param {(number)} timeStamp
 * @param {string} [dateFormat='yyyy/MM/dd HH:mm']
 * @param {number} [defaultTimeZone=9]
 * @return {string}
 */
export const formatInTimeZone = (timeStamp: number, dateFormat = 'yyyy/MM/dd HH:mm', defaultTimeZone = 9) => {
  return format(transformTimeZoneDate(timeStamp, defaultTimeZone), dateFormat, { locale: ko });
};

/**
 * 타켓 시간이 지금으로 부터 24시간 미만인지 여부를 체크
 * @param {Number} targetTimestamp
 */
export const isWithin24Hours = (targetTimestamp: number): boolean => {
  const currentTimestamp = Date.now();
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  const timeDifference = targetTimestamp - currentTimestamp;

  return timeDifference < twentyFourHoursInMilliseconds;
};

/**
 * bookingDate 및 stayNights 연박 정보 기반 체크인/아웃 날짜 표기 등를 위한 기간 표기 로직
 *
 * @param {number} bookingDate
 * @param {number} stayNights
 * @returns
 */
export const transformPeriodDate = (bookingDate: number, stayNights: number) => {
  // e.g. 2024. 7. 11(목) - 7. 12(금), 12. 30(금) - 2025. 1. 1(토)
  const DateTextPattern = {
    year: 'yyyy. M. d(iii)',
    month: 'M. d(iii)',
  };
  const startDate = transformTimeZoneDate(bookingDate);
  const endBaseDate = transformTimeZoneDate(bookingDate);
  const endDate = transformTimeZoneDate(endBaseDate.setDate(endBaseDate.getDate() + stayNights));
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startDatePattern = startYear === endYear ? DateTextPattern.year : DateTextPattern.month;
  const endDatePattern = startYear === endYear ? DateTextPattern.month : DateTextPattern.year;
  const startDateText = format(startDate, startDatePattern, { locale: ko });
  const endDateText = format(endDate, endDatePattern, { locale: ko });
  return `${startDateText} - ${endDateText}`;
};
