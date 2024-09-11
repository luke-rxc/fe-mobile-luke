import styled from 'styled-components';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DeliveryListContainer } from './DeliveryListContainer';

export interface DeliveryListModalContainerProps extends ModalWrapperRenderProps {
  className?: string;
  selectable?: boolean;
  disabledAction?: boolean;
}

export const DeliveryListModalContainer = styled(
  ({ selectable, disabledAction, transitionState, className, onClose }: DeliveryListModalContainerProps) => {
    const { drawerProps } = useDrawerInModal({ onClose, transitionState });

    return (
      <Drawer dragging title={{ label: '배송지 관리' }} {...drawerProps} className={className}>
        <DeliveryListContainer selectable={selectable} disabledAction={disabledAction} />
      </Drawer>
    );
  },
)`
  ${DeliveryListContainer} {
    min-height: auto;
  }
`;
