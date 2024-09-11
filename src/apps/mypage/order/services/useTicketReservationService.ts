import env from '@env';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import { useState, useMemo, useCallback, createElement } from 'react';
import { useUpdateEffect } from 'react-use';
import { AppLinkTypes } from '@constants/link';
import { getAppLink } from '@utils/link';
import { AlertParams } from '@utils/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import { useMutation } from '@hooks/useMutation';
import { useModal } from '@hooks/useModal';
import { merge } from 'lodash';
import { postTicketReservation } from '../apis';
import { toTicketCalendarInitialDataModel, OrderDetailsModel } from '../models';
import {
  TicketConfirmType,
  TicketConfirmTypeText,
  TicketReservationEventType,
  TicketReservationErrorCode,
} from '../constants';
import { TicketReservationFieldType, TicketCalendarReceiveDataType } from '../types';
import { DrawerTicketCalendarContainer as ticketCalendarDrawer } from '../containers/DrawerTicketCalendarContainer';
import { useLogService } from './useLogService';

interface UseTicketReservationServiceParams extends Pick<OrderDetailsModel, 'ticketInfo'> {
  orderId: string;
  onRefetch: () => void;
}

/**
 * 티켓(숙박) 예약 Service
 */
export const useTicketReservationService = ({ orderId, ticketInfo, onRefetch }: UseTicketReservationServiceParams) => {
  const { openModal: openWithMweb } = useModal();
  const { receiveValues, open, alert, confirm, showToastMessage, purchaseStatusUpdated } = useWebInterface();
  const { logMyOrderTabRequestConfirm, logMyOrderTabSelectBookingDate } = useLogService();

  const [ticketFields, setTicketFields] = useState<Record<string, TicketReservationFieldType> | undefined>();
  const asyncAlert = useCallback(async (params: AlertParams) => alert(params), [alert]);

  /**
   * 예약 유형에 따른 텍스트를 반환
   * ticketInfo?.isConfirmed ? '확정' : '요청'
   */
  const confirmTypeText =
    TicketConfirmTypeText[ticketInfo?.isConfirmed ? TicketConfirmType.CONFIRMED : TicketConfirmType.WAIT];

  /**
   * 티켓이 예약 가능한지 여부를 확인
   */
  const isReservable = useMemo<boolean>(() => {
    const ticketOptions = ticketInfo?.ticketOptions;

    if (ticketOptions) {
      return ticketOptions.every(({ exportId }) => {
        const filed = ticketFields?.[exportId];
        return filed?.value && !filed?.error;
      });
    }

    return false;
  }, [ticketFields, ticketInfo?.ticketOptions]);

  /**
   * 주문 상태를 새로고침하고 구매 상태를 업데이트
   */
  const syncOrderStatus = () => {
    onRefetch(); // 주문상세 Refetch
    purchaseStatusUpdated({ orderId: +orderId, type: 'confirm' }); // 주문리스트 Refetch (only app)
  };

  /**
   * 티켓 예약 Mutation
   */
  const ticketReservationMutation = useMutation(postTicketReservation, {
    onSuccess: () => {
      syncOrderStatus();
      logMyOrderTabRequestConfirm();
      showToastMessage({
        message: `예약을 ${confirmTypeText}했습니다`,
      });
    },
    onError: async (error) => {
      const { code, message: errorMessage, errors } = error?.data || {};
      const [title = '', message = ''] = errorMessage?.split(/\r?\n/) || [];

      switch (code) {
        case TicketReservationErrorCode.EXPIRED: // 기한만료
        case TicketReservationErrorCode.REQUESTED: // 중복요청
        case TicketReservationErrorCode.CANCELLED: // 취소된 주문
          await asyncAlert({ title, message });
          syncOrderStatus();
          return;
        case TicketReservationErrorCode.INVALID: // 유효하지 않은 날짜
          if (errors) {
            const fieldErrors = errors.reduce<typeof ticketFields>((acc, { value: exportId }) => {
              return exportId ? { ...acc, [exportId]: { error: error.data?.message || true } } : acc;
            }, {});

            !isEmpty(fieldErrors) && setTicketFields(merge({}, ticketFields, fieldErrors));
          }
          return;
        default:
          alert({
            title: `예약을 ${confirmTypeText}할 수 없습니다`,
            message: '일시적인 오류가 발생했습니다',
          });
      }
    },
  });

  /**
   * 티켓 예약 요청 이벤트 함수
   */
  const onTicketReservation = async () => {
    if (!isReservable) {
      return;
    }

    const isConfirmed = await confirm({
      title: `이 날짜로 예약을 ${confirmTypeText}합니다`,
      message: `날짜를 바꾸려면 ${ticketInfo?.isConfirmed ? '' : '예약 확정 후'} 1:1 문의를 이용해주세요`,
    });

    if (!isConfirmed) {
      return;
    }

    const items = compact(Object.values(ticketFields || {}).map(({ value }) => value));
    ticketReservationMutation.mutate({ items });
  };

  /**
   * 캘린더 OPEN 이벤트 함수
   */
  const onShowTicketCalendar = async (exportId: number) => {
    // 기한 만료시
    const isExpiry = (ticketInfo?.expiryDate || Date.now()) <= Date.now();

    if (isExpiry) {
      await asyncAlert({
        title: `예약을 ${confirmTypeText}할 수 없습니다`,
        message: '체크인 날짜 선택 기한이 지났습니다',
      });
      syncOrderStatus();
      return;
    }

    // event logging
    logMyOrderTabSelectBookingDate();

    // open calendar
    const initialData = toTicketCalendarInitialDataModel(exportId);
    open(
      {
        initialData,
        url: getAppLink(AppLinkTypes.WEB, {
          landingType: 'modal',
          url: `${env.endPoint.baseUrl}/mypage/orders/ticket-calendar/${exportId}`,
        }),
      },
      {
        doWeb: () =>
          openWithMweb(
            {
              nonModalWrapper: true,
              render: (props) => createElement(ticketCalendarDrawer, { ...props }),
            },
            initialData,
          ),
      },
    );
  };

  // TicketInfos => TicketFields 초기화
  useUpdateEffect(() => {
    setTicketFields(undefined);
  }, [ticketInfo]);

  // ReceiveValues => TicketFields 업데이트
  useUpdateEffect(() => {
    const { type, data } = receiveValues as TicketCalendarReceiveDataType;

    if (!ticketInfo || !data || type !== TicketReservationEventType.ON_CALENDAR_CLOSE) {
      return;
    }

    setTicketFields((fields = {}) => ({ ...fields, [data.exportId]: data.selectedDateInfo }));
  }, [receiveValues]);

  return {
    ticketFields,
    isReservable,
    onTicketReservation,
    onShowTicketCalendar,
  };
};
