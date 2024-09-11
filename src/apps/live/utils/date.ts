import { toDateFormat } from '@utils/date';
import { isToday } from 'date-fns';

/**
 * 날짜 format 변환
 */
const getDateString = (date: number) => {
  if (isToday(date)) {
    return `오늘 ${toDateFormat(date, 'a h:mm')}`;
  }
  return toDateFormat(date, 'M. d a h:mm');
};

/**
 * 편성표 날짜 format 변환
 */
export const toDateFormatForSchedule = (date: number) => {
  const dateString = getDateString(date).replace('AM', '오전').replace('PM', '오후').replace('00분', '');
  return dateString;
};

/**
 * 현재시간과 차이 millisecond
 */
export const getDiffMillisecondByToDate = (targetTimestamp: number, offset = 0) => {
  return Math.max(new Date(targetTimestamp).getTime() - new Date().getTime() + offset, 0);
};
