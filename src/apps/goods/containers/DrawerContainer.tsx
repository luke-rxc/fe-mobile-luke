import styled from 'styled-components';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { GoodsDrawerType, GoodsPageName } from '../constants';
import { PriceListContainer } from './PriceListContainer';

interface Props extends ModalWrapperRenderProps {
  goodsId: number;
  type: GoodsDrawerType;
}

export const DrawerContainer = ({ goodsId, type, onClose, transitionState }: Props) => {
  const { drawerProps: base } = useDrawerInModal({ onClose, transitionState });

  const drawerProps = {
    ...base,
    dragging: true,
    title: { label: GoodsPageName.PRICE_LIST },
    disabledBlur: true,
  };

  switch (type) {
    case GoodsDrawerType.PRICE_LIST:
      return (
        <DrawerStyled {...drawerProps}>
          <PriceListContainer goodsId={goodsId} />
        </DrawerStyled>
      );
    default:
      return null;
  }
};

const DrawerStyled = styled(Drawer)`
  .drag-handle-bar-wrapper {
    background: inherit;
  }
`;
