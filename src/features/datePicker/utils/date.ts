import { format, getYear } from 'date-fns';
import { ko } from 'date-fns/locale';

const MONTH_DATE_DAY = 'M월 d일(iii)';
const YEAR_MONTH_DATE_DAY = `yyyy년 ${MONTH_DATE_DAY}`;
const THIS_YEAR = new Date().getFullYear();

interface Props {
  /** 시작일 */
  startDate: number | Date;
  /** 종료일 */
  endDate?: number | Date;
  /** 박수 */
  nights?: number;
  /** 일수 */
  days?: number;
}

/** 시작일과 종료일 날짜 범위를 텍스트로 변환 */
export const getDateRangeText = ({ startDate, endDate, nights, days }: Props) => {
  const startFormat = THIS_YEAR === getYear(startDate) ? MONTH_DATE_DAY : YEAR_MONTH_DATE_DAY;
  const startDateText = format(startDate, startFormat, { locale: ko });

  if (!endDate || !nights || !days) {
    return startDateText;
  }

  const endFormat = getYear(startDate) === getYear(endDate) ? MONTH_DATE_DAY : YEAR_MONTH_DATE_DAY;
  const endDateText = format(endDate, endFormat, { locale: ko });

  return `${startDateText} - ${endDateText}, ${nights}박 ${days}일`;
};
