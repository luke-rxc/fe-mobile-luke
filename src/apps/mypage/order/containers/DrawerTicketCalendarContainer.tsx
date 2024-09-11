/* eslint-disable react-hooks/exhaustive-deps */
import noop from 'lodash/noop';
import merge from 'lodash/merge';
import styled from 'styled-components';
import classnames from 'classnames';
import { useEffect } from 'react';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { PageError } from '@features/exception/components';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { Conditional } from '@pui/conditional';
import { Spinner } from '@pui/spinner';
import { TicketCalendarErrorCode } from '../constants';
import { useTicketCalendarService } from '../services/useTicketCalendarService';
import { TicketCalendar } from '../components';

export interface DrawerTicketCalendarContainerProps extends Partial<ModalWrapperRenderProps> {
  /** 클래스명 */
  className?: string;
}

/**
 * Ticket Calendar Modal
 */
export const DrawerTicketCalendarContainer = styled(
  ({ className, transitionState = 'unmounted', onClose = noop }: DrawerTicketCalendarContainerProps) => {
    const { isApp } = useDeviceDetect();
    const { setTopBar, setDismissConfirm } = useWebInterface();
    const { drawerProps: defaultDrawerProps } = useDrawerInModal({ transitionState, onClose });

    /**
     * 티켓(숙박) 캘린더 조회
     */
    const { calendar, status, error, onChangeDate, onCompleteSelectDate } = useTicketCalendarService();

    /**
     * 캘린더 타이틀
     */
    const calendarTitle = '날짜';

    /**
     * 날짜 선택중 캘린더 닫기시 컴펌 메시지
     */
    const calendarExitConfirmMsg = {
      title: '선택하지 않고 나갈까요?',
      message: '내용은 저장하지 않습니다',
    };

    /**
     * Web Modal Setting
     */
    const drawerProps = merge({}, defaultDrawerProps, {
      title: { label: calendarTitle },
      dragging: true,
      expandView: true,
      draggingProps: {
        closeConfirm: { ...calendarExitConfirmMsg, cb: defaultDrawerProps.onClose },
      },
    });

    /**
     * APP Modal setting (타이틀, 모달 Dismiss Confirm적용)
     */
    useEffect(() => {
      if (isApp) {
        setTopBar({ title: calendarTitle });
        setDismissConfirm({ ...calendarExitConfirmMsg, isConfirmable: true });
      }
    }, [isApp, setTopBar, setDismissConfirm]);

    return (
      <Conditional
        condition={isApp}
        trueExp={<div />}
        falseExp={<Drawer {...drawerProps} />}
        className={classnames(className, { 'is-app': isApp })}
      >
        {/* loading */}
        {status === 'loading' && <Spinner className="calendar-spinner" />}

        {/* error */}
        {status === 'error' && error?.data?.code !== TicketCalendarErrorCode.EMPTY && (
          <PageError className="calendar-exception" isFull={false} error={error} />
        )}

        {/* success */}
        {status === 'success' && calendar && (
          <TicketCalendar {...calendar} onClickDate={onChangeDate} onClickComplete={onCompleteSelectDate} />
        )}
      </Conditional>
    );
  },
)`
  &.is-app {
    width: 100vw;
    height: 100vh;
  }

  .calendar-spinner,
  .calendar-exception {
    ${({ theme }) => theme.mixin.centerItem()};
    height: 100%;
  }
`;
