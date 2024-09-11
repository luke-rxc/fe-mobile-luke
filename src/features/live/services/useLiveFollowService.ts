import { useCallback } from 'react';
import type { UseMutationOptions, MutateOptions } from 'react-query';
import { useAuth } from '@hooks/useAuth';
import { useMutation } from '@hooks/useMutation';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { ErrorModel } from '@utils/api/createAxios';
import { createDebug } from '@utils/debug';
import type { ConfirmParams } from '@utils/webInterface';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { LiveFollowParams, updateLiveFollow, deleteLiveFollow } from '../apis';

const debug = createDebug('features:live:useLiveFollowService');

export interface UpdateFollowParams extends LiveFollowParams {
  /** Web인 경우 Dialog의 link */
  deepLink?: string;
  /** unfollow시 confirm 문구 */
  confirmMessages?: Pick<ConfirmParams, 'title' | 'message'>;
  /** 변경하고자 하는 follow 상태값 */
  state: boolean;
}

type OnMutate = Pick<UseMutationOptions<void, ErrorModel, LiveFollowParams>, 'onMutate'>;

export interface LiveFollowServiceParams {
  followOnMutate?: OnMutate['onMutate'];
  unfollowOnMutate?: OnMutate['onMutate'];
}

export const useLiveFollowService = (params?: LiveFollowServiceParams) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { openDialogToApp } = useMwebToAppDialog();
  const { confirm, scheduleFollowStatusUpdated, signIn } = useWebInterface();

  /**
   * 라이브 방송 알림 신청
   */
  const follow = useMutation<void, ErrorModel, LiveFollowParams>(updateLiveFollow, {
    ...(params?.followOnMutate && { onMutate: params.followOnMutate }),
    onSuccess: (data, { liveId }) => {
      debug.log('follow success', liveId);

      // Web -> App Schedule Follow 정보 업데이트
      isApp && scheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: true });
    },
    onError: (err) => {
      debug.log('follow error', err);
    },
  });

  /**
   * 라이브 방송 알림 신청 삭제
   */
  const unfollow = useMutation<void, ErrorModel, LiveFollowParams>(deleteLiveFollow, {
    ...(params?.unfollowOnMutate && { onMutate: params.unfollowOnMutate }),
    onSuccess: (data, { liveId }) => {
      debug.log('unfollow success', liveId);

      // Web -> App Schedule Follow 정보 업데이트
      isApp && scheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: false });
    },
    onError: (err) => {
      debug.log('unfollow error', err);
    },
  });

  const updateFollow = useCallback(
    async (
      { deepLink = '', confirmMessages, liveId, state }: UpdateFollowParams,
      mutateOptions?: MutateOptions<void, ErrorModel, LiveFollowParams>,
    ): Promise<void> => {
      if (!isApp) {
        openDialogToApp(deepLink, {
          actionProps: {
            kind: AppPopupActionKind.LIVE_FOLLOW,
          },
        });
        return;
      }

      // 비로그인 사용자가 로그인을 취소하는 경우
      if (!getIsLogin() && !(await signIn())) {
        return;
      }

      // 요청중인 경우 중단
      if (follow.isLoading || unfollow.isLoading) {
        return;
      }

      // unfollow 요청인 경우 confirm 승인이 아닌 경우
      if (!state && !(await confirm(confirmMessages ?? { title: '알림을 해제할까요?' }))) {
        return;
      }

      (state ? follow : unfollow).mutate({ liveId }, mutateOptions);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [follow.isLoading, unfollow.isLoading],
  );

  return {
    isLoading: follow.isLoading || unfollow.isLoading,
    isSuccess: follow.isSuccess || unfollow.isSuccess,
    isError: follow.isError || unfollow.isLoading,
    updateFollow,
  };
};
