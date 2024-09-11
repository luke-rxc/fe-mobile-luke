import { ContentType } from '@constants/content';
import { GoodsNormalStatusType, GoodsStatusType, GoodsType } from '@constants/goods';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import {
  ContentStatusType,
  CTAButtonActionType,
  LogEventTypes,
  LogEventWebFacebookTypes,
  PresetType,
} from '../constants';
import type { ContentLogInfoModel, LandingActionModel } from '../models';
import { getLandingType } from '../utils';

export const debug = createDebug();
const debugLog = (type: LogEventTypes, params?: unknown, ...args: unknown[]) => {
  debug.log(`Log[${type}]: `, params, ...args);
};

export const useLogService = () => {
  // 컨텐츠 진입 노출
  const logContentInit = ({
    contentId,
    contentName,
    contentType,
    contentStatus,
    showroomName,
    showroomId,
    contentsKeyword,
  }: {
    contentId: number;
    contentName: string;
    contentType: ContentType;
    contentStatus: ContentStatusType;
    showroomName: string;
    showroomId: number;
    contentsKeyword: string[];
  }) => {
    const logParams = {
      contents_id: `${contentId}`,
      contents_name: contentName,
      contents_type: getLogContentType(contentType),
      contents_status: getContentStatus(contentStatus),
      showroom_name: showroomName,
      showroom_id: `${showroomId}`,
      contents_keyword: contentsKeyword,
    };
    debugLog(LogEventTypes.LogContentInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogContentInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Firebase, AppLogTypes.Prizm],
      },
    });
    tracking.logEvent({
      name: LogEventWebFacebookTypes.LogContentInit,
      targets: {
        web: [WebLogTypes.Facebook],
      },
    });
  };

  // 콘텐츠 진입 라이브 영역 노출 로그
  const logContentLiveBannerInit = ({
    contentId,
    contentName,
    showroomId,
    showroomName,
    liveId,
  }: {
    contentId: number;
    contentName: string;
    showroomId: number;
    showroomName: string;
    liveId: number;
  }) => {
    const logParams = {
      contents_id: `${contentId}`,
      contents_name: contentName,
      showroom_id: `${showroomId}`,
      showroom_name: showroomName,
      live_id: `${liveId}`,
    };
    debugLog(LogEventTypes.LogContentLiveBannerInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogContentLiveBannerInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 콘텐츠 라이브 바로가기 탭
  const logContentLiveBannerTab = ({
    contentId,
    contentName,
    showroomId,
    showroomName,
    liveId,
  }: {
    contentId: number;
    contentName: string;
    showroomId: number;
    showroomName: string;
    liveId: number;
  }) => {
    const logParams = {
      contents_id: `${contentId}`,
      contents_name: contentName,
      showroom_id: `${showroomId}`,
      showroom_name: showroomName,
      live_id: `${liveId}`,
    };
    debugLog(LogEventTypes.logContentLiveBannerTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.logContentLiveBannerTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 컨텐츠 댓글 탭
  const logPresetReplyTab = ({ contentCode, contentType }: { contentCode: string; contentType: ContentType }) => {
    const logParams = {
      contents_code: contentCode,
      contents_type: getLogContentType(contentType),
    };
    debugLog(LogEventTypes.LogContentTabComment, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogContentTabComment,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 공통헤더탑바 쇼룸 탭
  const logShowroomTab = ({ contentCode, showroomCode }: { contentCode: string; showroomCode: string }) => {
    const logParams = {
      contents_code: contentCode,
      showroom_code: showroomCode,
    };
    debugLog(LogEventTypes.LogShowroomTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogShowroomTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 콘텐츠 진입 팔로우 스낵바 노출 로그
  const logShowroomSnackBar = ({
    contentId,
    contentName,
    showroomId,
    showroomName,
  }: {
    contentId: number;
    contentName: string;
    showroomId: number;
    showroomName: string;
  }) => {
    const logParams = {
      contents_id: `${contentId}`,
      contents_name: contentName,
      showroom_id: `${showroomId}`,
      showroom_name: showroomName,
    };
    debugLog(LogEventTypes.LogShowroomSnackbarInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogShowroomSnackbarInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 콘텐츠 진입 팔로우 스낵바 팔로우 완료 로그 (언팔로우는 수집 X)
  const logShowroomSnackBarFollow = ({
    contentId,
    contentName,
    showroomId,
    showroomName,
  }: {
    contentId: number;
    contentName: string;
    showroomId: number;
    showroomName: string;
  }) => {
    const logParams = {
      contents_id: `${contentId}`,
      contents_name: contentName,
      showroom_id: `${showroomId}`,
      showroom_name: showroomName,
    };
    debugLog(LogEventTypes.LogShowroomSnackbarFollow, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogShowroomSnackbarFollow,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 배너 컴포넌트 노출
  const logPresetBannerInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      banner_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      banner_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetBannerInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetBannerInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 배너 탭
  const logPresetBannerTab = (contentInfo: ContentLogInfoModel, actions: LandingActionModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const landingValue = actions.value;
    const logParams: {
      banner_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      landing_url: string;
    } = {
      banner_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      landing_url: landingValue,
    };
    debugLog(LogEventTypes.LogPresetBannerTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetBannerTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 혜택 상품 컴포넌트 노출
  const logPresetBenefitGoodsInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      benefit_goods_index: string;
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      benefit_goods_index: `${presetId + 1}`,
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetBenefitGoodsInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetBenefitGoodsInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 혜택 리스트 컴포넌트 노출
  const logPresetBenefitListInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      benefit_list_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      benefit_list_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetBenefitListInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetBenefitListInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 쿠폰다운 컴포넌트 노출
  const logPresetCouponDownInit = (contentInfo: ContentLogInfoModel, { couponType }: { couponType: string }) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      coupon_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      coupon_type: string;
    } = {
      coupon_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      coupon_type: couponType,
    };
    debugLog(LogEventTypes.LogPresetCouponDownInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetCouponDownInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 쿠폰다운 성공 시
  const logPresetCouponDownComplete = (contentInfo: ContentLogInfoModel, { couponType }: { couponType: string }) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      coupon_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      coupon_type: string;
    } = {
      coupon_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      coupon_type: couponType,
    };
    debugLog(LogEventTypes.LogPresetCouponDownComplete, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetCouponDownComplete,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 버튼 컴포넌트 노출
  const logPresetCTAInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      button_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      button_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetCTAInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetCTAInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 버튼 컴포넌트 내 버튼 탭 시
  const logPresetCTAButtonTab = ({
    contentInfo,
    label,
    buttonActionType,
    btnLink,
  }: {
    contentInfo: ContentLogInfoModel;
    label: string;
    buttonActionType: CTAButtonActionType;
    btnLink: string;
  }) => {
    const { contentNo, contentName, type } = contentInfo;
    const logParams: {
      contents_id: string;
      contents_name: string;
      contents_type: string;
      button_label: string;
      button_type: string;
      landing_url: string;
    } = {
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      button_label: label,
      button_type: getCTAButtonType(buttonActionType),
      landing_url: btnLink,
    };

    debugLog(LogEventTypes.LogPresetCTATab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetCTATab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Prizm],
      },
    });
  };

  // 상품 전시 컴포넌트 노출
  const logPresetDealInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      goods_component_index: string;
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      goods_component_index: `${presetId + 1}`,
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetDealInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetDealInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 상품 전시 컴포넌트 섬네일 탭
  const logPresetDealGoodsTab = (
    contentInfo: ContentLogInfoModel,
    {
      goodsId,
      goodsName,
      goodsType,
      goodsStatus,
      index,
    }: {
      goodsId: number;
      goodsName: string;
      goodsType: GoodsType;
      goodsStatus: GoodsStatusType | string;
      index: number;
    },
  ) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      contents_id: string;
      contents_name: string;
      contents_type: string;
      goods_component_index: string;
      goods_id: string;
      goods_name: string;
      goods_type: string;
      goods_status: string;
      thumbnail_component_index: string;
    } = {
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      goods_component_index: `${presetId + 1}`,
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      goods_type: goodsType ? goodsType.toLowerCase() : '',
      goods_status: getGoodsStatus(goodsStatus),
      thumbnail_component_index: `${index + 1}`,
    };
    debugLog(LogEventTypes.LogPresetDealGoodsTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetDealGoodsTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Prizm],
      },
    });
  };

  // 상품전시 컴포넌트 내 상품 썸네일 노출
  const logPresetDealGoodsInit = (
    contentInfo: ContentLogInfoModel,
    {
      goodsId,
      goodsName,
      goodsType,
      goodsStatus,
      index,
    }: {
      goodsId: number;
      goodsName: string;
      goodsType: GoodsType;
      goodsStatus: GoodsStatusType | string;
      index: number;
    },
  ) => {
    const { contentNo, contentName, type } = contentInfo;
    const logParams: {
      goods_id: string;
      goods_name: string;
      goods_type: string;
      goods_status: string;
      index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      goods_type: goodsType ? goodsType.toLowerCase() : '',
      goods_status: getGoodsStatus(goodsStatus),
      index: `${index + 1}`,
    };
    debugLog(LogEventTypes.LogPresetDealGoodsInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetDealGoodsInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 응모 컴포넌트 노출
  const logPresetDrawInit = (
    contentInfo: ContentLogInfoModel,
    { eventId, raffleType }: { eventId: number; raffleType: string },
  ) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      raffle_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      event_id: string;
      raffle_type: string;
    } = {
      raffle_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      event_id: `${eventId}`,
      raffle_type: `${raffleType}`,
    };
    debugLog(LogEventTypes.LogPresetDrawInit, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogPresetDrawInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 응모 모달 노출
  const logPresetDrawDetailInit = (
    contentInfo: ContentLogInfoModel,
    { eventId, raffleType }: { eventId: number; raffleType: string },
  ) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      raffle_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      event_id: string;
      raffle_type: string;
    } = {
      raffle_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      event_id: `${eventId}`,
      raffle_type: `${raffleType}`,
    };
    debugLog(LogEventTypes.LogPresetDrawDetailInit, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogPresetDrawDetailInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 응모 완료
  const logPresetDrawComplete = (
    contentInfo: ContentLogInfoModel,
    { eventId, raffleType }: { eventId: number; raffleType: string },
  ) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      raffle_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      event_id: string;
      raffle_type: string;
    } = {
      raffle_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      event_id: `${eventId}`,
      raffle_type: `${raffleType}`,
    };
    debugLog(LogEventTypes.LogPresetDrawComplete, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogPresetDrawComplete,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 임베드 비디오 노출
  const logPresetEmbedVideoInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      embed_component_index: string;
      contents_id: string;
      contents_type: string;
      contents_name: string;
    } = {
      embed_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_type: getLogContentType(type),
      contents_name: contentName,
    };
    debugLog(LogEventTypes.LogPresetEmbedVideoInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetEmbedVideoInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel],
      },
    });
  };

  // 임베드 비디오 영상 재생
  const logPresetEmbedVideoTab = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      embed_component_index: string;
      contents_id: string;
      contents_type: string;
      contents_name: string;
    } = {
      embed_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_type: getLogContentType(type),
      contents_name: contentName,
    };
    debugLog(LogEventTypes.LogPresetEmbedVideoTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetEmbedVideoTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel],
      },
    });
  };

  // 푸터 컴포넌트 노출
  const logPresetFooterInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type } = contentInfo;
    const logParams: {
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetFooterInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetFooterInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch],
      },
    });
  };

  // 푸터 프로필 탭 노출
  const logPresetFooterProfileTab = (
    contentInfo: ContentLogInfoModel,
    {
      showroomId,
      showroomName,
      liveId,
      onAir,
    }: {
      showroomId: number;
      showroomName: string;
      liveId: number;
      onAir: boolean;
    },
  ) => {
    const { contentNo, contentName } = contentInfo;
    let logParams: {
      contents_id: string;
      contents_name: string;
      showroom_id: string;
      showroom_name: string;
      onair: boolean;
      live_id?: string;
    } = {
      contents_id: `${contentNo}`,
      contents_name: contentName,
      showroom_id: `${showroomId}`,
      showroom_name: showroomName,
      onair: onAir,
    };

    if (onAir && !!liveId) {
      logParams = {
        ...logParams,
        live_id: `${liveId}`,
      };
    }
    debugLog(LogEventTypes.LogPresetFooterProfileTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetFooterProfileTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 헤더 컴포넌트 노출
  const logPresetHeaderInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      header_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      header_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetHeaderInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetHeaderInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 이미지 컴포넌트 노출
  const logPresetImageViewerInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      image_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      image_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetImageViewerInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetImageViewerInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 이미지 탭
  const logPresetImageViewerTab = (contentInfo: ContentLogInfoModel, actions: LandingActionModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const landingType = getLandingType(actions);
    const landingValue = actions.value;
    const logParams: {
      image_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      landing_type: string;
      value: string;
    } = {
      image_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      landing_type: landingType,
      value: landingValue,
    };
    debugLog(LogEventTypes.LogPresetImageViewerTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetImageViewerTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 인터렉티브 미디어 컴포넌트 노출
  const logPresetMediaInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      interactive_media_index: string;
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      interactive_media_index: `${presetId + 1}`,
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetMediaInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetMediaInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 미디어뷰어 컴포넌트 노출
  const logPresetMediaViewerInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      media_viewer_index: string;
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      media_viewer_index: `${presetId + 1}`,
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetMediaViewerInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetMediaViewerInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 미디어뷰어 컴포넌트 slide 미디어 노출
  const logPresetMediaViewerSlide = (contentInfo: ContentLogInfoModel, mediaIndex: number) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      media_viewer_media_index: string;
      media_viewer_index: string;
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      media_viewer_media_index: `${mediaIndex + 1}`,
      media_viewer_index: `${presetId + 1}`,
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetMediaViewerSlide, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetMediaViewerSlide,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 미디어뷰어 비디오 재생 조회
  const logPresetMediaViewerVideoView = (contentInfo: ContentLogInfoModel, viewTime: number, videoIndex: number) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      media_viewer_index: string;
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      media_viewer_media_index: string;
      duration: string;
    } = {
      media_viewer_index: `${presetId + 1}`,
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      media_viewer_media_index: `${videoIndex + 1}`,
      duration: `${viewTime}`,
    };
    debugLog(LogEventTypes.LogPresetMediaViewerVideoView, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetMediaViewerVideoView,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 미디어 뷰어 탭
  const logPresetMediaViewerTab = (
    contentInfo: ContentLogInfoModel,
    actions: LandingActionModel,
    viewerIndex: number,
  ) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const landingType = getLandingType(actions);
    const landingValue = actions.value;
    const logParams: {
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      media_viewer_index: string;
      media_viewer_media_index: string;
      landing_type: string;
      value: string;
    } = {
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      media_viewer_index: `${presetId + 1}`,
      media_viewer_media_index: `${viewerIndex + 1}`,
      landing_type: landingType,
      value: landingValue,
    };
    debugLog(LogEventTypes.LogPresetMediaViewerTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetMediaViewerTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 미디어뷰어 음소거 변경
  const logPresetMediaViewerTabMute = (contentInfo: ContentLogInfoModel, viewerIndex: number, state: boolean) => {
    const { contentNo, contentName, type, presetId, presetType } = contentInfo;
    const logParams: {
      component_type: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
      media_viewer_index: string;
      media_viewer_media_index: string;
    } = {
      component_type: getPresetType(presetType),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      media_viewer_index: `${presetId + 1}`,
      media_viewer_media_index: `${viewerIndex + 1}`,
    };
    if (state) {
      debugLog(LogEventTypes.LogPresetMediaViewerMuteOn, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogPresetMediaViewerMuteOn,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    } else {
      debugLog(LogEventTypes.LogPresetMediaViewerMuteOff, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogPresetMediaViewerMuteOff,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    }
  };

  // 네비게이션 컴포넌트 노출
  const logPresetNavigationInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      navigation_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      navigation_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };

    debugLog(LogEventTypes.LogPresetNavigationInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetNavigationInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 네비게이션 컴포넌트 탭 클릭
  const logPresetNavigationTab = (contentInfo: ContentLogInfoModel, tabIndex: number, tabTitle: string) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      navigation_component_index: string;
      contents_type: string;
      contents_id: string;
      contents_name: string;
      tab_index: string;
      tab_title: string;
    } = {
      navigation_component_index: `${presetId + 1}`,
      contents_type: getLogContentType(type),
      contents_id: `${contentNo}`,
      contents_name: contentName,
      tab_index: `${tabIndex + 1}`,
      tab_title: tabTitle,
    };

    debugLog(LogEventTypes.LogPresetNavigationTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetNavigationTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 플레이뷰어 컴포넌트 노출
  const logPresetPlayViewerInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      play_viewer_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      play_viewer_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetPlayViewerInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetPlayViewerInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 댓글 컴포넌트 진입
  const logPresetReplyInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, type } = contentInfo;
    const logParams: {
      contents_code: string;
      contents_type: string;
    } = {
      contents_code: `${contentNo}`,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetReplyInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetReplyInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 텍스트 컴포넌트 노출
  const logPresetTextInit = (contentInfo: ContentLogInfoModel) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      text_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      text_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    debugLog(LogEventTypes.LogPresetTextInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetTextInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 텍스트 음소거 변경
  const logPresetTextTabMute = (contentInfo: ContentLogInfoModel, state: boolean) => {
    const { contentNo, contentName, type, presetId } = contentInfo;
    const logParams: {
      text_component_index: string;
      contents_id: string;
      contents_name: string;
      contents_type: string;
    } = {
      text_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_name: contentName,
      contents_type: getLogContentType(type),
    };
    if (state) {
      debugLog(LogEventTypes.LogPresetTextMuteOn, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogPresetTextMuteOn,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    } else {
      debugLog(LogEventTypes.LogPresetTextMuteOff, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogPresetTextMuteOff,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    }
  };

  // 투표 컴포넌트 노출
  const logPresetVoteInit = (contentInfo: ContentLogInfoModel, { voteId }: { voteId: number }) => {
    const { contentNo, contentName, code, type, presetId } = contentInfo;
    const logParams: {
      vote_component_index: string;
      contents_id: string;
      contents_code: string;
      contents_name: string;
      contents_type: string;
      vote_id: string;
    } = {
      vote_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_code: code,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      vote_id: `${voteId}`,
    };
    debugLog(LogEventTypes.LogPresetVoteInit, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogPresetVoteInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 투표 성공 시
  const logPresetVoteComplete = (
    contentInfo: ContentLogInfoModel,
    { voteId, voteItemId, voteItemName }: { voteId: number; voteItemId: number; voteItemName: string },
  ) => {
    const { contentNo, contentName, code, type, presetId } = contentInfo;
    const logParams: {
      vote_component_index: string;
      contents_id: string;
      contents_code: string;
      contents_name: string;
      contents_type: string;
      vote_id: string;
      vote_item_id: string;
      vote_item_name: string;
    } = {
      vote_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_code: code,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      vote_id: `${voteId}`,
      vote_item_id: `${voteItemId}`,
      vote_item_name: voteItemName,
    };
    debugLog(LogEventTypes.LogPresetVoteComplete, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPresetVoteComplete,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 투표 인증서 보기 버튼 클릭
  const logPresetVoteCertificationButtonTab = (contentInfo: ContentLogInfoModel, { voteId }: { voteId: number }) => {
    const { contentNo, contentName, code, type, presetId } = contentInfo;
    const logParams: {
      vote_component_index: string;
      contents_id: string;
      contents_code: string;
      contents_name: string;
      contents_type: string;
      vote_id: string;
    } = {
      vote_component_index: `${presetId + 1}`,
      contents_id: `${contentNo}`,
      contents_code: code,
      contents_name: contentName,
      contents_type: getLogContentType(type),
      vote_id: `${voteId}`,
    };
    debugLog(LogEventTypes.LogPresetVoteCertificationButtonTab, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogPresetVoteCertificationButtonTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  return {
    logContentInit,
    logContentLiveBannerInit,
    logContentLiveBannerTab,
    logPresetReplyTab,
    logShowroomTab,
    logShowroomSnackBar,
    logShowroomSnackBarFollow,
    logPresetBannerInit,
    logPresetBannerTab,
    logPresetBenefitGoodsInit,
    logPresetBenefitListInit,
    logPresetCouponDownInit,
    logPresetCouponDownComplete,
    logPresetCTAInit,
    logPresetCTAButtonTab,
    logPresetDealInit,
    logPresetDealGoodsInit,
    logPresetDealGoodsTab,
    logPresetDrawInit,
    logPresetDrawDetailInit,
    logPresetDrawComplete,
    logPresetEmbedVideoInit,
    logPresetEmbedVideoTab,
    logPresetFooterInit,
    logPresetFooterProfileTab,
    logPresetHeaderInit,
    logPresetImageViewerInit,
    logPresetImageViewerTab,
    logPresetMediaInit,
    logPresetMediaViewerInit,
    logPresetMediaViewerSlide,
    logPresetMediaViewerVideoView,
    logPresetMediaViewerTab,
    logPresetMediaViewerTabMute,
    logPresetNavigationInit,
    logPresetNavigationTab,
    logPresetPlayViewerInit,
    logPresetReplyInit,
    logPresetTextInit,
    logPresetTextTabMute,
    logPresetVoteInit,
    logPresetVoteComplete,
    logPresetVoteCertificationButtonTab,
  };
};

const getPresetType = (presetType: PresetType): string => {
  switch (presetType) {
    case PresetType.BENEFIT_GOODS_A:
      return 'a';
    case PresetType.BENEFIT_GOODS_B:
      return 'b';
    case PresetType.MEDIA_A:
      return 'a';
    case PresetType.MEDIA_B:
      return 'b';
    case PresetType.MEDIA_VIEWER_A:
      return 'a';
    case PresetType.MEDIA_VIEWER_B:
      return 'b';
    case PresetType.DEAL_A:
      return 'a';
    case PresetType.DEAL_B:
      return 'b';
    default:
      return '';
  }
};

const getGoodsStatus = (status: GoodsStatusType | string) => {
  switch (status) {
    case GoodsNormalStatusType.NORMAL:
      return '판매중';
    case GoodsNormalStatusType.RUNOUT:
      return '품절';
    case GoodsNormalStatusType.UNSOLD:
      return '판매 중지';
    default:
      return status ?? '';
  }
};

const getLogContentType = (contentType: ContentType): string => {
  switch (contentType) {
    case ContentType.STORY:
      return 'story';
    case ContentType.TEASER:
      return 'teaser';
    default:
      return '';
  }
};

const getContentStatus = (status: ContentStatusType): string => {
  switch (status) {
    case ContentStatusType.PUBLIC:
      return '공개';
    case ContentStatusType.ADMIN_PUBLIC:
      return '관리자 공개';
    case ContentStatusType.PRIVATE:
      return '비공개';
    default:
      return '';
  }
};

const getCTAButtonType = (type: CTAButtonActionType) => {
  switch (type) {
    case CTAButtonActionType.EXTERNAL_WEB:
      return 'external';
    case CTAButtonActionType.SHOWROOM:
      return 'showroom';
    case CTAButtonActionType.CONTENT_STORY:
      return 'story';
    case CTAButtonActionType.CONTENT_TEASER:
      return 'teaser';
    case CTAButtonActionType.DEEP_LINK:
      return 'deeplink';
    default:
      return '';
  }
};
