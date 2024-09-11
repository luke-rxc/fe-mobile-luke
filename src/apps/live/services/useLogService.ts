import { LiveContentsType } from '@constants/live';
import { WebLogTypes, AppLogTypes } from '@constants/log';
import { tracking } from '@utils/log';
import debug from 'debug';
import { useEffect, useRef, useState } from 'react';
import { LogEventTypes } from '../constants';
import { LiveEndViewModel, LiveGoodsCardModel, LiveModel, ScheduleItemModel, ShowroomSimpleModel } from '../models';

const debugLog = (type: LogEventTypes, params?: unknown, ...args: unknown[]) => {
  debug.log(`Log[${type}]: `, params, ...args);
};

/** 기본 트래킹 대상 */
const defaultTargets = {
  web: [WebLogTypes.MixPanel],
  app: [AppLogTypes.MixPanel],
};

const trackingLog = (
  name: LogEventTypes,
  parameters?: Record<string, unknown>,
  targets: tracking.LogTrackingTarget = defaultTargets,
) => {
  tracking.logEvent({
    name,
    parameters,
    targets,
  });
};

export type ReturnTypeUseLiveLogService = ReturnType<typeof useLogService>;

export interface LogLiveGoodsParams {
  goodsId: string;
  goodsName: string;
  goodsType?: string;
}

export interface LogLiveImpressionCouponParams {
  couponId: Array<number>;
  couponName: Array<string>;
  couponType: Array<string>;
  couponCount: number;
}

export interface LogLiveCompleteCouponDownloadParams {
  couponId: Array<number>;
  couponName: Array<string>;
  couponType: Array<string>;
  couponCount: number;
}

export interface LogLiveEndpageGoodsThumbnailParams {
  contentsId: string;
  goodsId: string;
  goodsName: string;
  goodsType: string;
  goodsIndex: number;
}

export interface LogLiveEndpageScheduleParams {
  scheduleId: string;
  scheduleName: string;
  scheduleIndex: number;
  liveId: string;
}

export interface LogLiveTabEndpageScheduleParams {
  contentsId: string;
  showroomId: string;
  showroomName: string;
  scheduleId: string;
  scheduleName: string;
  scheduleIndex: number;
  liveId: string;
  landingScheme: string;
}

