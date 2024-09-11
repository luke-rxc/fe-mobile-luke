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
import { BrandSubscribeRequestParam, postBrandSubscribe, deleteBrandSubscribe, getBrandSubscribe } from '../apis';

const debug = createDebug('features:showroom:useBrandFollowService');

export interface UpdateMutationParams extends BrandSubscribeRequestParam {
  // Showroom Code
  code: string;
  // Showroom Name
  name: string;
}

export interface UpdateFollowParams extends UpdateMutationParams {
  /** Web인 경우 Dialog의 link */
  deepLink?: string;
  /** unfollow시 confirm 문구 */
  confirmMessages?: Pick<ConfirmParams, 'title' | 'message'>;
  /** 변경하고자 하는 follow 상태값 */
  state: boolean;
  /** unfollow시 confirm 사용 여부 */
  noUnfollowConfirmMessage?: boolean;
}

type OnMutate = Pick<UseMutationOptions<void, ErrorModel, UpdateMutationParams>, 'onMutate'>;

export interface BrandFollowServiceParams {
  followOnMutate?: OnMutate['onMutate'];
  unfollowOnMutate?: OnMutate['onMutate'];
  getfollowOnMutate?: OnMutate['onMutate'];
}

export const useBrandFollowService = (params?: BrandFollowServiceParams) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { openDialogToApp } = useMwebToAppDialog();
  const { confirm, showroomFollowStatusUpdated, signIn } = useWebInterface();

  /**
   * 브랜드 알림 신청
   */
  const follow = useMutation<boolean, ErrorModel, UpdateMutationParams>(
    ({ id }) => {
      // Mutation Variables로 code를 받기위한 code 파라미터 추가
      return postBrandSubscribe({ id });
    },
    {
      ...(params?.followOnMutate && { onMutate: params.followOnMutate }),
      onSuccess: (data, { id, code }) => {
        debug.log('follow success', id, code);

        // App인 경우 Web -> App Showroom Follow 정보 업데이트
        if (isApp) {
          showroomFollowStatusUpdated({ showroomList: [{ id, code, isFollowed: true }] });
        }
      },
      onError: (err) => {
        debug.log('follow error', err);
      },
    },
  );

  /**
   * 브랜드 알림 신청 삭제
   */
  const unfollow = useMutation<boolean, ErrorModel, UpdateMutationParams>(
    ({ id }) => {
      // Mutation Variables로 code를 받기위한 code 파라미터 추가
      return deleteBrandSubscribe({ id });
    },
    {
      ...(params?.unfollowOnMutate && { onMutate: params.unfollowOnMutate }),
      onSuccess: (data, { id, code }) => {
        debug.log('unfollow success', id, code);

        // App인 경우 Web -> App Showroom Follow 정보 업데이트
        if (isApp) {
          showroomFollowStatusUpdated({ showroomList: [{ id, code, isFollowed: false }] });
        }
      },
      onError: (err) => {
        debug.log('unfollow error', err);
      },
    },
  );

  /**
   * 브랜드 알림 상태 조회
   */
  const followState = useMutation<boolean, ErrorModel, UpdateMutationParams>(
    ({ id }) => {
      return getBrandSubscribe({ id });
    },
    {
      ...(params?.getfollowOnMutate && { onMutate: params.getfollowOnMutate }),
      onSuccess: (data, { id, code }) => {
        debug.log('get follow stage success', id, code, data);
      },
      onError: (err) => {
        debug.log('get follow stage success', err);
      },
    },
  );

  const updateFollow = useCallback(
    async (
      { deepLink = '', confirmMessages, id, code, name, state, noUnfollowConfirmMessage = false }: UpdateFollowParams,
      mutateOptions?: MutateOptions<boolean, ErrorModel, UpdateMutationParams>,
    ): Promise<void> => {
      if (!isApp) {
        openDialogToApp(deepLink, {
          actionProps: {
            kind: state ? AppPopupActionKind.SHOWROOM_FOLLOW : AppPopupActionKind.SHOWROOM_FOLLOW_CANCEL,
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
      if (
        !noUnfollowConfirmMessage &&
        !state &&
        !(await confirm(confirmMessages ?? { title: '팔로우를 해제할까요?' }))
      ) {
        return;
      }

      (state ? follow : unfollow).mutate({ id, code, name }, mutateOptions);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [follow.isLoading, unfollow.isLoading],
  );

  const getFollowState = useCallback(
    async (
      { id, code, name }: UpdateMutationParams,
      mutateOptions?: MutateOptions<boolean, ErrorModel, UpdateMutationParams>,
    ): Promise<void> => {
      followState.mutate({ id, code, name }, mutateOptions);
    },
    [followState],
  );

  return {
    isLoading: follow.isLoading || unfollow.isLoading,
    isSuccess: follow.isSuccess || unfollow.isSuccess,
    isError: follow.isError || unfollow.isLoading,
    updateFollow,
    getFollowState,
  };
};
