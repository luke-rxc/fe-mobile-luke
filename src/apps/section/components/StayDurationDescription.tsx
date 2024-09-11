import { useCallback } from 'react';
import styled from 'styled-components';
import { format, getYear } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { ChevronDown } from '@pui/icon';

export interface StayDurationDescriptionProps {
  className?: string;
  startDate: number;
  endDate: number;
}

const StayDurationDescriptionComponent = ({ startDate, endDate, className }: StayDurationDescriptionProps) => {
  /**
   * 날짜 포맷
   *
   * @example
   *   dateFormat(new Date('2024-01-01').getTime()) // 1월 1일(월)
   *   dateFormat(new Date('2024-01-01').getTime(), true) // 2024년 1월 1일(월)
   */
  const dateFormat = useCallback(
    (time: number, longLocalizedDate = false) =>
      format(time, longLocalizedDate ? 'PPP(E)' : 'MMM do(E)', { locale: ko }),
    [],
  );

  // 기간 포맷
  const durationFormat = useCallback((start: number, end: number) => {
    const currentYear = getYear(Date.now());
    const startYear = getYear(start);
    const endYear = getYear(end);

    // 시작일이 현재 년도보다 큰 경우
    if (startYear > currentYear) {
      // e.g. 2025년 1월 1일(토) - 1월 2일(일)
      return `${dateFormat(start, true)} - ${dateFormat(end)}`;
    }

    // 종료일이 현재 년도보다 큰 경우
    if (endYear > currentYear) {
      // e.g. 12월 31일(금) - 2025년 1월 2일(일)
      return `${dateFormat(start)} - ${dateFormat(end, true)}`;
    }

    return `${dateFormat(start)} - ${dateFormat(end)}`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {durationFormat(startDate, endDate)} <ChevronDown />
    </div>
  );
};

export const StayDurationDescription = styled(StayDurationDescriptionComponent)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s4};

  ${ChevronDown} {
    width: 1.6rem;
    height: 1.6rem;
  }
`;