export const useLogService = () => {
  const isInitRef = useRef(false);
  const [liveItem, setLiveItem] = useState<LiveModel | null>(null);
  const [liveViewStart, setLiveViewStart] = useState<number>(0);
  const liveViewPauseTimeRef = useRef<number>(0);

  const getGoodsIds = (live: LiveModel) => {
    if (live.contentsType === LiveContentsType.STANDARD) {
      return live.goodsList.map((item) => item.goods.id.toString());
    }
    return live.auctionList.map((item) => item.id.toString());
  };

  const logPageInit = (item: LiveModel) => {
    const parameters = {
      contents_id: item.id.toString(),
      contents_type: item.contentsType,
      showroom_id: item.showRoom.id.toString(),
      showroom_name: item.showRoom.name,
      goods_id: getGoodsIds(item),
      identify: false,
      shipping_address: false,
      prizm_pay: false,
    };
    debugLog(LogEventTypes.LogLivePageInit, parameters);
    trackingLog(LogEventTypes.LogLivePageInit, parameters, {
      web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
    });
  };

  const logLiveViewChat = () => {
    if (!liveItem) {
      return;
    }
    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveViewChat, parameters);
    trackingLog(LogEventTypes.LogLiveViewChat, parameters);
  };

  const logLiveViewAuction = () => {
    if (!liveItem) {
      return;
    }
    const parameters = {
      contents_id: liveItem.id.toString(),
    };
    debugLog(LogEventTypes.LogLiveViewAuction, parameters);
    trackingLog(LogEventTypes.LogLiveViewAuction, parameters);
  };

  const logLiveTapShowroom = (logEventType: LogEventTypes) => {
    return () => {
      if (!liveItem) {
        return;
      }
      const parameters = {
        contents_id: liveItem.id.toString(),
        showroom_id: liveItem.showRoom.id,
        showroom_name: liveItem.showRoom.name,
      };
      debugLog(logEventType, parameters);
      trackingLog(logEventType, parameters);
    };
  };

  const logLiveImpressionGoodsList = () => {
    if (!liveItem) {
      return;
    }
    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveImpressionGoodsList, parameters);
    trackingLog(LogEventTypes.LogLiveImpressionGoodsList, parameters);
  };

  const logLiveTabGoodsBanner = (params?: LogLiveGoodsParams) => {
    if (!liveItem) {
      return;
    }
    const parameters = { ...params, contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveTabGoodsBanner, parameters);
    trackingLog(LogEventTypes.LogLiveTabGoodsBanner, parameters);
  };

  const logLiveTabGoods = ({ goodsId, goodsType, goodsName }: LogLiveGoodsParams) => {
    if (!liveItem) {
      return;
    }
    const parameters = {
      contents_id: liveItem.id.toString(),
      goods_id: goodsId,
      goods_type: goodsType || '',
      goods_name: goodsName,
    };
    debugLog(LogEventTypes.LogLiveTabGoods, parameters);
    trackingLog(LogEventTypes.LogLiveTabGoods, parameters);
  };

  const logLiveTabToAppBanner = () => {
    if (!liveItem) {
      return;
    }
    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveTabToAppBanner, parameters);
    trackingLog(LogEventTypes.LogLiveTabToAppBanner, parameters);
  };

  const logLiveViewPlaytimeFullscreen = () => {
    if (!liveItem) {
      return;
    }

    if (liveViewStart > 0) {
      const duration = Math.round((new Date().getTime() - liveViewStart - liveViewPauseTimeRef.current) / 1000);

      // duration이 0보다 클 경우만 log 처리
      if (duration > 0) {
        const parameters = {
          contents_id: liveItem.id.toString(),
          contents_type: liveItem.contentsType,
          duration,
          showroom_id: liveItem.showRoom.id.toString(),
          showroom_name: liveItem.showRoom.name,
        };
        debugLog(LogEventTypes.LogLiveViewPlaytimeFullscreen, parameters);
        trackingLog(LogEventTypes.LogLiveViewPlaytimeFullscreen, parameters);
      }
    }
  };

  const logLiveInit = (item: LiveModel) => {
    setLiveItem(item);
    setLiveViewStart(new Date().getTime());
  };

  const updateLiveViewPauseTime = (pauseTime: number) => {
    liveViewPauseTimeRef.current += pauseTime;
  };

  useEffect(() => {
    if (liveItem && !isInitRef.current) {
      isInitRef.current = true;
      logPageInit(liveItem);
    }
    return () => {
      logLiveViewPlaytimeFullscreen();
      setLiveViewStart(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveItem]);

  const logLiveTabAlertEndingConfirm = () => {
    if (!liveItem) {
      return;
    }

    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveTabAlertEndingConfirm, parameters);
    trackingLog(LogEventTypes.LogLiveTabAlertEndingConfirm, parameters);
  };

  const logLiveTabAlertEndingGotoShowroom = () => {
    if (!liveItem) {
      return;
    }

    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveTabAlertEndingGotoShowroom, parameters);
    trackingLog(LogEventTypes.LogLiveTabAlertEndingGotoShowroom, parameters);
  };

  const logLiveTabAlertEndedGotoShowroom = (liveId: number) => {
    const parameters = { contents_id: liveId.toString() };
    debugLog(LogEventTypes.LogLiveTabAlertEndedGotoShowroom, parameters);
    trackingLog(LogEventTypes.LogLiveTabAlertEndedGotoShowroom, parameters);
  };

  const logLiveViewModalSchedule = () => {
    if (!liveItem) {
      return;
    }

    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveViewModalSchedule, parameters);
    trackingLog(LogEventTypes.LogLiveViewModalSchedule, parameters);
  };

  const logLiveTabModalScheduleContents = (item: ScheduleItemModel) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      schedule_id: item.id.toString(),
      schedule_name: item.title,
      schedule_index: item.itemIndex,
      live_id: item.liveSchedule.live.id.toString(),
      landing_scheme: item.scheme,
      onair: item.liveSchedule.live.onAir,
    };
    debugLog(LogEventTypes.LogLiveTabModalScheduleContents, parameters);
    trackingLog(LogEventTypes.LogLiveTabModalScheduleContents, parameters);
  };

  const logLiveTabModalScheduleMore = () => {
    if (!liveItem) {
      return;
    }

    const parameters = { contents_id: liveItem.id.toString() };
    debugLog(LogEventTypes.LogLiveTabModalScheduleMore, parameters);
    trackingLog(LogEventTypes.LogLiveTabModalScheduleMore, parameters);
  };

  const logLiveImpressionFollowRequest = (item: ShowroomSimpleModel) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      contents_type: liveItem.contentsType,
      showroom_id: item.id,
      showroom_name: item.name,
      showroom_host: item.id === liveItem.showRoom.id,
    };
    debugLog(LogEventTypes.LogLiveImpressionFollowRequest, parameters);
    trackingLog(LogEventTypes.LogLiveImpressionFollowRequest, parameters);
  };

  const logLiveCompleteFollowRequestFollow = (item: ShowroomSimpleModel) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      contents_type: liveItem.contentsType,
      showroom_id: item.id,
      showroom_name: item.name,
      showroom_host: item.id === liveItem.showRoom.id,
    };
    debugLog(LogEventTypes.LogLiveCompleteFollowRequestFollow, parameters);
    trackingLog(LogEventTypes.LogLiveCompleteFollowRequestFollow, parameters);
  };

  const logLiveTabFollowRequestShowroom = (item: ShowroomSimpleModel) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      contents_type: liveItem.contentsType,
      showroom_id: item.id,
      showroom_name: item.name,
      showroom_host: item.id === liveItem.showRoom.id,
    };
    debugLog(LogEventTypes.LogLiveTabFollowRequestShowroom, parameters);
    trackingLog(LogEventTypes.LogLiveTabFollowRequestShowroom, parameters);
  };

  const logLiveCompleteScheduleNotiOptIn = (item: ScheduleItemModel) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      schedule_id: item.id.toString(),
      schedule_name: item.title,
      schedule_index: item.itemIndex,
      live_id: item.liveSchedule.live.id.toString(),
      showroom_id: item.showRoom.id,
      showroom_name: item.showRoom.name,
    };
    debugLog(LogEventTypes.LogLiveCompleteScheduleNotiOptIn, parameters);
    trackingLog(LogEventTypes.LogLiveCompleteScheduleNotiOptIn, parameters);
  };

  const logLiveCompleteScheduleNotiOptOut = (item: ScheduleItemModel) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      schedule_id: item.id.toString(),
      schedule_name: item.title,
      schedule_index: item.itemIndex,
      live_id: item.liveSchedule.live.id.toString(),
      showroom_id: item.showRoom.id,
      showroom_name: item.showRoom.name,
    };
    debugLog(LogEventTypes.LogLiveCompleteScheduleNotiOptOut, parameters);
    trackingLog(LogEventTypes.LogLiveCompleteScheduleNotiOptOut, parameters);
  };

  const logLiveImpressionPurchaseVerification = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      contents_type: liveItem.contentsType,
      showroom_id: liveItem.showRoom.id.toString(),
      showroom_name: liveItem.showRoom.name,
    };
    debugLog(LogEventTypes.LiveImpressionPurchaseVerification, parameters);
    trackingLog(LogEventTypes.LiveImpressionPurchaseVerification, parameters);
  };

  const logLiveTabPurchaseVerification = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      contents_type: liveItem.contentsType,
      showroom_id: liveItem.showRoom.id.toString(),
      showroom_name: liveItem.showRoom.name,
    };
    debugLog(LogEventTypes.LiveTabPurchaseVerification, parameters);
    trackingLog(LogEventTypes.LiveTabPurchaseVerification, parameters);
  };

  const logLiveImpressionGoodsListCoupon = ({
    couponId,
    couponName,
    couponType,
    couponCount,
  }: LogLiveImpressionCouponParams) => {
    if (!liveItem) {
      return;
    }
    const parameters = {
      contents_id: liveItem.id.toString(),
      coupon_id: couponId,
      coupon_name: couponName,
      coupon_type: couponType,
      coupon_count: couponCount,
    };
    debugLog(LogEventTypes.LogLiveImpressionGoodsListCoupon, parameters);
    trackingLog(LogEventTypes.LogLiveImpressionGoodsListCoupon, parameters);
  };

  const logLiveTabGoodsListCouponDownload = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
    };
    debugLog(LogEventTypes.LogLiveTabGoodsListCouponDownload, parameters);
    trackingLog(LogEventTypes.LogLiveTabGoodsListCouponDownload, parameters);
  };

  const logLiveCompleteGoodsListCouponDownload = ({
    couponId,
    couponName,
    couponType,
    couponCount,
  }: LogLiveCompleteCouponDownloadParams) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      coupon_id: couponId,
      coupon_name: couponName,
      coupon_type: couponType,
      coupon_count: couponCount,
    };
    debugLog(LogEventTypes.LogLiveCompleteGoodsListCouponDownload, parameters);
    trackingLog(LogEventTypes.LogLiveCompleteGoodsListCouponDownload, parameters);
  };

  return {
    logLiveInit,
    logLiveViewChat,
    logLiveViewAuction,
    logLiveTapShowroom,
    logLiveImpressionGoodsList,
    logLiveTabGoodsBanner,
    logLiveTabGoods,
    logLiveTabToAppBanner,
    logLiveViewPlaytimeFullscreen,
    updateLiveViewPauseTime,
    logLiveTabAlertEndingConfirm,
    logLiveTabAlertEndingGotoShowroom,
    logLiveTabAlertEndedGotoShowroom,
    logLiveViewModalSchedule,
    logLiveTabModalScheduleContents,
    logLiveTabModalScheduleMore,
    logLiveImpressionFollowRequest,
    logLiveCompleteFollowRequestFollow,
    logLiveTabFollowRequestShowroom,
    logLiveCompleteScheduleNotiOptIn,
    logLiveCompleteScheduleNotiOptOut,
    logLiveImpressionPurchaseVerification,
    logLiveTabPurchaseVerification,
    logLiveImpressionGoodsListCoupon,
    logLiveTabGoodsListCouponDownload,
    logLiveCompleteGoodsListCouponDownload,
  };
};

