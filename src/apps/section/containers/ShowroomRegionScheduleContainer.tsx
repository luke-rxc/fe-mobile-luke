import noop from 'lodash/noop';
import { DatePickerV2 } from '@features/datePicker/components';
import { Conditional } from '@pui/conditional';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { userAgent } from '@utils/ua';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { useShowroomRegionScheduleService } from '../services/useShowroomRegionScheduleService';

export type ShowroomRegionScheduleContainerProps = Partial<ModalWrapperRenderProps>;

export const ShowroomRegionScheduleContainer = ({
  transitionState = 'unmounted',
  onClose = noop,
}: ShowroomRegionScheduleContainerProps) => {
  const { isApp } = userAgent();
  const { drawerProps: baseProps } = useDrawerInModal({ transitionState, onClose });

  const { calendar, closeConfirmMessages, handleComplete } = useShowroomRegionScheduleService();

  const drawerProps = {
    ...baseProps,
    title: { label: '날짜' },
    dragging: true,
    draggingProps: {
      closeConfirm: {
        ...closeConfirmMessages,
        disableForceClose: true,
        cb: () => {
          baseProps.onClose();
        },
      },
    },
    horizontalScroll: true,
  };

  if (!calendar) {
    return null;
  }

  return (
    <Conditional condition={isApp} trueExp={<div />} falseExp={<Drawer {...drawerProps} />}>
      <DatePickerV2 data={calendar} singleTouch={false} displayPrice={false} onClickComplete={handleComplete} />
    </Conditional>
  );
};
