import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { DeliveryAddressContainer } from './DeliveryAddressContainer';

export type DrawerDeliveryAddressContainerProps = ModalWrapperRenderProps;

export const DrawerDeliveryAddressContainer = ({ onClose, transitionState }: DrawerDeliveryAddressContainerProps) => {
  const { drawerProps } = useDrawerInModal({
    onClose,
    transitionState,
  });

  return (
    <Drawer {...drawerProps} dragging>
      <DeliveryAddressContainer />
    </Drawer>
  );
};
