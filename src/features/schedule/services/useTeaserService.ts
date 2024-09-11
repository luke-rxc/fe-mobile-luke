import { useMemo } from 'react';
import { useQuery } from '@hooks/useQuery';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { AppLinkTypes } from '@constants/link';
import { getAppLink } from '@utils/link';
import { getTeaser } from '../apis';
import { toTeaserModel } from '../models';
import { BrandFollowParams } from '../components';

export interface UseTeaserServiceParams {
  scheduleId: number;
}

export const useTeaserService = ({ scheduleId }: UseTeaserServiceParams) => {
  const { openDialogToApp } = useMwebToAppDialog();
  const deepLink = getAppLink(AppLinkTypes.HOME);

  const teaserQuery = useQuery(['SCHEDULE_TEASER', scheduleId], () => getTeaser({ scheduleId }), {
    select: toTeaserModel,
    cacheTime: 0,
  });

  /**
   * error data
   */
  const error = useMemo(
    () => ({
      error: teaserQuery.error,
      title: '일시적인 오류가 발생하였습니다',
      description: '잠시 후 다시 시도해주세요.',
      actionLabel: '다시 시도',
      onAction: () => teaserQuery?.refetch(),
    }),
    [teaserQuery],
  );

  /**
   * 라이브 알림신청/해제 이벤트 핸들러
   */
  const handleClickLiveFollow = () => {
    openDialogToApp(deepLink, {
      actionProps: {
        kind: AppPopupActionKind.LIVE_FOLLOW,
      },
    });
  };

  /**
   * 쇼룸 팔로우/언팔로우 이벤트핸들러
   */
  const handleClickBrandFollow = (params: BrandFollowParams) => {
    openDialogToApp(deepLink, {
      actionProps: {
        kind: params.state ? AppPopupActionKind.SHOWROOM_FOLLOW : AppPopupActionKind.SHOWROOM_FOLLOW_CANCEL,
      },
    });
  };

  return {
    error,
    data: teaserQuery.data,
    status: teaserQuery.status,
    handler: {
      changeLiveFollow: handleClickLiveFollow,
      changeBrandFollow: handleClickBrandFollow,
    },
  };
};
