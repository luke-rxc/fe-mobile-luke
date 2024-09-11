import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ReactNode } from 'react';

interface Props {
  opened: boolean;
  children: ReactNode;
  onCloseDrawer?: () => void;
}

export const FaqDrawer = ({ opened, children, onCloseDrawer: handleCloseDrawer }: Props) => {
  const onClose = () => {
    handleCloseDrawer?.();
  };

  return (
    <Drawer
      open={opened}
      onClose={onClose}
      title={{ label: '이용 안내' }}
      dragging
      expandView
      to="-40%"
      snapTopPercent={85}
      draggingProps={{ layoutHeaderHeight: 56 }}
    >
      {children}
    </Drawer>
  );
};
