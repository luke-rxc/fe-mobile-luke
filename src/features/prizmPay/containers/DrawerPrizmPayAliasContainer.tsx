import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { PrizmRegisterContainer } from './PrizmRegisterContainer';

export interface DrawerPrizmPayAliasContainerProps extends ModalWrapperRenderProps {
  prizmPayId: number;
}

export const DrawerPrizmPayAliasContainer = ({
  onClose,
  transitionState,
  prizmPayId,
}: DrawerPrizmPayAliasContainerProps) => {
  const { drawerProps } = useDrawerInModal({
    onClose,
    transitionState,
  });

  return (
    <Drawer {...drawerProps} dragging title={{ label: '카드별명' }}>
      <PrizmRegisterContainer prizmPayId={prizmPayId} />
    </Drawer>
  );
};
