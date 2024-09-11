import { useCallback } from 'react';
import { useQuery } from '@hooks/useQuery';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { AlertParams } from '@utils/webInterface';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { DaysIndexListType } from '@features/datePicker/types';
import { TicketCalendarInitialDataType } from '../types';
import { toTicketCalendarModel, TicketCalendarModel, toTicketCalendarReceiveDataModel } from '../models';
import { getTicketCalendar } from '../apis';
import {
  MYPAGE_ORDER_TICKET_CALENDER_QUERY_KEY,
  TicketCalendarErrorCode,
  TicketReservationEventType,
} from '../constants';

/**
 * 티켓(숙박) 예약 캘린더 조회/확정요청 서비스
 */
export const useTicketCalendarService = () => {
  const { initialValues, close, alert, showToastMessage, generateHapticFeedback } = useWebInterface();
  const { closeModal: closeWithMWeb } = useModal();
  const asyncAlert = useCallback(async (params: AlertParams) => alert(params), [alert]);

  const { type, data: initialData } = initialValues as TicketCalendarInitialDataType;
  const { exportId = 0 } = initialData || {};

  /**
   * 예약 가능한 날짜가 있는지 여부를 체크
   */
  const hasReservableDates = (calendar: TicketCalendarModel['data']): boolean => {
    const { months, stayNights } = calendar;
    const days = months.flatMap((month) => month.days);

    return days.some((_, index) => {
      const consecutiveDays = days.slice(index, index + stayNights);
      return consecutiveDays.length === stayNights && consecutiveDays.every(({ enable }) => enable);
    });
  };

  /**
   * DatePicker에서 받은 선택된 날짜 인덱스 데이터를 실제 날짜 데이터 배열로 변환
   */
  const getSelectedDays = (selectedDayIndexes: DaysIndexListType[], calendar: TicketCalendarModel['data']) => {
    const { months, stayNights } = calendar;
    const selectedDays = selectedDayIndexes.flatMap((dayIndexes, monthIndex) =>
      dayIndexes
        .map((dayIndex) => ({
          ...months[monthIndex].days[dayIndex],
          year: months[monthIndex].year,
          month: months[monthIndex].month,
        }))
        .filter(({ day }) => !!day),
    );

    // 체크아웃일은 선택일에서 제외
    return selectedDays.slice(0, stayNights);
  };

  /**
   * 예약 가능한 날짜가 없는 경우를 처리하는 함수
   */
  const onNoReservableDates = useCallback(async () => {
    await asyncAlert({
      title: '선택할 수 있는 날짜가 없습니다',
      message: '1:1 문의 또는 취소해주세요',
    });

    close({}, { doWeb: () => closeWithMWeb('') });
  }, [close, asyncAlert, closeWithMWeb]);

  /**
   * 날짜 변경 이벤트 처리 함수
   * @returns {boolean} - DatePicker 업데이트 결정
   */
  const onChangeDate = (selectedDayIndexes: DaysIndexListType[], calendar: TicketCalendarModel['data']): boolean => {
    const selectedDays = getSelectedDays(selectedDayIndexes, calendar);
    const isAllSelectable = selectedDays.every((day) => day.enable);

    if (isAllSelectable) {
      generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
      return true;
    }

    generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
    showToastMessage({ message: '예약할 수 없는 날짜가 포함되어 있습니다' });
    return false;
  };

  /**
   * 날짜 선택 완료 이벤트 처리 함수
   */
  const onCompleteSelectDate = useCallback(
    (selectedDayIndexes: DaysIndexListType[], calendar: TicketCalendarModel['data']) => {
      const { stayNights } = calendar;
      const selectedDays = getSelectedDays(selectedDayIndexes, calendar);
      const receiveValues = toTicketCalendarReceiveDataModel(exportId, stayNights, selectedDays[0]);

      generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });
      close(receiveValues, { doWeb: () => closeWithMWeb('', receiveValues) });
    },
    [exportId, close, closeWithMWeb, generateHapticFeedback],
  );

  /**
   * 캘린더 조회 Query
   */
  const ticketCalendarQuery = useQuery(
    [MYPAGE_ORDER_TICKET_CALENDER_QUERY_KEY, exportId],
    () => getTicketCalendar({ exportId }),
    {
      enabled: type === TicketReservationEventType.ON_CALENDAR_OPEN,
      select: toTicketCalendarModel,
      onSuccess: ({ data }: TicketCalendarModel) => {
        !hasReservableDates(data) && onNoReservableDates();
      },
      onError: (error) => {
        error?.data?.code === TicketCalendarErrorCode.EMPTY && onNoReservableDates();
      },
    },
  );

  return {
    calendar: ticketCalendarQuery.data,
    status: ticketCalendarQuery.status,
    error: ticketCalendarQuery.error,
    onChangeDate,
    onCompleteSelectDate,
  };
};
