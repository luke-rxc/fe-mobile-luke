import { useEffect, useMemo } from 'react';
import { AppLinkTypes } from '@constants/link';
import { useBrandFollowService } from '@features/showroom/services';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { getAppLink } from '@utils/link';
import { useLiveFollowService } from '@features/live/services';
import { getAllSearchResult } from '../apis';
import { FilterSectionTypes, SearchQueryKeys } from '../constants';
import { toSearchAllModel } from '../models';
import { useLogService } from './useLogService';

const debug = createDebug();

export const useSearchResultService = ({ query }: { query: string }) => {
  const { showToastMessage, emitScheduleFollowStatusUpdated, emitShowroomFollowStatusUpdated } = useWebInterface();
  const tracking = useLogService();

  /**
   * 전체 검색 결과 조회
   */
  const { data, error, refetch, isError, isLoading, isFetching, isFetched, isSuccess } = useQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RESULT_ALL, query],
    () => getAllSearchResult({ query }),
    {
      select: (raw) => toSearchAllModel(raw, { query }),
    },
  );

  const isEmpty = useMemo(() => {
    if (!isSuccess || !data) {
      return false;
    }

    return Object.entries(data).reduce((acc, [, val]) => acc + val.length, 0) === 0;
  }, [data, isSuccess]);

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

          refetch();

          if (changeState) {
            tracking.logCompleteSectionShowroomFollow({
              section: 'ALL',
              showroomId: id,
              showroomName: name,
            });
          } else {
            tracking.logCompleteSectionShowroomUnfollow({
              section: 'ALL',
              showroomId: id,
              showroomName: name,
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
   * 브랜드 카드 Follow 변경시
   */
  const handleChangeBrandCardFollow = (params: { id: number; code: string; follow: boolean }) => {
    debug.log('handleChangeBrandCardFollow', params);

    refetch();
  };

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

          showToastMessage({ message: changeState ? '알림을 신청했습니다' : '알림을 해제했습니다' });
          refetch();

          const liveItemIndex = data?.live.findIndex((item) => item.scheduleId === scheduleId);
          const liveItem = data?.live.find((item) => item.scheduleId === scheduleId);

          if (!liveItemIndex || !liveItem) {
            return;
          }

          const logParams = {
            section: FilterSectionTypes.ALL,
            scheduleId,
            scheduleName: liveItem.title,
            scheduleIndex: liveItemIndex,
            liveId,
            showroomId: `${liveItem['data-log-showroom-id']}`,
            showroomName: liveItem['data-log-showroom-name'] ?? '',
          };

          if (changeState) {
            tracking.logCompleteSectionScheduleNotiOptIn(logParams);
          } else {
            tracking.logCompleteSectionScheduleNotiOptout(logParams);
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
   * 라이브 카드 Follow 변경시
   */
  const handleChangeLiveCardFollow = (id: number, isFollowed: boolean) => {
    debug.log('handleChangeLiveCardFollow', id, isFollowed);

    refetch();
  };

  // 검색 완료 로그 전송
  useEffect(() => {
    if (isFetched) {
      tracking.logViewInResult({
        query,
        section: 'ALL',
        goodsStatus: !!data?.goods.length,
        brandStatus: !!data?.brands.length,
        contentStatus: !!data?.content.length,
        liveStatus: !!data?.live.length,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isFetched]);

  return {
    // All
    data,
    error,
    refetch,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    isEmpty,

    // Brand Follow Handler
    handleClickBrandFollow,
    handleChangeBrandCardFollow,

    // Live Follow Handler
    handleClickLiveFollow,
    handleChangeLiveCardFollow,
  };
};
