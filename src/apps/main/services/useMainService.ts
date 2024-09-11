/* eslint-disable react-hooks/exhaustive-deps */
import isEmpty from 'lodash/isEmpty';
import { createElement, useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useModal } from '@hooks/useModal';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useUpdateLiveFollow } from '@features/live/hooks';
import { useUpdateBrandFollow } from '@features/showroom/hooks';
import { TeaserModalContainer as teaserModal } from '@features/schedule/containers';
import {
  BannerQueryKey,
  ShortcutQueryKey,
  CategoryShortcutQueryKey,
  FeedQueryKeys,
  LoadMoreFeedSize,
} from '../constants';
import { PickFunctionProperty } from '../types';
import { getBannerList, getShortcutList, getCategoryShortcutList, getFeedList } from '../apis';
import {
  toBannerListModel,
  toShortcutListModel,
  toCategoryShortcutListMode,
  toFeedListModel,
  BannerListModel,
  FeedListModel,
  ShortcutListModel,
  CategoryShortcutListModel,
} from '../models';
import { useAppBannerService } from './useAppBannerService';
import { useLogService } from './useLogService';

/**
 * 메인 피드 리스트 Service
 */
export const useMainService = () => {
  const logger = useLogService();

  const { isApp } = useDeviceDetect();
  const { openModal } = useModal();
  const { onChangeLiveFollow } = useUpdateLiveFollow();
  const { onChangeBrandFollow } = useUpdateBrandFollow();

  const bannerQuery = useQuery(BannerQueryKey, getBannerList, { select: toBannerListModel });
  const shortcutQuery = useQuery(ShortcutQueryKey, getShortcutList, { select: toShortcutListModel });

  const categoryShortcutQuery = useQuery(CategoryShortcutQueryKey, getCategoryShortcutList, {
    onSuccess: logger.logCategoryShortcutImpression,
    select: toCategoryShortcutListMode,
  });

  const feedQuery = useInfiniteQuery(
    FeedQueryKeys,
    ({ pageParam: nextParameter }) => getFeedList({ size: LoadMoreFeedSize, nextParameter }),
    {
      select: ({ pages, ...params }) => ({ pages: toFeedListModel(pages), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  /**
   * 홈 화면 활성화시 랜딩 배너 활성화
   */
  useAppBannerService({
    enabled: bannerQuery.isSuccess && feedQuery.isSuccess && !shortcutQuery.isLoading && !isApp,
  });

  /**
   * 배너 관련 이벤트 핸들러
   */
  const bannerHandlers: PickFunctionProperty<BannerListModel> = {
    onViewBanner: logger.logBannerView,
    onClickBannerLink: logger.logBannerTab,
    onClickProfileLink: logger.logBannerShowroomTab,
  };

  /**
   * 숏컷 관련 이벤트 핸들러
   */
  const shortcutHandlers: PickFunctionProperty<ShortcutListModel> = {
    onClickShortcutLink: logger.logShortcutTab,
  };

  /**
   * 숏컷 관련 이벤트 핸들러
   */
  const categoryShortcutHandlers: PickFunctionProperty<CategoryShortcutListModel> = {
    onClickCategoryShortcutLink: logger.logCategoryShortcutTab,
  };

  /**
   * 피드 아이템을 추가 표시
   */
  const handleMoreLoadFeed = () => {
    feedQuery.fetchNextPage();
  };

  /**
   * 섹션(피드아이템)이 화면에 보여질때 실행할 이벤트 핸들러
   */
  const handleVisibilityFeed: FeedListModel['onVisibility'] = (feed) => {
    logger.logSectionView(feed);
  };

  /**
   * 전체 보기 클릭시 실행할 이벤트 핸들러
   */
  const handleCliCkMoreView: FeedListModel['onClickMoreView'] = (e, feed) => {
    feed?.sectionLink && logger.logSectionMoreTab(feed);
  };

  /**
   * 상품 컴포넌트에 전달될 핸들러를 생성
   */
  const getGoodsFeedHandlers: FeedListModel['goodsHandlers'] = (feed) => (goods) => ({
    onClick: () => logger.logSectionGoodsTab(feed, goods),
  });

  /**
   * 콘텐츠 컴포넌트에 전달될 핸들러를 생성
   */
  const getContentFeedHandlers: FeedListModel['contentHandlers'] = (feed) => (content) => ({
    onClick: () => logger.logSectionContentsTab(feed, content),
  });

  /**
   * 라이브 컴포넌트에 전달될 핸들러를 생성
   */
  const getLiveFeedHandlers: FeedListModel['liveHandlers'] = (feed) => (live) => ({
    onClickLink: (e, { onAir, scheduleId, landingType }) => {
      if (!isApp && !onAir && scheduleId && landingType === 'SCHEDULE_TEASER') {
        e.preventDefault();
        openModal({
          nonModalWrapper: true,
          render: (props) => createElement(teaserModal, { scheduleId: +scheduleId, ...props }),
        });
      }

      logger.logSectionLiveTab(feed, live);
    },
    onClickFollow: (follow, { liveId }) => {
      const changeFollow = !follow;
      const eventLogger = changeFollow ? logger.logSectionLiveOnNoti : logger.logSectionLiveOffNoti;

      liveId &&
        onChangeLiveFollow(
          { liveId, state: changeFollow },
          {
            onSuccess: () => {
              feedQuery.refetch();
              eventLogger(feed, live);
            },
          },
        );
    },
  });

  /**
   * 쇼룸(브랜드) 컴포넌트에 전달될 핸들러를 생성
   */
  const getShowroomFeedHandlers: FeedListModel['showroomHandlers'] = (feed) => (showroom) => ({
    // 브랜드 팔로우/언팔로우
    onClickFollow: ({ id, code, name, follow }) => {
      const changeFollow = !follow;
      const eventLogger = changeFollow ? logger.logSectionShowroomFollow : logger.logSectionShowroomUnfollow;

      onChangeBrandFollow(
        { id, code, name, state: changeFollow },
        {
          onSuccess: () => {
            feedQuery.refetch();
            eventLogger(feed, showroom);
          },
        },
      );
    },
    onClickLiveLink: () => {
      logger.logSectionShowroomTab(feed, showroom);
    },
    onClickShowroomLink: () => {
      logger.logSectionShowroomTab(feed, showroom);
    },
  });

  /**
   * 홈 진입시 이벤트 로깅
   */
  useEffect(() => {
    logger.logHomeView();
  }, []);

  /**
   * 숏컷 배너 노출시 이벤트 로깅
   */
  useEffect(() => {
    if (shortcutQuery.data && !isEmpty(shortcutQuery.data)) {
      logger.logShortcutView(shortcutQuery.data);
    }
  }, [shortcutQuery.data]);

  return {
    banner: bannerQuery,
    shortcut: shortcutQuery,
    categoryShortcut: categoryShortcutQuery,
    feed: { ...feedQuery, data: feedQuery.data?.pages || [] },
    bannerHandlers,
    shortcutHandlers,
    categoryShortcutHandlers,
    feedHandlers: {
      onVisibility: handleVisibilityFeed,
      onLoadMore: handleMoreLoadFeed,
      onClickMoreView: handleCliCkMoreView,
      liveHandlers: getLiveFeedHandlers,
      goodsHandlers: getGoodsFeedHandlers,
      contentHandlers: getContentFeedHandlers,
      showroomHandlers: getShowroomFeedHandlers,
    },
  };
};
