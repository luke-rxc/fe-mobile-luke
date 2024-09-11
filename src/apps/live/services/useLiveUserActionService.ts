import { AppLinkTypes } from '@constants/link';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { getAppLink } from '@utils/link';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { useMutation, useQueryClient } from 'react-query';
import { deleteLiveFollow, getShowroomSubscribe, postLiveFollow, postShowroomSubscribe } from '../apis';
import { LiveActionType, LogEventTypes, scheduleModalQueryKey } from '../constants';
import { ReturnTypeUseShowroomFollow } from '../hooks';
import { ScheduleItemModel, ShowroomSimpleModel } from '../models';
import { LiveActionProps } from '../types';
import { ReturnTypeUseLiveLogService } from './useLogService';

export type ReturnTypeUseLiveUserActionService = ReturnType<typeof useLiveUserActionService>;

interface Props {
  liveId: number;
  isLogin: boolean;
  logService: ReturnTypeUseLiveLogService;
  showroomList: Array<ShowroomSimpleModel>;
  handleLogin: () => Promise<boolean>;
  handlePendingFollowEndTimer: ReturnTypeUseShowroomFollow['handlePendingFollowEndTimer'];
  handlePendingCancelFollowEndTimer: ReturnTypeUseShowroomFollow['handlePendingCancelFollowEndTimer'];
  handleUpdateFollowStatus: ReturnTypeUseShowroomFollow['handleUpdateFollowStatus'];
}

export const debug = createDebug();

/**
 * 라이브 사용자 action service
 */
