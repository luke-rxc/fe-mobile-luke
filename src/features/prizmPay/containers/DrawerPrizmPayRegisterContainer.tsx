import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { HTMLAttributes } from 'react';
import { useInputBlur } from '../hooks';
import { PrizmRegisterContainer } from './PrizmRegisterContainer';

export type DrawerPrizmPayRegisterContainerProps = ModalWrapperRenderProps;

export const DrawerPrizmPayRegisterContainer = ({ onClose, transitionState }: DrawerPrizmPayRegisterContainerProps) => {
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });
  const drawerProps = {
    ...base,
    dragging: true,
    draggingProps: {
      closeConfirm: {
        title: '카드를 등록하지 않고 나갈까요?',
        message: '내용은 저장되지 않습니다',
        disableForceClose: true,
        cb: () => {
          base.onClose();
        },
      },
    },
    title: {
      label: '카드 추가',
    },
  };

  return (
    <Drawer {...drawerProps}>
      <InputBlurEffect>
        <PrizmRegisterContainer />
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
