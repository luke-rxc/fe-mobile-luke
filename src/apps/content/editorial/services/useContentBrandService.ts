import { useCallback } from 'react';
import { useBrandFollowService } from '@features/showroom/services';
import { createDebug } from '@utils/debug';
import { emitSubscriptionStatusUpdated } from '@utils/webInterface';

const debug = createDebug();

/**
 * 컨텐츠 쇼룸 스낵바 기능
 */
export const useContentBrandService = ({
  deepLink,
  onUpdateBrandFollowSuccess,
  onUpdateBrandFollowFail,
  onGetBrandFollowSuccess,
}: {
  /** 컨텐츠 딥링크 */
  deepLink: string;
  /** 팔로우/언팔로우 완료 콜백 */
  onUpdateBrandFollowSuccess: (followState: boolean) => void;
  /** 팔로우/언팔로우 에러 콜백 */
  onUpdateBrandFollowFail: (followState: boolean) => void;
  /** 팔로우/언팔로우 상태조회 콜백 */
  onGetBrandFollowSuccess: (followState: boolean) => void;
}) => {
  /**
   * 브랜드 Follow 서비스
   */
  const { updateFollow: updateBrandFollow, getFollowState: getBrandFollowState } = useBrandFollowService({
    followOnMutate: ({ id, code }) => {
      debug.log('updateBrandFollow.followOnMutate');
      emitSubscriptionStatusUpdated({ showroomId: id, showroomCode: code, isSubscribed: true }, { onlyState: true });
    },
    unfollowOnMutate: ({ id, code }) => {
      debug.log('updateBrandFollow.unfollowOnMutate');
      emitSubscriptionStatusUpdated({ showroomId: id, showroomCode: code, isSubscribed: false }, { onlyState: true });
    },
  });

  const handleClickShowroomFollow = useCallback(
    ({ id, code, follow }: { id: number; code: string; follow: boolean }) => {
      const changeState = !follow;

      updateBrandFollow(
        { id, code, name: '', state: changeState, deepLink, noUnfollowConfirmMessage: true },
        {
          onSuccess: () => {
            debug.log('updateBrandFollow.onSuccess');
            onUpdateBrandFollowSuccess(changeState);
          },
          onError: (err) => {
            debug.log('updateBrandFollow.onError', err);

            const prevState = !changeState;
            onUpdateBrandFollowFail(prevState);
            // 오류 발생시 이전 상태로 전환
            emitSubscriptionStatusUpdated(
              { showroomId: id, showroomCode: code, isSubscribed: !changeState },
              { onlyState: true },
            );
          },
        },
      );
    },
    [deepLink, updateBrandFollow, onUpdateBrandFollowSuccess, onUpdateBrandFollowFail],
  );

  const handleGetShowroomFollow = useCallback(
    ({ id, code }: { id: number; code: string }) => {
      getBrandFollowState(
        { id, code, name: '' },
        {
          onSuccess: (state) => {
            debug.log('getBrandFollow.onSuccess');
            onGetBrandFollowSuccess(state);
          },
          onError: (err) => {
            debug.log('getBrandFollow.onError', err);
          },
        },
      );
    },
    [getBrandFollowState, onGetBrandFollowSuccess],
  );

  return {
    /** 쇼룸 구독 */
    handleClickShowroomFollow,
    handleGetShowroomFollow,
  };
};