// 경매 인증 트래킹
export const useAuthLogService = () => {
  const logLiveViewAuctionRequired = (liveId = '') => {
    const parameters = { contents_id: liveId };
    debugLog(LogEventTypes.LogLiveViewAuctionRequired, parameters);
    trackingLog(LogEventTypes.LogLiveViewAuctionRequired, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  const logLiveTabAuctionRequiredIdentify = (liveId = '') => {
    const parameters = { contents_id: liveId };
    debugLog(LogEventTypes.LogLiveTabAuctionRequiredIdentify, parameters);
    trackingLog(LogEventTypes.LogLiveTabAuctionRequiredIdentify, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  const logLiveTabAuctionRequiredShipping = (liveId = '') => {
    const parameters = { contents_id: liveId };
    debugLog(LogEventTypes.LogLiveTabAuctionRequiredShipping, parameters);
    trackingLog(LogEventTypes.LogLiveTabAuctionRequiredShipping, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  const logLiveTabAuctionRequiredPrizmPay = (liveId = '') => {
    const parameters = { contents_id: liveId };
    debugLog(LogEventTypes.LogLiveTabAuctionRequiredPrizmPay, parameters);
    trackingLog(LogEventTypes.LogLiveTabAuctionRequiredPrizmPay, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  const logLiveTabAuctionRequiredDone = (liveId = '') => {
    const parameters = { contents_id: liveId };
    debugLog(LogEventTypes.LogLiveTabAuctionRequiredDone, parameters);
    trackingLog(LogEventTypes.LogLiveTabAuctionRequiredDone, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  return {
    logLiveViewAuctionRequired,
    logLiveTabAuctionRequiredIdentify,
    logLiveTabAuctionRequiredShipping,
    logLiveTabAuctionRequiredPrizmPay,
    logLiveTabAuctionRequiredDone,
  };
};

export const useFaqLogService = () => {
  const logLiveViewFaq = (liveId: number, faqCount: number) => {
    const parameters = { contents_id: String(liveId), faq_count: faqCount };
    debugLog(LogEventTypes.LogLiveViewFaq, parameters);
    trackingLog(LogEventTypes.LogLiveViewFaq, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  const logLiveTabFaq = (liveId: number) => {
    const parameters = { contents_id: String(liveId) };
    debugLog(LogEventTypes.LogLiveTabFaq, parameters);
    trackingLog(LogEventTypes.LogLiveTabFaq, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  const logLiveTabFaqSection = (liveId: number, faqId: number, faqTitle: string, faqIndex: number) => {
    const parameters = { contents_id: String(liveId), faq_id: String(faqId), faq_title: faqTitle, faq_index: faqIndex };
    debugLog(LogEventTypes.LogLiveTabFaqSection, parameters);
    trackingLog(LogEventTypes.LogLiveTabFaqSection, parameters, {
      ...defaultTargets,
      app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
    });
  };

  return {
    logLiveViewFaq,
    logLiveTabFaq,
    logLiveTabFaqSection,
  };
};

export type ReturnTypeUseLiveEndLogService = ReturnType<typeof useLiveEndLogService>;

export const useLiveEndLogService = () => {
  const isInitRef = useRef(false);

  const [liveItem, setLiveItem] = useState<LiveEndViewModel | null>(null);

  const logLiveViewEndpage = (item: LiveEndViewModel) => {
    if (liveItem) {
      return;
    }

    setLiveItem(item);
    const parameters = {
      contents_id: item.id.toString(),
    };
    debugLog(LogEventTypes.LogLiveViewEndpage, parameters);
    trackingLog(LogEventTypes.LogLiveViewEndpage, parameters, {
      web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
    });
  };

  const logLiveTabEndpageCtaGotoshowroom = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      showroom_id: liveItem.showRoom.id.toString(),
      showroom_name: liveItem.showRoom.name.toString(),
    };
    debugLog(LogEventTypes.LogLiveTabEndpageCtaGotoshowroom, parameters);
    trackingLog(LogEventTypes.LogLiveTabEndpageCtaGotoshowroom, parameters, {
      web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
    });
  };

  const logLiveTabEndpageCouponDownload = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
    };
    debugLog(LogEventTypes.LogLiveTabEndpageCouponDownload, parameters);
    trackingLog(LogEventTypes.LogLiveTabEndpageCouponDownload, parameters, {
      web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
    });
  };

  const logLiveImpressionEndpageCoupon = ({
    couponId,
    couponName,
    couponType,
    couponCount,
  }: LogLiveImpressionCouponParams) => {
    if (!liveItem || isInitRef.current) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      coupon_id: couponId,
      coupon_name: couponName,
      coupon_type: couponType,
      coupon_count: couponCount,
    };
    debugLog(LogEventTypes.LogLiveImpressionEndpageCoupon, parameters);
    trackingLog(LogEventTypes.LogLiveImpressionEndpageCoupon, parameters, {
      web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
    });

    isInitRef.current = true;
  };

  const logLiveCompleteEndpageCoupon = ({
    couponId,
    couponName,
    couponType,
    couponCount,
  }: LogLiveCompleteCouponDownloadParams) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      coupon_id: couponId,
      coupon_name: couponName,
      coupon_type: couponType,
      coupon_count: couponCount,
    };
    debugLog(LogEventTypes.LogLiveCompleteEndpageCoupon, parameters);
    trackingLog(LogEventTypes.LogLiveCompleteEndpageCoupon, parameters);
  };

  const logLiveImpressionEndpageGoodsThumbnail = ({
    contentsId,
    goodsId,
    goodsName,
    goodsType,
    goodsIndex,
  }: LogLiveEndpageGoodsThumbnailParams) => {
    const parameters = {
      contents_id: contentsId,
      goods_id: goodsId,
      goods_name: goodsName,
      goods_type: goodsType,
      goods_index: goodsIndex,
    };
    debugLog(LogEventTypes.LogLiveImpressionEndpageGoodsThumbnail, parameters);
    trackingLog(LogEventTypes.LogLiveImpressionEndpageGoodsThumbnail, parameters);
  };

  const logLiveTabEndpageGoodsThumbnail = ({
    contentsId,
    goodsId,
    goodsName,
    goodsType,
    goodsIndex,
  }: LogLiveEndpageGoodsThumbnailParams) => {
    const parameters = {
      contents_id: contentsId,
      goods_id: goodsId,
      goods_name: goodsName,
      goods_type: goodsType,
      goods_index: goodsIndex,
    };
    debugLog(LogEventTypes.LogLiveTabEndpageGoodsThumbnail, parameters);
    trackingLog(LogEventTypes.LogLiveTabEndpageGoodsThumbnail, parameters);
  };

  const logLiveTabEndpageGoodsMore = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
    };
    debugLog(LogEventTypes.LogLiveTabEndpageGoodsMore, parameters);
    trackingLog(LogEventTypes.LogLiveTabEndpageGoodsMore, parameters);
  };

  const logLivecompleteEndpageScheduleNotiOptIn = ({
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
  }: LogLiveEndpageScheduleParams) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      showroom_id: liveItem.showRoom.id.toString(),
      showroom_name: liveItem.showRoom.name.toString(),
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      live_id: liveId,
    };
    debugLog(LogEventTypes.LogLivecompleteEndpageScheduleNotiOptIn, parameters);
    trackingLog(LogEventTypes.LogLivecompleteEndpageScheduleNotiOptIn, parameters);
  };

  const logLivecompleteEndpageScheduleNotiOptOut = ({
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
  }: LogLiveEndpageScheduleParams) => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
      showroom_id: liveItem.showRoom.id.toString(),
      showroom_name: liveItem.showRoom.name.toString(),
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      live_id: liveId,
    };
    debugLog(LogEventTypes.LogLivecompleteEndpageScheduleNotiOptOut, parameters);
    trackingLog(LogEventTypes.LogLivecompleteEndpageScheduleNotiOptOut, parameters);
  };

  const logLiveTabEndpageSchedule = ({
    contentsId,
    showroomId,
    showroomName,
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    landingScheme,
  }: LogLiveTabEndpageScheduleParams) => {
    const parameters = {
      contents_id: contentsId,
      showroom_id: showroomId,
      showroom_name: showroomName,
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      live_id: liveId,
      landing_scheme: landingScheme,
    };
    debugLog(LogEventTypes.LogLiveTabEndpageSchedule, parameters);
    trackingLog(LogEventTypes.LogLiveTabEndpageSchedule, parameters);
  };

  const logLiveTabEndpageScheduleMore = () => {
    if (!liveItem) {
      return;
    }

    const parameters = {
      contents_id: liveItem.id.toString(),
    };
    debugLog(LogEventTypes.LogLiveTabEndpageScheduleMore, parameters);
    trackingLog(LogEventTypes.LogLiveTabEndpageScheduleMore, parameters);
  };

  const logLiveListViewPage = (liveId: string) => {
    const parameters = {
      contents_id: liveId,
    };
    debugLog(LogEventTypes.LogLiveListViewPage, parameters);
    trackingLog(LogEventTypes.LogLiveListViewPage, parameters, {
      web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
    });
  };

  return {
    logLiveViewEndpage,
    logLiveTabEndpageCtaGotoshowroom,
    logLiveTabEndpageCouponDownload,
    logLiveImpressionEndpageCoupon,
    logLiveCompleteEndpageCoupon,
    logLiveImpressionEndpageGoodsThumbnail,
    logLiveTabEndpageGoodsThumbnail,
    logLiveTabEndpageGoodsMore,
    logLivecompleteEndpageScheduleNotiOptIn,
    logLivecompleteEndpageScheduleNotiOptOut,
    logLiveTabEndpageSchedule,
    logLiveTabEndpageScheduleMore,
    logLiveListViewPage,
  };
};

export type ReturnTypeUseLiveGoodsLogService = ReturnType<typeof useLiveGoodsLogService>;

export const useLiveGoodsLogService = () => {
  const logLiveGoodsViewPage = (liveId: number) => {
    const parameters = {
      contents_id: liveId.toString(),
    };
    debugLog(LogEventTypes.LogLiveGoodsViewPage, parameters);
    trackingLog(LogEventTypes.LogLiveGoodsViewPage, parameters);
  };

  const logLiveGoodsImpressionGoods = (liveId: number, items: Array<LiveGoodsCardModel>) => {
    const parameters = items.reduce(
      (target, { goodsId, goodsName, goodsIndex }) => {
        target.goods_id.push(goodsId);
        target.goods_name.push(goodsName);
        target.goods_index.push(goodsIndex);
        return target;
      },
      {
        contents_id: liveId.toString(),
        goods_id: [] as Array<number>,
        goods_name: [] as Array<string>,
        goods_index: [] as Array<number>,
      },
    );
    debugLog(LogEventTypes.LogLiveGoodsImpressionGoods, parameters);
    trackingLog(LogEventTypes.LogLiveGoodsImpressionGoods, parameters);
  };

  const logLiveGoodsTabGoods = (liveId: number, { goodsId, goodsName, goodsIndex }: LiveGoodsCardModel) => {
    const parameters = {
      contents_id: liveId.toString(),
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
    };
    debugLog(LogEventTypes.LogLiveGoodsTabGoods, parameters);
    trackingLog(LogEventTypes.LogLiveGoodsTabGoods, parameters);
  };

  return {
    logLiveGoodsViewPage,
    logLiveGoodsImpressionGoods,
    logLiveGoodsTabGoods,
  };
};
