import { useEffect, useState } from 'react';
import { useLiveFollowService } from '@features/live/services';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { getLiveSearchResult } from '../apis';
import { SearchQueryKeys } from '../constants';
import { toLiveSearchResultModel } from '../models';
import { useLogService } from './useLogService';

const debug = createDebug();

export const useSearchScheduleLiveService = ({ query }: { query: string }) => {
  const { emitScheduleFollowStatusUpdated } = useWebInterface();

  const { logLiveListViewPage, logLiveListCompleteScheduleNotiOptIn, logLiveListCompleteScheduleNotiOptOut } =
    useLogService();

  /**
   * 라이브 검색 결과 조회
   */
  const {
    data: live,
    error: liveError,
    refetch: liveRefetch,
    isError: isLiveError,
    isLoading: isLiveLoading,
    isFetching: isLiveFetching,
    isFetched: isLiveFetched,
    hasNextPage: hasMoreLive,
    fetchNextPage: handleLoadLive,
  } = useInfiniteQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RESULT_LIVE, query],
    ({ pageParam: nextParameter }) => getLiveSearchResult({ query, nextParameter }),
    {
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toLiveSearchResultModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  /**
   * 라이브 Follow 서비스
   */
  const { updateFollow: updateLiveFollow } = useLiveFollowService({
    followOnMutate: ({ liveId }) => {
      debug.log('updateLiveFollow.followOnMutate');

      emitScheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: true }, { onlyState: true });
    },
    unfollowOnMutate: ({ liveId }) => {
      debug.log('updateLiveFollow.unfollowOnMutate');

      emitScheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: false }, { onlyState: true });
    },
  });

  /**
   * 라이브 Follow 클릭
   */
  const handleClickLiveFollow = ({ liveId, scheduleId }: { liveId: number; scheduleId: number }, follow: boolean) => {
    const changeState = !follow;

    updateLiveFollow(
      { liveId, state: changeState },
      {
        onSuccess: () => {
          debug.log('updateLiveFollow.onSuccess');

          let logParams;

          setIsManualFetching(true);
          liveRefetch();

          const liveItemIndex = live?.pages.findIndex((item) => item.scheduleId === scheduleId);
          const liveItem = live?.pages.find((item) => item.scheduleId === scheduleId);

          if (liveItemIndex && liveItem) {
            logParams = {
              scheduleId: `${scheduleId}`,
              scheduleName: liveItem.title,
              scheduleIndex: liveItemIndex,
              liveId: `${liveId}`,
              showroomId: `${liveItem.showroomId}`,
              showroomName: liveItem.showroomName as string,
              query,
            };
          }

          if (changeState) {
            logParams && logLiveListCompleteScheduleNotiOptIn(logParams);
          } else {
            logParams && logLiveListCompleteScheduleNotiOptOut(logParams);
          }
        },
        onError: (err) => {
          debug.log('updateLiveFollow.onError', err);

          // 오류 발생시 이전 상태로 전환
          emitScheduleFollowStatusUpdated({ type: 'live', id: liveId, isFollowed: !changeState }, { onlyState: true });
        },
      },
    );
  };

  /**
   * 라이브 리스트 Follow 변경시
   */
  const handleChangeLiveListFollow = (id: number, isFollowed: boolean) => {
    debug.log('handleChangeLiveListFollow', id, isFollowed);

    setIsManualFetching(true);
    liveRefetch();
  };

  // 수동 Fetching 상태 여부
  const [isManualFetching, setIsManualFetching] = useState(false);

  useEffect(() => {
    isLiveFetched && setIsManualFetching(false);
  }, [isLiveFetched]);

  useEffect(() => {
    logLiveListViewPage({ query });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // state
    isManualFetching,

    // Live
    live: live?.pages,
    liveError,
    liveRefetch,
    isLiveError,
    isLiveLoading,
    isLiveFetching,
    isLiveFetched,
    hasMoreLive,
    handleLoadLive,

    // Live Follow Handler
    handleClickLiveFollow,
    handleChangeLiveListFollow,
  };
};
