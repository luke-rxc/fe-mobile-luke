import isEmpty from 'lodash/isEmpty';
import { GoodsKind } from '@constants/goods';
import { useLiveFloatingService } from '@features/liveFloating/services';

import { ReloadInfoType, ContentListLimit, FeedItemLimit } from '../constants';

import { useGoodsPageInfo } from '../hooks';

/** Import Service */
import { useWishService } from './useWishService';
import { useCouponService } from './useCouponService';
import { useLinkService } from './useLinkService';
import { useOptionService } from './useOptionService';
import { useShowroomDealService } from './useShowroomDealService';
import { useShowroomContentService } from './useShowroomContentService';
import { useBaseInfoLoadService } from './useBaseInfoLoadService';
import { useHistorySaveService } from './useHistorySaveService';
import { useCtaService } from './useCtaService';
import { useLogService } from './useLogService';
import { useNotificationService } from './useNotificationService';
import { useReviewService } from './useReviewService';
import { useReloadService } from './useReloadService';
import { useInitService } from './useInitService';
import { useRecommendationService } from './useRecommendationService';
import { useDrawerModalService } from './useDrawerModalService';
import { useSalesSchedulerService } from './useSalesSchedulerService';

export const useGoodsService = () => {
  const logService = useLogService();
  const {
    logGoodsInit: handleLogGoodsInit,
    logTabPriceList: handleLogTabPriceList,
    logPurchaseTab: handleLogPurchaseTab,
    logAddToWish: handleLogAddToWish,
    logCompleteSalesNotificationIn: handleLogCompleteSalesNotificationIn,
    logCompleteSalesNotificationOut: handleLogCompleteSalesNotificationOut,
    logTabQnA: handleLogTabQnA,
    logCompleteCouponDownload: handleLogCompleteCouponDownload,
    logViewIdentifyAdult: handleLogViewIdentifyAdult,
    logCompleteIdentifyAdult: handleLogCompleteIdentifyAdult,
    logAddToCart: handleLogAddToCart,
    logTabToCheckout: handleLogTabToCheckout,
    logShowroomTabOnBottom: handleLogShowroomTabOnBottom,
    logCloseOptionModal: handleCloseOptionModal,
  } = logService;
  // Page id parser
  /** @todo 추후 테스트 코드 삭제 */
  const { goodsId: reqGoodsId, isInLivePage } = useGoodsPageInfo();

  /** Service: 최근 본 상품 저장 */
  const { historySaveMutate } = useHistorySaveService();

  /** Service: 상품상세 리스트 로드 */
  const {
    detailGoods,
    showRoom,
    header,
    bannerList,
    option,
    liveId,
    isAuctionType,
    isOndaDeal,
    isGoodsLoading,
    isGoodsError,
    goodsError,
  } = useBaseInfoLoadService();

  /** Service: Link 연결 */
  const { handleCouponLink, handleQnaLink } = useLinkService({
    onLogTabQnA: handleLogTabQnA,
  });

  /** Service: Drawer Modal */
  const { handlePriceListOpen } = useDrawerModalService({
    goodsId: reqGoodsId,
    onLogTabPriceList: handleLogTabPriceList,
  });

  /** Service: Wish List */
  const { hasWishItem, isWishInfoLoading, handleUpdateWish, handleReloadWish } = useWishService({
    onReload: () => handleReloadInWebview(ReloadInfoType.WISH),
    onLogAddToWish: handleLogAddToWish,
  });

  /** Service: Coupon List */
  const {
    coupon,
    isCouponActive,
    isCouponLoading,
    isCouponError,
    couponError,
    isUserCouponDownloaded,
    handleCouponDownload,
    handleReloadCoupon,
  } = useCouponService({
    showRoomId: showRoom?.id ?? 0,
    isAuctionType,
    onReload: () => handleReloadInWebview(ReloadInfoType.COUPON),
    onLogCompleteCouponDownload: handleLogCompleteCouponDownload,
  });

  /** Service: Live Info */
  const {
    live,
    isLiveLoading,
    isFloatingLivePlayer,
    handleLiveFloating,
    handleCloseWebLiveFloating,
    handleRemoveLiveFloating,
  } = useLiveFloatingService({
    liveId,
    // liveId: 55,
    enabled: !isInLivePage || !isGoodsLoading,
    /**
     * @todo 해당 방식에 대해 논의 필요
     * @since 230106, jeff@rxc.co.kr
     */
    zIndex: 1,
  });

  /** Service: 쇼룸 리스트 로드 */
  const {
    isShowroomActive,
    deals,
    dealsError,
    isDealsError,
    isDealsLoading,
    isDealsFetching,
    hasMoreDeals,
    handleLoadDeals,
    handleShowroomProfileClick,
  } = useShowroomDealService({
    showroom: showRoom,
    enabled: !!showRoom?.id && !isInLivePage,
    onLogShowroomTabOnBottom: handleLogShowroomTabOnBottom,
    onRemoveLiveFloating: handleRemoveLiveFloating,
  });

  /** Service: 컨텐츠 리스트 로드 */
  const { contentsList, isContentListLoading, hasContentList } = useShowroomContentService({
    showroomId: showRoom?.id ?? 0,
    enabled: !!showRoom?.id && !isInLivePage,
    size: ContentListLimit + 1,
  });

  /** Service: 리뷰 리스트 로드 */
  const { reviewShortcutList, hasReviewShortcutList, reviewList, hasReviewList, reviewListLink } = useReviewService({
    enabled: !isInLivePage,
  });

  /** Service: 추천 리스트 로드 */
  const { isRecommendationShow, recommendation, isAbleRecommendationPage, recommendationLink } =
    useRecommendationService({
      enabled: !isInLivePage,
    });

  /** Service: Option */
  const {
    isOptionOpen,
    isOptionDrawerOpen,
    isCloseConfirm,
    sendWebOptionData,
    handleOptionOpen,
    handleOptionCloseWithDeleteExpired,
    handleOptionClose,
    handleOptionCloseComplete,
    handleActionSave,
    handleDeleteExpired,
  } = useOptionService({
    detailGoods: detailGoods ?? null,
    onReload: () => handleReloadInWebview(ReloadInfoType.ALL),
    onRemoveLiveFloating: handleRemoveLiveFloating,
    onLogOptionOpen: handleLogPurchaseTab,
    onLogViewIdentifyAdult: handleLogViewIdentifyAdult,
    onLogCompleteIdentifyAdult: handleLogCompleteIdentifyAdult,
    onLogAddToCart: handleLogAddToCart,
    onLogTabToCheckout: handleLogTabToCheckout,
    onLogCloseOptionModal: handleCloseOptionModal,
  });

  /** Service: 판매 기간 관련 */
  const { salesSchedulerType, enabledCountDown, isStatusChange, salesStart, salesEnd, ddayProps, purchasableEa } =
    useSalesSchedulerService({
      detailGoods: detailGoods ?? null,
      totalStock: option?.totalStock ?? null,
    });

  /** Service: 알림 설정 */
  const { isNotification, isNotificationInfoLoading, handleUpdateNotification, handleReloadNotification } =
    useNotificationService({
      detailGoods: detailGoods ?? null,
      ddayProps,
      onReload: () => handleReloadInWebview(ReloadInfoType.NOTIFICATION),
      onLogCompleteSalesNotificationIn: handleLogCompleteSalesNotificationIn,
      onLogCompleteSalesNotificationOut: handleLogCompleteSalesNotificationOut,
    });

  /** Service: Cta Button */
  const { isCtaBuyable, isCtaStatusText, isStatusWait } = useCtaService({
    detailGoods: detailGoods ?? null,
    salesSchedulerType,
    isStatusChange,
    isNotification,
  });

  /** Service: Reload */
  const { handleReloadInWebview } = useReloadService({
    onReloadWish: handleReloadWish,
    onReloadCoupon: handleReloadCoupon,
    onReloadNotification: handleReloadNotification,
  });

  /** Service: Init */
  const { pageLoadState } = useInitService({
    loading: {
      isGoodsLoading,
      isCouponLoading,
      isWishInfoLoading,
      isLiveLoading,
      isContentListLoading,
      isNotificationInfoLoading,
    },
    error: { isGoodsError },
    methods: {
      historySaveMutate,
      onOptionOpen: handleOptionOpen,
      onLiveFloating: handleLiveFloating,
      onCloseWebLiveFloating: handleCloseWebLiveFloating,
      onLogGoodsInit: handleLogGoodsInit,
    },
    data: {
      detailGoods,
      option,
      isCoupon: isCouponActive,
      live,
      isFloatingLivePlayer,
    },
  });

  return {
    // init Status
    pageLoadState,

    /**
     * Goods Base Info
     */
    goodsId: reqGoodsId,
    detailGoods,
    showRoom,
    header,
    bannerList,
    isAuctionType,
    isOndaDeal,
    isGoodsLoading,
    isGoodsError,
    goodsError,

    /**
     * Pricing Table
     */
    hasPriceList: detailGoods?.ticket?.isDisplayPricingTable ?? false,
    handlePriceListOpen,

    /**
     * Coupon List
     */
    coupon,
    isCouponActive,
    isCouponLoading,
    isCouponError,
    couponError,
    handleCouponDownload,

    /**
     * Coupon Download
     */
    isUserCouponDownloaded,

    /**
     * Showroom
     */
    isShowroomActive,
    handleShowroomProfileClick,

    /**
     * Deals Loading 상태값
     */
    deals: deals?.pages || [],
    dealsError,
    hasMoreDeals,
    isDealsError,
    isDealsLoading,
    isDealsFetching,
    handleLoadDeals,

    /**
     * Contents List 상태값
     */
    contentsList: contentsList?.pages ? contentsList?.pages.slice(0, ContentListLimit) : [],
    isAbleContentPage: contentsList?.pages ? contentsList?.pages.length > ContentListLimit : false,
    hasContentList,

    /**
     * Review 상태값
     */
    reviewShortcutList,
    hasReviewShortcutList,
    reviewList,
    hasReviewList,
    isAbleReviewPage: reviewList.length >= FeedItemLimit,
    reviewListLink,

    /**
     * Recommendation
     */
    isRecommendationShow,
    recommendation,
    isAbleRecommendationPage,
    recommendationLink,

    /**
     * Wish List
     */
    hasWishItem,
    handleUpdateWish,

    /**
     * Option
     */
    option,
    isCloseConfirm,
    sendWebOptionData,
    isOptionOpen,
    isOptionDrawerOpen,
    handleOptionOpen,
    handleOptionCloseWithDeleteExpired,
    handleOptionClose,
    handleOptionCloseComplete,
    handleActionSave,
    handleDeleteExpired,

    /**
     * salesScheduler
     */
    salesSchedulerType,
    enabledCountDown,
    isStatusChange,
    salesStart,
    salesEnd,
    ddayProps,
    purchasableEa,

    /**
     * notification
     */
    isNotification,
    handleUpdateNotification,

    /**
     * Cta
     */
    isCtaBuyable,
    isCtaStatusText,
    isStatusWait,

    /**
     * LiveInfo
     */
    live,

    /**
     * Link
     */
    handleCouponLink,
    handleQnaLink,

    /**
     * Display
     */
    isShippingInfoActive: !isAuctionType && detailGoods?.kind === GoodsKind.REAL,
    isTicketInfoActive: !isAuctionType && detailGoods?.kind !== GoodsKind.REAL && detailGoods?.ticket?.isDisplayPeriod,
    // 상품 설명 섹션 내 셋팅된 정보가 하나라도 있으면 노출, 없으면 미노출
    isDescriptionActive:
      detailGoods?.benefitDescription ||
      !isEmpty(detailGoods?.accom) ||
      detailGoods?.description ||
      detailGoods?.code ||
      detailGoods?.isExistComponent ||
      detailGoods?.isExistDetailInformation,
    hasEventBannerList: !!bannerList && bannerList.length > 0,

    /**
     * Log
     */
    logService,
  };
};
