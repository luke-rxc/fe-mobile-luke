/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { MutateOptions } from 'react-query';
import { getAppLink } from '@utils/link';
import { createDebug } from '@utils/debug';
import { ErrorModel } from '@utils/api/createAxios';
import { AppLinkTypes } from '@constants/link';
import { useWebInterface } from '@hooks/useWebInterface';
import { useBrandFollowService, UpdateMutationParams, BrandFollowServiceParams, UpdateFollowParams } from '../services';

const debug = createDebug('features/showroom:useUpdateBrandFollow');

export interface UseUpdateBrandFollowParams extends BrandFollowServiceParams {
  /**
   * webInterface에 subscribeShowroom state의 변화시
   * UI에 상태값만 변경할지 아니면 UI에 바인딩된 팔로우/업팔로에 관련 event들도 실행 시킬지 결정하는 옵션
   * @default true
   */
  onlyState?: boolean;
}

/**
 * useBrandFollowService와 emitSubscriptionStatusUpdated webInterface를 결합한 Hooks
 */
export const useUpdateBrandFollow = (params?: UseUpdateBrandFollowParams) => {
  const { onlyState = true, followOnMutate, unfollowOnMutate } = params || {};
  const { emitShowroomFollowStatusUpdated } = useWebInterface();

  /**
   * Brand Follow Service
   */
  const { updateFollow: updateBrandFollow, ...status } = useBrandFollowService({
    followOnMutate: ({ id, code, ...rest }) => {
      debug.log('updateBrandFollow.followOnMutate');

      emitShowroomFollowStatusUpdated({
        showroomList: [{ id, code, isFollowed: true, options: { onlyState } }],
      });

      followOnMutate?.({ id, code, ...rest });
    },
    unfollowOnMutate: ({ id, code, ...rest }) => {
      debug.log('updateBrandFollow.unfollowOnMutate');

      emitShowroomFollowStatusUpdated({
        showroomList: [{ id, code, isFollowed: false, options: { onlyState } }],
      });

      unfollowOnMutate?.({ id, code, ...rest });
    },
  });

  /**
   * 쇼룸 팔로우/언팔로우 이벤트 핸들러
   */
  const handleChangeBrandFollow = useCallback(
    (
      { code, state, ...rest }: Omit<UpdateFollowParams, 'featureFlag'>,
      mutateOptions?: MutateOptions<boolean, ErrorModel, UpdateMutationParams>,
    ) => {
      const { onSuccess, onError, ...restMutateOptions } = mutateOptions || {};
      const deepLink = getAppLink(AppLinkTypes.SHOWROOM, { showroomCode: code });

      updateBrandFollow(
        { code, state, deepLink, ...rest },
        {
          ...(restMutateOptions || {}),
          onSuccess: (...args) => {
            debug.log('updateBrandFollow.onSuccess', ...args);

            // success cb
            onSuccess?.(...args);
          },
          onError: (error, variables, ...args) => {
            debug.log('updateBrandFollow.onError', error);

            // 오류 발생시 이전 상태로 전환
            emitShowroomFollowStatusUpdated({
              showroomList: [
                {
                  id: variables.id,
                  code: variables.code,
                  isFollowed: !state,
                  options: { onlyState },
                },
              ],
            });

            // 에러 콜백
            onError?.(error, variables, ...args);
          },
        },
      );
    },
    [],
  );

  return { onChangeBrandFollow: handleChangeBrandFollow, ...status };
};
