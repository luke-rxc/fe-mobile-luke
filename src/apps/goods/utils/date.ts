import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 제시된 date 인자를 locale 설정 가능한 dateFormat 형태로 변환
 *
 * @param {(number | Date)} date
 * @param {string} [dateFormat='yyyy. M. d(iii)']
 * @param {Locale} locale
 * @return {string}
 */
export const toDateFormatWithLocale = (date: number | Date, dateFormat = 'yyyy. M. d(iii)', locale = ko) => {
  return format(date, dateFormat, { locale });
};
