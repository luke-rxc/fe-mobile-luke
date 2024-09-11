import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ReactNode } from 'react';

interface Props {
  opened: boolean;
  children: ReactNode;
  onCloseDrawer?: () => void;
}

export const LiveFollowDrawer = ({ opened, children, onCloseDrawer: handleCloseDrawer }: Props) => {
  const onClose = () => {
    handleCloseDrawer?.();
  };

  return (
    <Drawer open={opened} onClose={onClose} dragging draggingProps={{ layoutHeaderHeight: 56 }}>
      {children}
    </Drawer>
  );
};
