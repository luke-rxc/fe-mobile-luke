import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { differenceInCalendarDays, getDaysInMonth, setDate } from 'date-fns';
import { CalendarSchema, MonthsSchema } from '@features/datePicker/schemas';
import { CalendarDaysModel } from '@features/datePicker/models';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { userAgent } from '@utils/ua';
import { ShowroomRegionMessages } from '../constants';

const monthInitialValue = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  days: [],
};
/** 현재의 달을 제외한 + 6개월 */
const CalendarRange = 7;
const DayOfWeeks = ['일', '월', '화', '수', '목', '금', '토'];

export const useShowroomRegionScheduleService = () => {
  const { isApp } = userAgent();
  const { setTopBar, setDismissConfirm, close } = useWebInterface();
  const { closeModal } = useModal();

  const [calendar, setCalendar] = useState<CalendarSchema>();

  const closeConfirmMessages = {
    title: ShowroomRegionMessages.CLOSE_CONFIRM_TITLE,
    message: ShowroomRegionMessages.CLOSE_CONFIRM_MESSAGE,
  };

  /** 완료 */
  const handleComplete = (selected: CalendarDaysModel[]) => {
    if (isEmpty(selected)) {
      return;
    }

    const { year: startYear, month: startMonth, day: startDay } = selected[0];
    const { year: endYear, month: endMonth, day: endDay } = selected[selected.length - 1];

    const params = {
      startDate: new Date(`${startYear}/${startMonth}/${startDay}`).getTime(),
      endDate: new Date(`${endYear}/${endMonth}/${endDay}`).getTime(),
    };

    close(params, {
      doWeb: () => {
        closeModal('', params);
      },
    });
  };

  useEffect(() => {
    if (isApp) {
      setTopBar({ title: '날짜' });
      setDismissConfirm({
        isConfirmable: true,
        ...closeConfirmMessages,
      });
    }

    /** 달력 데이터 구성 */
    const newDate = new Date();

    const months: MonthsSchema[] = new Array(CalendarRange).fill(monthInitialValue).reduce((prev, current, index) => {
      const { year, month } = index === 0 ? current : prev[index - 1];

      let currentDate = new Date(year, month);
      const daysInMonth = getDaysInMonth(new Date(year, month));

      const days = [...new Array(daysInMonth).keys()]
        .map((day) => {
          currentDate = setDate(currentDate, day + 1);

          const diffDays = differenceInCalendarDays(currentDate, newDate);

          if (diffDays < 0) {
            return null;
          }

          return {
            day: currentDate.getDate(),
            dayOfWeek: diffDays === 0 ? '오늘' : DayOfWeeks[currentDate.getDay()],
            enable: true,
            checkoutOnly: !!(index === CalendarRange - 1 && daysInMonth === day + 1),
            purchasableStock: 1,
          };
        })
        .filter((value) => value);

      return [
        ...prev,
        {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          days: [...days],
        },
      ];
    }, []);

    const { year, month, days } = months[months.length - 1];
    const { day } = days[days.length - 1];

    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()).getTime();
    const endDate = new Date(year, month - 1, day).getTime();

    setCalendar({
      months,
      startDate,
      endDate,
      stayNights: 1,
      stayDays: 2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { calendar, closeConfirmMessages, handleComplete };
};
