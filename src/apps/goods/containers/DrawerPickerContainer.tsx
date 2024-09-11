import { useEffect, useState } from 'react';
import { disabledBodyScroll, enabledBodyScroll } from '@utils/bodyScroll';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { ModalWrapperRenderProps } from '@pui/modal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { OptionComponentModel } from '../models';
import { OptionUiType } from '../constants';
import { ExpiredInfoType, OptionSelectedInfoProps, ParentOptionsProps } from '../types';
import { DatePickerContainer } from './DatePickerContainer';
import { DateTimePickerContainer } from './DateTimePickerContainer';
import { PricePickerContainer } from './PricePickerContainer';
import { SeatPickerContainer } from './SeatPickerContainer';
import { SeatToolbar } from '../components/SeatToolbar';

interface DrawerPickerProps extends ModalWrapperRenderProps {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 component index */
  index: number;
  /** 옵션 구성 component */
  components: OptionComponentModel[];
  /** 선택된 옵션 정보 */
  selectedInfo: OptionSelectedInfoProps[];
  /** 만료시간 정보 */
  expired: ExpiredInfoType | null;
}

export const DrawerPickerContainer = ({
  onClose,
  transitionState,
  goodsId,
  index,
  components,
  selectedInfo,
  expired,
}: DrawerPickerProps) => {
  const { drawerProps: base } = useDrawerInModal({ onClose, transitionState });
  const [type, setType] = useState<OptionUiType | null>(null);

  const { type: componentType, title } = components[index];
  const parentOptions = selectedInfo.reduce((prev, current, currentIdx) => {
    if (currentIdx >= index) {
      return prev;
    }

    return [
      ...prev,
      {
        type: components[currentIdx].type,
        values: current.value,
      },
    ];
  }, [] as ParentOptionsProps[]);

  const drawerProps = {
    ...base,
    dragging: true,
    draggingProps: {
      closeConfirm: {
        title: '선택하지 않고 나갈까요?',
        message: '내용은 저장되지 않습니다',
        disableForceClose: true,
        cb: () => {
          base.onClose();
        },
      },
    },
    title: { label: title },
    horizontalScroll: true,
  };

  const drawerSeatProps = {
    ...drawerProps,
    toolbarSuffix: <SeatToolbar />,
    verticalScroll: false,
  };

  useEffect(() => {
    if (drawerProps.open) {
      enabledBodyScroll();
      return;
    }

    disabledBodyScroll();
  }, [drawerProps.open]);

  useEffect(() => {
    switch (componentType) {
      case 'CALENDAR_DAY':
        setType(OptionUiType.DATE_PICKER);
        break;
      case 'CALENDAR_DAY_TIME':
        setType(OptionUiType.DATE_TIME_PICKER);
        break;
      case 'SEAT':
        setType(OptionUiType.SEAT_PICKER);
        break;
      case 'SEAT_OPTION':
        setType(OptionUiType.PRICE_PICKER);
        break;
      default:
        setType(null);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (type) {
    case OptionUiType.DATE_PICKER:
      return (
        <Drawer {...drawerProps}>
          <DatePickerContainer goodsId={goodsId} components={components} parentOptions={parentOptions} />
        </Drawer>
      );
    case OptionUiType.DATE_TIME_PICKER:
      return (
        <Drawer {...drawerProps}>
          <DateTimePickerContainer goodsId={goodsId} components={components} parentOptions={parentOptions} />
        </Drawer>
      );
    case OptionUiType.SEAT_PICKER:
      return (
        <Drawer {...drawerSeatProps}>
          <SeatPickerContainer goodsId={goodsId} components={components} parentOptions={parentOptions} />
        </Drawer>
      );
    case OptionUiType.PRICE_PICKER:
      return (
        <Drawer {...drawerProps}>
          <PricePickerContainer
            goodsId={goodsId}
            components={components}
            parentOptions={parentOptions}
            expired={expired}
          />
        </Drawer>
      );
    default:
      return null;
  }
};
