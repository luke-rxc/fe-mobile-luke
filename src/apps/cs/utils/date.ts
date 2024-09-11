import {
  differenceInSeconds,
  differenceInDays,
  differenceInMonths,
  secondsToMinutes,
  secondsToHours,
  format,
} from 'date-fns';

export const toRelativeTime = (timestamp: number) => {
  const now = new Date();
  const base = new Date(timestamp);
  const diffSeconds = differenceInSeconds(now, base);
  const diffDays = differenceInDays(now, base);
  const diffMonths = differenceInMonths(now, base);
  const diffMinutes = secondsToMinutes(diffSeconds);
  const diffHours = secondsToHours(diffSeconds);

  if (diffMinutes < 1) {
    return '조금 전';
  }

  if (diffHours < 1) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  if (diffMonths < 1) {
    return `${diffDays}일 전`;
  }

  if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  }

  return format(base, 'yyyy. M. d');
};
