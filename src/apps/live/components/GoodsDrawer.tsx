import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ReactNode } from 'react';
import { ReturnTypeUseLiveService } from '../services';

type Props = ReturnTypeUseLiveService['goodsDrawer'] & {
  opened: boolean;
  children: ReactNode;
};

/**
 * 상품 drawer
 */
export const GoodsDrawer = ({ opened, children, onCloseDrawer: handleCloseDrawer }: Props) => {
  const title = { label: '상품' };
  const onClose = () => {
    handleCloseDrawer?.();
  };

  return (
    <Drawer open={opened} onClose={onClose} title={title} dragging expandView to="-40%" snapTopPercent={85}>
      {children}
    </Drawer>
  );
};
