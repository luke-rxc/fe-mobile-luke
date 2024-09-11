import React from 'react';
import { Portal } from '@pui/portal';
import { Conditional } from '@pui/conditional';

export interface DrawerPortalProps {
  /** Portal 을 사용하지 않는 케이스 */
  disable?: boolean;
}
export const DrawerPortal: React.FC<DrawerPortalProps> = ({ disable = false, children }) => (
  <Conditional
    condition={disable}
    trueExp={<>{children}</>}
    falseExp={<Portal elementId="floating-root">{children}</Portal>}
  />
);

Conditional.displayName = 'Conditional';
