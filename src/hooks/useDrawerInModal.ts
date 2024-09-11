/**
 * Modal 의 Children내에서 Drawer을 사용할때 가이드
 *
 * @description
 * - 사용하려는 Children 내에서 Drawer 컴포넌트를 이용하여 생성할때, 해당 Hook을 사용
 */
import { useEffect } from 'react';
import { ModalWrapperRenderProps } from '@pui/modal';
import { useDrawer } from '@hooks/useDrawer';

type Props = ModalWrapperRenderProps;
export const useDrawerInModal = ({ onClose, transitionState }: Props) => {
  const { open, drawerOpen, drawerClose } = useDrawer({
    firstDrawerBaseIndex: 0,
  });
  const handleCloseComplete = () => {
    onClose();
  };

  useEffect(() => {
    drawerOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (transitionState === 'exiting') {
      drawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionState]);

  return {
    drawerProps: {
      open,
      nonPortal: true,
      fullHeight: true,
      backDropProps: { disableBackDropClose: true },
      tabIndex: -1,
      onClose: drawerClose,
      onCloseComplete: handleCloseComplete,
    },
  };
};
