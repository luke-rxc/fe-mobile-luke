import { createElement, FunctionComponent, useRef } from 'react';
import { useModal } from '@hooks/useModal';
import { ModalStatus } from '@stores/useModalStore';

export const useDrawerModal = () => {
  const { openModal, getStatus } = useModal();

  const modalId = useRef<string>('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpen = async (element: FunctionComponent<any>, drawerProps: Record<string, unknown> | any) => {
    // 연속터치 시 여러개의 모달 open 방지
    if (getStatus(modalId.current) === ModalStatus.OPENED) {
      return;
    }

    modalId.current = await openModal({
      nonModalWrapper: true,
      render: (props) => {
        return createElement(element, { ...props, ...drawerProps });
      },
    });
  };

  return {
    handleDrawerOpen: handleOpen,
  };
};
