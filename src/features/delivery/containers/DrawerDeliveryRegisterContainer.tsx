import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { HTMLAttributes } from 'react';
import { useInputBlur } from '../hooks';
import { DeliveryRegisterContainer } from './DeliveryRegisterContainer';

export type DrawerDeliveryRegisterContainerProps = ModalWrapperRenderProps & { deliveryId?: number };

export const DrawerDeliveryRegisterContainer = ({
  onClose,
  transitionState,
  deliveryId,
}: DrawerDeliveryRegisterContainerProps) => {
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });
  const title = `배송지를 ${deliveryId ? '수정' : '등록'}하지 않고 나갈까요?`;
  const label = `배송지 ${deliveryId ? '수정' : '추가'}`;

  const drawerProps = {
    ...base,
    dragging: true,
    draggingProps: {
      closeConfirm: {
        title,
        message: '내용은 저장되지 않습니다',
        disableForceClose: true,
        cb: () => {
          base.onClose();
        },
      },
    },
    title: {
      label,
    },
  };

  return (
    <Drawer {...drawerProps}>
      <InputBlurEffect>
        <DeliveryRegisterContainer deliveryId={deliveryId} />
      </InputBlurEffect>
    </Drawer>
  );
};

type InputBlurEffectProps = HTMLAttributes<HTMLDivElement>;

const InputBlurEffect = ({ children, ...props }: InputBlurEffectProps) => {
  const elRef = useInputBlur<HTMLDivElement>();

  return (
    <div {...props} ref={elRef}>
      {children}
    </div>
  );
};
