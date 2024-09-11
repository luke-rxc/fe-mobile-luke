import { createElement, useEffect, useState } from 'react';
import { useUnmount } from 'react-use';
import { format, add } from 'date-fns';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useSnackbar } from '@hooks/useSnackbar';
import { getUniversalLink } from '@utils/link';
import { UniversalLinkTypes } from '@constants/link';
import { FloatingBannerOrder, FloatingBannerType } from '@constants/goods';
import { Snackbar, SnackbarProps } from '@pui/snackbar';
import { useFloating } from '@features/floating';
import { getLiveInfo } from '../apis';
import { toLiveModel, LiveModel } from '../models';

interface Props {
  liveId: number | null;
  enabled: boolean;
  zIndex?: number;
}

export const useLiveFloatingService = ({ liveId, enabled, zIndex }: Props) => {
  const { floatingLivePlayerStatus, floatingLivePlayerStatusValue } = useWebInterface();
  const { isApp } = useDeviceDetect();
  const { removeAllSnackbar } = useSnackbar();
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps | null>(null);

  const isFloatingLivePlayer = !!(
    floatingLivePlayerStatusValue !== null &&
    floatingLivePlayerStatusValue &&
    floatingLivePlayerStatusValue.liveId === liveId
  );

  /** Live floating Banner hooks */
  const { remove } = useFloating(FloatingBannerType.LIVE_SNACKBAR, createElement(Snackbar, snackbarProps), {
    enabled: enabled && !!liveId && !!snackbarProps,
    defaultVisible: true,
    order: FloatingBannerOrder.TOP,
  });

  /**
   * Live Info
   */
  const {
    data: liveInfo,
    isLoading: isLiveLoading,
    isError: isLiveError,
  } = useQuery(
    ['LiveFloating', liveId],
    async () => {
      const res = await getLiveInfo({ liveId });
      return res;
    },
    {
      enabled: !!liveId && enabled,
      select: (data) => toLiveModel(data),
    },
  );

  const getTimeMessage = (liveStartDate: number, livePlayTime: number | null) => {
    const prefix = '지금';
    const startTime = liveStartDate ? format(liveStartDate, 'HH:mm') : null;

    if (startTime) {
      if (livePlayTime) {
        const endTime = add(liveStartDate, { minutes: livePlayTime });
        return `${prefix} ${startTime} - ${format(endTime, 'HH:mm')}`;
      }

      return `${prefix} ${startTime}`;
    }

    return `${prefix} 라이브 진행중`;
  };

  const toLiveFloating = async ({ title, coverImage, coverImageWeb, liveStartDate, livePlayTime, id }: LiveModel) => {
    const message = getTimeMessage(liveStartDate, livePlayTime);
    const { web: webLinkUrl, app: deepLinkUrl } = getUniversalLink(UniversalLinkTypes.LIVE, {
      liveId: id,
    });

    const imagePath = isApp ? coverImage.path : coverImageWeb.path;
    const actionProps = {
      highlighted: true,
    };
    const action = {
      ...actionProps,
      label: '이동',
      href: isApp ? deepLinkUrl : webLinkUrl,
      onClick: () => remove(),
    };

    setSnackbarProps({
      fadeTime: 200,
      slide: true,
      dragDismiss: true,
      zIndex,
      title,
      message: message ?? '',
      image: { src: imagePath },
      autoDismiss: false,
      action,
      isFloatingBanner: true,
      onRemove: remove,
    });
  };

  const handleLiveFloating = () => {
    if (liveInfo) {
      toLiveFloating(liveInfo);
    }
  };

  const handleRemoveLiveFloating = (id: number) => {
    if (id !== liveId) {
      return;
    }

    remove();
  };

  /**
   * 1.15.0 버전 이후에서는 변경된 FloatingBanner를 사용함으로
   * @todos 추후 버전분기 제거시 같이 제거 필요
   */
  const handleCloseWebLiveFloating = () => {
    if (!isApp && liveInfo) {
      removeAllSnackbar();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => floatingLivePlayerStatus(), []);

  /** snackbar props 초기화 */
  useEffect(() => {
    return () => setSnackbarProps(null);
  }, [liveId]);

  useUnmount(() => remove());

  return {
    live: liveInfo,
    isLiveLoading,
    isLiveError,
    isFloatingLivePlayer,
    handleLiveFloating,
    handleCloseWebLiveFloating,
    handleRemoveLiveFloating,
  };
};
