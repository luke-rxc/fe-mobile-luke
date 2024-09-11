/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { MutateOptions } from 'react-query';
import { createDebug } from '@utils/debug';
import { ErrorModel } from '@utils/api/createAxios';
import { useWebInterface } from '@hooks/useWebInterface';
import { LiveFollowParams } from '../apis';
import { useLiveFollowService, LiveFollowServiceParams, UpdateFollowParams } from '../services';

const debug = createDebug('features/showroom:useUpdateLiveFollow');

export interface UseUpdateLiveFollowParams extends LiveFollowServiceParams {
  /**
   * webInterface에 subscribeSchedule state의 변화시
   * UI에 상태값만 변경할지 아니면 UI에 바인딩된 팔로우/업팔로에 관련 event들도 실행 시킬지 결정하는 옵션
   * @default true
   */
  onlyState?: boolean;
}

/**
 * useLiveFollowServiced와 emitScheduleFollowStatusUpdated webInterface를 결합한 Hooks
 */
export const useUpdateLiveFollow = (params?: UseUpdateLiveFollowParams) => {
  const { onlyState = true, followOnMutate, unfollowOnMutate } = params || {};
  const { emitScheduleFollowStatusUpdated } = useWebInterface();

  /**
   * Live Follow Service
   */
  const { updateFollow: updateLiveFollow, ...status } = useLiveFollowService({
    followOnMutate: ({ liveId }) => {
      debug.log('updateLiveFollow.followOnMutate');
      followOnMutate?.({ liveId });
      emitScheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: true }, { onlyState });
    },
    unfollowOnMutate: ({ liveId }) => {
      debug.log('updateLiveFollow.unfollowOnMutate');
      unfollowOnMutate?.({ liveId });
      emitScheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: false }, { onlyState });
    },
  });

  /**
   * 라이브 알림신청/해제 이벤트 핸들러
   */
  const handleChangeLiveFollow = useCallback(
    (
      { state, ...rest }: Omit<UpdateFollowParams, 'featureFlag'>,
      mutateOptions?: MutateOptions<void, ErrorModel, LiveFollowParams>,
    ) => {
      const { onSuccess, onError, ...restMutateOptions } = mutateOptions || {};
      updateLiveFollow(
        { state, ...rest },
        {
          ...(restMutateOptions || {}),
          onSuccess: (...args) => {
            debug.log('updateLiveFollow.onSuccess', ...args);
            // success cb
            onSuccess?.(...args);
          },
          onError: (error, variables, ...args) => {
            debug.log('updateLiveFollow.onError', error);
            // 오류 발생시 이전 상태로 전환
            emitScheduleFollowStatusUpdated({ type: 'live', id: variables.liveId, isFollowed: !state }, { onlyState });
            // error cb
            onError?.(error, variables, ...args);
          },
        },
      );
    },
    [],
  );

  return { onChangeLiveFollow: handleChangeLiveFollow, ...status };
};
