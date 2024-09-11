import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { useModal } from '@hooks/useModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { useCallback } from 'react';
import { PrizmPayRegisterEntry } from '../components/PrizmPayRegisterEntry';
import { CALL_WEB_EVENT } from '../constants';

// TODO: 라이트모드, 디자인 반영
export type DrawerPrizmPayRegisterEntryContainerProps = ModalWrapperRenderProps;

export const DrawerPrizmPayRegisterEntryContainer = ({
  onClose,
  transitionState,
}: DrawerPrizmPayRegisterEntryContainerProps) => {
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });
  const drawerProps = {
    ...base,
    dragging: true,
  };
  const { closeModal } = useModal();

  const handleAddCard = useCallback(() => {
    const params = {
      type: CALL_WEB_EVENT.ON_REGISTER_ENTRY_CLOSE,
    };

    closeModal('', params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Drawer {...drawerProps}>
      <PrizmPayRegisterEntry onAddCard={handleAddCard} />
    </Drawer>
  );
};
