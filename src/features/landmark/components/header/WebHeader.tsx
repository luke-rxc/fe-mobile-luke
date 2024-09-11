import { forwardRef, memo } from 'react';
import { getImageLink } from '@utils/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { MWebHeader, MWebHeaderProps, MwebHeaderRef } from '@pui/mwebHeader';
import { QuickMenus, QuickMenusProps } from '../quickMenu';

export interface WebHeaderProps extends Omit<MWebHeaderProps, 'utils' | 'utilsColor'> {
  quickMenus?: QuickMenusProps['menus'];
}

/**
 * Web 전용 header
 */
export const WebHeader = memo(
  forwardRef<MwebHeaderRef, WebHeaderProps>(({ titleImagePath, quickMenus, ...props }, ref) => {
    const { isApp } = useDeviceDetect();

    if (isApp) {
      return null;
    }

    return (
      <MWebHeader
        ref={ref}
        {...props}
        utils={<QuickMenus menus={quickMenus} />}
        titleImagePath={titleImagePath && getImageLink(titleImagePath)}
      />
    );
  }),
);
