import { useEffect, useState } from 'react';
import { AppLinkTypes } from '@constants/link';
import { useBrandFollowService } from '@features/showroom/services';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { getAppLink } from '@utils/link';
import { getShowRoomSearchResult } from '../apis';
import { SearchQueryKeys } from '../constants';
import { toShowroomSearchResultModel } from '../models';
import { useLogService } from './useLogService';

const debug = createDebug();

export const useSearchShowroomService = ({ query }: { query: string }) => {
  const { emitShowroomFollowStatusUpdated } = useWebInterface();

  const { logBrandsListViewPage, logBrandsListCompleteShowroomFollow, logBrandsListCompleteShowroomUnfollow } =
    useLogService();

  /**
   * 쇼룸 검색 결과 조회
   */
  const {
    data: showrooms,
    error: showroomsError,
    isError: isShowroomsError,
    isLoading: isShowroomsLoading,
    isFetching: isShowroomsFetching,
    isFetched: isShowroomsFetched,
    refetch: showroomsRefetch,
    hasNextPage: hasMoreShowrooms,
    fetchNextPage: handleLoadShowrooms,
  } = useInfiniteQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RESULT_SHOWROOMS, query],
    ({ pageParam: nextParameter }) => getShowRoomSearchResult({ query, nextParameter }),
    {
      select: ({ pages, ...rest }) => ({ pages: pages.flatMap(toShowroomSearchResultModel), ...rest }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  /**
   * 브랜드 Follow 서비스
   */
  const { updateFollow: updateBrandFollow } = useBrandFollowService({
    followOnMutate: ({ id, code }) => {
      debug.log('updateBrandFollow.followOnMutate');

      emitShowroomFollowStatusUpdated({ showroomList: [{ id, code, isFollowed: true, options: { onlyState: true } }] });
    },
    unfollowOnMutate: ({ id, code }) => {
      debug.log('updateBrandFollow.unfollowOnMutate');

      emitShowroomFollowStatusUpdated({
        showroomList: [{ id, code, isFollowed: false, options: { onlyState: true } }],
      });
    },
  });

  /**
   * 브랜드 Follow 클릭
   */
  const handleClickBrandFollow = ({
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
    const changeState = !follow;
    const deepLink = getAppLink(AppLinkTypes.SHOWROOM, { showroomCode: code });

    updateBrandFollow(
      { id, code, name, state: changeState, deepLink },
      {
        onSuccess: () => {
          debug.log('updateBrandFollow.onSuccess');

          setIsManualFetching(true);
          showroomsRefetch();

          if (changeState) {
            logBrandsListCompleteShowroomFollow({
              showroomId: `${id}`,
              showroomName: name,
              query,
            });
          } else {
            logBrandsListCompleteShowroomUnfollow({
              showroomId: `${id}`,
              showroomName: name,
              query,
            });
          }
        },
        onError: (err) => {
          debug.log('updateBrandFollow.onError', err);

          // 오류 발생시 이전 상태로 전환
          emitShowroomFollowStatusUpdated({
            showroomList: [{ id, code, isFollowed: !changeState, options: { onlyState: true } }],
          });
        },
      },
    );
  };

  /**
   * 브랜드 리스트 Follow 변경시
   */
  const handleChangeBrandListFollow = (followParams: { id: number; code: string; follow: boolean }) => {
    debug.log('handleChangeBrandListFollow', followParams);

    setIsManualFetching(true);
    showroomsRefetch();
  };

  // 수동 Fetching 상태 여부
  const [isManualFetching, setIsManualFetching] = useState(false);

  useEffect(() => {
    isShowroomsFetched && setIsManualFetching(false);
  }, [isShowroomsFetched]);

  useEffect(() => {
    logBrandsListViewPage({ query });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // state
    isManualFetching,

    // Showrooms
    showrooms: showrooms?.pages,
    showroomsError,
    isShowroomsError,
    isShowroomsLoading,
    isShowroomsFetching,
    isShowroomsFetched,
    showroomsRefetch,
    hasMoreShowrooms,
    handleLoadShowrooms,

    // Brand Follow Handler
    handleClickBrandFollow,
    handleChangeBrandListFollow,
  };
};