export const useLiveUserActionService = ({
  liveId,
  isLogin,
  showroomList,
  logService: {
    logLiveTabModalScheduleMore: handleLogLiveTabModalScheduleMore,
    logLiveTabFollowRequestShowroom: handleLogLiveTabFollowRequestShowroom,
    logLiveCompleteScheduleNotiOptIn: handleLogLiveCompleteScheduleNotiOptIn,
    logLiveCompleteScheduleNotiOptOut: handleLogLiveCompleteScheduleNotiOptOut,
    logLiveTabToAppBanner: handleLogLiveTabToAppBanner,
    logLiveTabPurchaseVerification: handleLogLiveTabPurchaseVerification,
  },
  handleLogin,
  handlePendingFollowEndTimer,
  handlePendingCancelFollowEndTimer,
}: Props) => {
  const { openDialogToApp } = useMwebToAppDialog();
  const queryClient = useQueryClient();
  const { showToastMessage, confirm } = useWebInterface();

  const follow = useMutation((id: number) => postLiveFollow(id));
  const unfollow = useMutation((id: number) => deleteLiveFollow(id));
  const showroomSubscribe = useMutation((id: number) => postShowroomSubscribe(id));
  const showroomSubscribeInfo = useMutation((id: number) => getShowroomSubscribe(id));

  /**
   * 팔로우 변경 요청
   */
  const requestChangeFollow = async (id: number, followed: boolean, targetScheduleItem: ScheduleItemModel) => {
    try {
      if (followed) {
        if (await confirm({ title: '알림을 해제하시겠습니까?' })) {
          await unfollow.mutateAsync(id);
          handleLogLiveCompleteScheduleNotiOptOut(targetScheduleItem);
          return !followed;
        }
      } else {
        await follow.mutateAsync(id);
        handleLogLiveCompleteScheduleNotiOptIn(targetScheduleItem);
        return !followed;
      }
    } catch (error) {
      debug.error(error);
    }
    return followed;
  };

  /**
   * 라이브 알림 toggle
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleLiveFollow = async (scheduleId: number) => {
    const scheduleItems = queryClient.getQueryData<Array<ScheduleItemModel>>([scheduleModalQueryKey]);
    const targetScheduleItem = scheduleItems?.find((item) => item.id === scheduleId);

    if (!targetScheduleItem) {
      return;
    }

    const {
      liveSchedule: {
        isFollowed,
        live: { id },
      },
    } = targetScheduleItem;

    const followed = await requestChangeFollow(id, isFollowed, targetScheduleItem);

    if (isFollowed === followed) {
      return;
    }

    queryClient.setQueryData(
      [scheduleModalQueryKey],
      scheduleItems?.map((scheduleItem) => {
        if (scheduleItem.id === scheduleId) {
          return {
            ...scheduleItem,
            liveSchedule: {
              ...scheduleItem.liveSchedule,
              isFollowed: !isFollowed,
            },
          };
        }
        return scheduleItem;
      }),
    );

    showToastMessage(
      {
        message: targetScheduleItem?.liveSchedule.isFollowed ? '해제되었습니다' : '신청되었습니다',
      },
      { autoDismiss: 2000, direction: 'bottom' },
    );
  };

  /**
   * 쇼룸 구독 요청
   */
  const openDialogToAppShowroomSubscribe = (isShowroomSubscribe: boolean) => {
    openDialogToApp(getAppLink(AppLinkTypes.LIVE, { liveId }), {
      actionProps: {
        kind: isShowroomSubscribe ? AppPopupActionKind.SHOWROOM_FOLLOW_CANCEL : AppPopupActionKind.SHOWROOM_FOLLOW,
      },
    });
  };

  const handleRequestShowroomSubscribe = async (showroomId?: number) => {
    if (!isLogin || !showroomId) {
      openDialogToAppShowroomSubscribe(false);
      return;
    }

    const isShowroomSubscribe = await showroomSubscribeInfo.mutateAsync(showroomId);
    try {
      openDialogToAppShowroomSubscribe(isShowroomSubscribe);
    } catch (e) {
      openDialogToAppShowroomSubscribe(false);
    }
  };

  /**
   * 쇼룸 팔로우 요청 모달 프로필 탭
   */
  const handleTabShowroomProfile = (showroomId: number) => {
    const showroomInfo = showroomList.find((showroom) => showroom.id === showroomId);
    if (showroomInfo) {
      handleLogLiveTabFollowRequestShowroom(showroomInfo);
    } else {
      debug.error('LogLiveTabFollowRequestShowroom:: 쇼룸정보 없음');
    }
  };

  /**
   * 사용자 로그인
   */
  const handleRequestLogin = async (actionType: LiveActionType) => {
    if (actionType === LiveActionType.SHOWROOM_FOLLOW) {
      handlePendingFollowEndTimer();
      const result = await handleLogin();
      handlePendingCancelFollowEndTimer();
      return result;
    }
    return handleLogin();
  };

  /**
   * 사용자 액션
   */
  const handleAction = (actionType: LiveActionType, actionProps?: LiveActionProps) => {
    return async (event?: React.MouseEvent) => {
      event?.stopPropagation();

      const { showroomId, logName } = actionProps ?? {};

      // 로그인 체크가 필요한 항목인지 확인
      const isLoginCheck = actionType === LiveActionType.LIVE_CHAT;

      if (isLoginCheck && !isLogin) {
        handleRequestLogin(actionType);
        return;
      }

      switch (actionType) {
        case LiveActionType.LIVE_CHAT:
          openDialogToApp(getAppLink(AppLinkTypes.LIVE, { liveId }), {
            actionProps: {
              kind: AppPopupActionKind.LIVE_AUCTION,
            },
          });
          break;

        case LiveActionType.LIVE_AUCTION:
          if (logName === LogEventTypes.LogLiveTabToAppBanner) {
            handleLogLiveTabToAppBanner();
          }
          openDialogToApp(getAppLink(AppLinkTypes.LIVE, { liveId }), {
            actionProps: {
              kind: AppPopupActionKind.LIVE_AUCTION,
            },
          });
          break;

        case LiveActionType.LIVE_SCHEDULE_ALL:
          openDialogToApp(getAppLink(AppLinkTypes.SCHEDULE));
          handleLogLiveTabModalScheduleMore();
          break;

        case LiveActionType.LIVE_FOLLOW:
          openDialogToApp(getAppLink(AppLinkTypes.SCHEDULE_LIVE), {
            actionProps: {
              kind: AppPopupActionKind.LIVE_FOLLOW,
            },
          });
          break;

        case LiveActionType.SHOWROOM_FOLLOW:
          handleRequestShowroomSubscribe(showroomId);
          break;

        case LiveActionType.TAB_SHOWROOM_FOLLOW:
          showroomId && handleTabShowroomProfile(showroomId);
          break;

        case LiveActionType.TAB_PURCHASE_VERIFICATION:
          openDialogToApp(getAppLink(AppLinkTypes.LIVE, { liveId }));
          handleLogLiveTabPurchaseVerification();
          break;

        default:
          break;
      }
    };
  };

  return { showroomFollowLoading: showroomSubscribe.isLoading, handleAction };
};
