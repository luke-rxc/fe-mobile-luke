import { useEffect } from 'react';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { AppPopupTypes } from '@constants/mwebToAppDialog';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';

interface BannerServiceProps {
  enabled: boolean;
}

export const useAppBannerService = ({ enabled }: BannerServiceProps) => {
  const { openDialogToApp } = useMwebToAppDialog();
  const deepLink = getAppLink(AppLinkTypes.HOME);
  /**
   * 메인 초기 진입시 앱 유도 팝업 진행
   */
  useEffect(() => {
    if (enabled) {
      openDialogToApp(deepLink, {
        appPopupType: AppPopupTypes.LANDING,
        delay: 6500,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
};
