import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useBrandFollowService } from '@features/showroom/services';
import { emitSubscriptionStatusUpdated } from '@utils/webInterface';
import { getFollowingList } from '../apis';
import { toFollowingListModel } from '../models';
import { followingQueryKey } from '../constants';

export const useFollowService = () => {
  /**
   * 구독 중인 쇼룸 목록 조회
   */
  const {
    data,
    error: followingError,
    isError: isFollowingError,
    isLoading: isFollowingLoading,
    isFetching: isFollowingFetching,
    hasNextPage: hasMoreFollowing,
    fetchNextPage: handleLoadFollowing,
  } = useInfiniteQuery(followingQueryKey, ({ pageParam: nextParameter }) => getFollowingList({ nextParameter }), {
    select: ({ pages, pageParams }) => {
      return { pages: pages.flatMap(toFollowingListModel), pageParams };
    },
    getNextPageParam: ({ nextParameter }) => nextParameter,
    refetchOnMount: true,
  });

  /**
   * 쇼룸 팔로우/언팔로우 mutation
   */
  const { updateFollow } = useBrandFollowService({
    followOnMutate: ({ id, code }) => {
      emitSubscriptionStatusUpdated({ showroomId: id, showroomCode: code, isSubscribed: true });
    },
    unfollowOnMutate: ({ id, code }) => {
      emitSubscriptionStatusUpdated({ showroomId: id, showroomCode: code, isSubscribed: false });
    },
  });

  /**
   * 쇼룸 구독 상태 업데이트
   */
  const handleUpdateFollow = ({
    id,
    code,
    name,
    follow,
  }: {
    id: number;
    code: string;
    name: string;
    follow: boolean;
  }) => {
    /**
     * 상태값(state)에 따라 follow, unfollow mutation 함수 실행
     */
    const changeState = !follow;
    updateFollow(
      { id, code, name, state: changeState },
      {
        onError: () => {
          /**
           * 응답 실패 시, 팔로잉 상태값 원복
           */
          emitSubscriptionStatusUpdated({
            showroomId: id,
            showroomCode: code,
            isSubscribed: !changeState,
          });
        },
      },
    );
  };

  return {
    followingList: data?.pages || [],
    followingError,
    isFollowingError,
    isFollowingLoading,
    isFollowingFetching,
    hasMoreFollowing,
    handleLoadFollowing,
    handleUpdateFollow,
  };
};
