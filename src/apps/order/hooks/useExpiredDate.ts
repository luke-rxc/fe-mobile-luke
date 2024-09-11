import { useDDay } from '@services/useDDay';
import { toHHMMSS } from '@utils/toTimeformat';
import { differenceInCalendarDays, differenceInHours, format } from 'date-fns';

export const useExpiredDate = (expiryDateMS: number) => {
  const now = Date.now();
  const diffDays = differenceInCalendarDays(expiryDateMS, now);
  const diffHours = differenceInHours(expiryDateMS, now);
  const isUsableCountDown = diffDays <= 1 && diffHours < 24;
  const { countDown } = useDDay({
    time: isUsableCountDown ? expiryDateMS : -1,
    enabled: isUsableCountDown,
  });

  const toDateText = () => {
    // 12:00:00
    if (isUsableCountDown) {
      return toHHMMSS(countDown);
    }
    // D-7
    if (diffDays < 8) {
      return `D-${diffDays}`;
    }
    // 2023.12.30
    return format(expiryDateMS, '~yyyy. MM. dd');
  };

  return { dateText: toDateText(), isUsableCountDown };
};
