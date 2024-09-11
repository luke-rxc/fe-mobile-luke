/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { userAgent } from '@utils/ua';
import { isAppVersionLatestCheck } from '@utils/web2App';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useWebInterface } from '@hooks/useWebInterface';
import { useUpdateBrandFollow } from '@features/showroom/hooks';
import { useLiveFloatingService } from '@features/liveFloating/services';
import { useErrorService } from '@features/exception/services';
import { ShowroomQueryKeys } from '../constants';
import { toMergedDownloadCouponList } from '../models';
import { ShowroomSchema, CouponDownloadSchema } from '../schemas';
import type { ContentListProps, CouponListProps, ProfileProps } from '../components';
import { useMultipleCouponDownloadMutation, useSingleCouponDownloadMutation } from './mutations';
import { useShowroomFilterQuery, useShowroomQuery } from './queries';
import { useLogService } from './useLogService';
import { useSectionsService } from './useSectionsService';
import { useGoodsService } from './useGoodsService';
import { useReviewService } from './useReviewService';
import { useRegionShortcutsService } from './useRegionShortcutsService';
/**
 * Showroom Service
 */
export const useShowroomService = () => {
  const { code: showroomCode } = useParams<{ code: string }>();
  const { couponUpdated, showToastMessage } = useWebInterface();
  const logger = useLogService();
  const queryClient = useQueryClient();
  const { handleError } = useErrorService();

  const { isApp } = userAgent();
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const reviewActiveFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.TICKET_GOODS_REVIEW);
  const isAvailableRegionFeature = !isApp || isAppVersionLatestCheck('1.42.0');

  /**
   * 쇼룸 정보 조회 Query
   */
  const showroomQuery = useShowroomQuery({ showroomCode });

  const showroomId = showroomQuery.data?.id ?? 0;
  const showroomName = showroomQuery.data?.name ?? '';
  const showroomType = showroomQuery.data?.type ?? 'NORMAL';

  /**
   * 일반 쇼룸 상품 리스트 조회 Service
   */
  const { goods } = useGoodsService({
    showroomCode,
    showroomId,
    showroomName,
    showroomType,
  });

  /** 일반 쇼룸 상품 리스트 Filter 조회 Query */
  const showroomFilterQuery = useShowroomFilterQuery({
    showroomCode,
    showroomId,
    showroomType,
  });

  /**
   * 콘셉트 쇼룸 섹션 리스트 조회 Service
   */
  const { sections } = useSectionsService({
    showroomCode,
    showroomId,
    showroomName,
    showroomType,
    initialData: showroomQuery.data?._sections,
  });

  /**
   * 리뷰 섹션(피드) 리스트 조회 Service
   */
  const { reviews } = useReviewService({
    showroomCode,
    showroomId,
    showroomName,
    enabled: reviewActiveFeatureFlag && !!showroomCode && !!showroomId && !!showroomName,
  });

  /**
   * 지역 숏컷 조회 Service
   */
  const { regionShortcuts } = useRegionShortcutsService({
    showroomCode,
    showroomId,
    showroomName,
    enabled: isAvailableRegionFeature && !!showroomId && showroomQuery.data?.isVisibleRegionShortcut,
    // enabled: !!showroomId && showroomQuery.data?.isVisibleRegionShortcut,
  });

  /**
   * 다건 쿠폰 다운로드 Mutation
   */
  const couponDownloadMutation = useMultipleCouponDownloadMutation({
    onSuccess: ({ downloadedCouponList, message }, { couponIds }) => {
      updateCouponList(downloadedCouponList, couponIds, message);
    },
    onError: (error) => {
      handleError({ error });
    },
  });

  /**
   * 단건 쿠폰 다운로드 Mutation
   */
  const singleCouponDownloadMutation = useSingleCouponDownloadMutation({
    onSettled: (data, error, { couponId }) => {
      updateCouponList(data?.coupon ? [data.coupon] : [], [couponId], error?.data?.message);
    },
  });

  /**
   * 쇼룸 팔로우/언팔로우 hooks
   */
  const follower = useUpdateBrandFollow();

  /**
   * 라이브 스낵바 hooks
   */
  const liveSnackbar = useLiveFloatingService({
    liveId: showroomQuery.data?.liveId || null,
    enabled: !!(showroomQuery.data?.onAir && showroomQuery.data?.liveId),
  });

  /**
   * 쿠폰 데이터 업데이트
   */
  const updateCouponList = (downloadedCouponList: CouponDownloadSchema[], couponIds: number[], message?: string) => {
    const queryKey = ShowroomQueryKeys.showroomInfo({ showroomCode });
    const cachedShowroomInfo = queryClient.getQueryData<ShowroomSchema>(queryKey);

    // 쿠폰데이터 업데이트
    cachedShowroomInfo &&
      queryClient.setQueryData<ShowroomSchema>(queryKey, {
        ...cachedShowroomInfo,
        couponList: toMergedDownloadCouponList(cachedShowroomInfo.couponList, downloadedCouponList, couponIds),
      });

    if (message) {
      showToastMessage({ message });
    }

    if (downloadedCouponList.length) {
      logger.logCouponDownload(downloadedCouponList);
      couponUpdated(); // app 동기화
    }
  };

  /**
   * 프로필 클릭 이벤트 핸들러
   */
  const handleClickProfileLink: ProfileProps['onClickProfileLink'] = () => {
    const { id, name, onAir = false, liveId } = showroomQuery.data || {};

    if (id && name) {
      logger.logProfileTab({ showroomId: id, showroomName: name, onAir, liveId });
      liveId && liveSnackbar.handleRemoveLiveFloating(liveId);
    }
  };

  /**
   * 쇼룸 팔로우/언팔로우 이벤트 핸들러
   */
  const handleUpdateFollow: ProfileProps['onClickFollow'] = (item) => {
    const { id, code, name, follow } = item;
    const changeFollow = !follow;
    follower.onChangeBrandFollow(
      { id, code, name, state: changeFollow },
      {
        onSuccess: () => {
          logger.logShowroomChangeFollow({ showroomId: id, showroomName: name, follow: changeFollow });
          showroomQuery.refetch();
        },
      },
    );
  };

  /**
   * 쇼룸 정보란의 링크 요소 클릭 이벤트 핸들러
   */
  const handelClickDescriptionLink: ProfileProps['onClickDescriptionLink'] = (_, item) => {
    logger.logDescriptionLinkTab({ url: item });
  };

  /**
   * 쇼룸 콘텐츠 전체보기 이벤트 핸들러
   */
  const handleClickContentMore: ContentListProps['onClickSectionLink'] = () => {
    const { id, name } = showroomQuery.data || {};

    if (id && name) {
      logger.logContentMoreTab({ showroomId: id, showroomName: name });
    }
  };

  /**
   * 쇼룸 콘텐츠 아이템 클릭 이벤트 핸들러
   */
  const handleClickContent: ContentListProps['onClickContentLink'] = (_, item) => {
    const { id, name } = showroomQuery?.data || {};

    if (id && name) {
      logger.logContentTab(item, id, name);
    }
  };

  /**
   * 쿠폰 다운로드 이벤트 핸들러
   */
  const handleCouponDownload: CouponListProps['onClickDownload'] = (_, item) => {
    const { downloadableCoupons } = item;

    if (downloadableCoupons) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      downloadableCoupons.length === 1
        ? singleCouponDownloadMutation.mutate({ couponId: downloadableCoupons[0].id })
        : couponDownloadMutation.mutate({ couponIds: downloadableCoupons.map(({ id }) => id) });
    }
  };

  /**
   * 쇼룸 지도 클릭 이벤트 핸들러
   */
  const handleClickMap = () => {
    logger.logShowroomTabMap({ showroomId: showroomId.toString(), showroomName });
  };

  /**
   * 쇼룸 지도 주소 복사 이벤트 핸들러
   */
  const handleClickCopy = () => {
    logger.logShowroomTabAddressCopy({ showroomId: showroomId.toString(), showroomName });
  };

  /**
   * 라이브 플로팅 show/hide
   */
  useEffect(() => {
    let timeoutId: number;

    if (liveSnackbar.live && !liveSnackbar.isFloatingLivePlayer) {
      timeoutId = window.setTimeout(() => liveSnackbar.handleLiveFloating(), 1000);
    }

    return () => {
      clearTimeout(timeoutId);
      liveSnackbar.handleCloseWebLiveFloating();
    };
  }, [liveSnackbar.live, showroomQuery.data?.onAir, showroomQuery.data?.liveId]);

  /**
   * 쇼룸 초기 진입시 데이터 로깅 처리
   */
  useEffect(() => {
    !showroomQuery.isLoading && showroomQuery.data && logger.logShowroomInit(showroomQuery.data);
  }, [showroomQuery.isLoading]);

  return {
    /** 쇼룸 정보 */
    showroom: {
      type: showroomQuery.data?.type,
      name: showroomQuery.data?.name,
      logoURL: showroomQuery.data?.logoURL,
      colors: showroomQuery.data?.colors,
      error: showroomQuery.error,
      status: showroomQuery.status,
    },

    /** 커버 Props */
    cover: showroomQuery.data?.cover,

    /** 프로필 Props */
    profile: showroomQuery.data && {
      ...showroomQuery.data.profile,
      onClickFollow: handleUpdateFollow,
      onClickProfileLink: handleClickProfileLink,
      onClickDescriptionLink: handelClickDescriptionLink,
    },

    /** 쿠폰 Props */
    coupon: showroomQuery.data && {
      ...showroomQuery.data.coupon,
      onClickDownload: handleCouponDownload,
    },

    /** 콘텐츠 Props */
    content: showroomQuery.data && {
      ...showroomQuery.data.content,
      onClickSectionLink: handleClickContentMore,
      onClickContentLink: handleClickContent,
    },

    /** 상품 Props */
    goods,

    /** 섹션 Props */
    sections,

    /** 리뷰 Props */
    reviews,

    /** SEO Props */
    seo: showroomQuery.data?.seo,

    /** 티켓 상품 정보 & 지도 props */
    accom: showroomQuery.data?.accom && {
      ...showroomQuery.data?.accom,
      onClickMap: handleClickMap,
      onClickCopy: handleClickCopy,
    },

    /** 지역 숏것 props */
    regionShortcuts,

    /** 상품 Filter & Sorting Props */
    filterList: showroomFilterQuery.data?.categoryFilter,
    sortingOptions: showroomFilterQuery.data?.sort,
  };
};
