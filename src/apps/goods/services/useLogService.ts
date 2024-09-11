import { useEffect, useCallback, useState, useRef } from 'react';
import { toDateFormat } from '@utils/date';
import type { GoodsCardProps } from '@pui/goodsCard';
import type { ContentListItemProps } from '@pui/contentListItem';
import type { EventBannerItemClickProps } from '@pui/eventBanner';
import type { GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { tracking } from '@utils/log';
import { WebLogTypes, AppLogTypes } from '@constants/log';
import { GoodsModel, CouponDownloadedModel, OptionSelectedModel } from '../models';
import { LogEventTypes, LogEventWebBranchTypes, LogEventWebFacebookTypes, RecommendationType } from '../constants';
import { debugLog } from '../utils';
import { useGoodsPageInfo } from '../hooks';

interface GoodsLogInitParams {
  detailGoods: GoodsModel;
  // 쿠폰 여부
  isCoupon: boolean;
}

// 카티고리 정보 매핑
const toCategoryFormat = (category: GoodsModel['category']) => {
  if (!category) {
    return {};
  }

  const { one, two, three } = category[0];
  return {
    category_id_a: `${one.id}`,
    category_id_b: `${two.id}`,
    category_id_c: `${three.id}`,
    category_name_a: one.name,
    category_name_b: two.name,
    category_name_c: three.name,
  };
};

export const useLogService = () => {
  const { isInLivePage } = useGoodsPageInfo();
  const isInitRef = useRef(false);
  const [goodsBaseParams, setGoodsBaseParams] = useState<GoodsLogInitParams | null>(null);

  // 상품 상세 진입 시
  const logPageInit = useCallback((params: GoodsLogInitParams) => {
    const { detailGoods, isCoupon } = params;
    const {
      liveId,
      statusText,
      salesStartDate,
      salesEndDate,
      type,
      id,
      name,
      option,
      brand,
      kind,
      category,
      ticket,
      isExistComponent,
      isExistDetailInformation,
    } = detailGoods;
    const {
      defaultOption: { price, discountRate },
    } = option;
    const { id: brandId, name: brandName } = brand ?? {};
    const { isDisplayPricingTable, place } = ticket ?? {};
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      live: isInLivePage,
      live_id: liveId ? `${liveId}` : '',
      goods_status: statusText,
      sales_start_date: toDateFormat(salesStartDate ?? 0, 'yyyy.M.d'),
      sales_end_date: toDateFormat(salesEndDate ?? 0, 'yyyy.M.d'),
      goods_type: type,
      goods_kind: kind,
      goods_id: `${id}`,
      goods_name: name,
      goods_price: price,
      af_currency: 'KRW',
      discount_rate: discountRate,
      goods_coupon: isCoupon,
      brand_name: brandName ?? '',
      brand_id: brandId ? `${brandId}` : '',
      price_list: !!isDisplayPricingTable,
      is_map: !!place,
      is_contents: isExistComponent,
      is_detail_info: isExistDetailInformation,
      ...categoryInfo,
    };
    const logWebBranchParams = {
      goods_id: logParams.goods_id,
    };
    debugLog(LogEventTypes.LogGoodsInit, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogGoodsInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Prizm],
      },
    });
    tracking.logEvent({
      name: LogEventWebBranchTypes.LogGoodsInit,
      parameters: logWebBranchParams,
      targets: {
        web: [WebLogTypes.Branch],
      },
    });
    tracking.logEvent({
      name: LogEventWebFacebookTypes.LogGoodsInit,
      targets: {
        web: [WebLogTypes.Facebook],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 요금표 버튼 탭 시
  const logTabPriceList = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category },
    } = goodsBaseParams;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogGoodsTabPriceList, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogGoodsTabPriceList,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 배너 탭 시
  const logTabBanner = useCallback(
    (itemInfo: EventBannerItemClickProps) => {
      if (goodsBaseParams === null) {
        return;
      }
      const {
        detailGoods: { id, name, type },
      } = goodsBaseParams;
      const { id: bannerId, idx: bannerIdx, title: bannerTitle } = itemInfo;
      const logParams = {
        goods_id: `${id}`,
        goods_name: name,
        goods_type: type,
        banner_id: `${bannerId}`,
        banner_name: bannerTitle,
        banner_index: `${bannerIdx + 1}`,
      };
      debugLog(LogEventTypes.LogGoodsTabBanner, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogGoodsTabBanner,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
        },
      });
    },
    [goodsBaseParams],
  );

  // Content Page (더보기) 클릭시
  const logTabContentsMore = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
    };
    debugLog(LogEventTypes.LogTabContentsMore, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabContentsMore,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // Content List 클릭시
  const logTabContentsThumbnail = useCallback((contentListInfoProps: ContentListItemProps) => {
    const { id, name, contentType, release, listIndex } = contentListInfoProps;
    const contentsStatus = release ? '공개중' : '공개예정';
    const logParams = {
      contents_id: `${id}`,
      contents_name: name,
      contents_type: contentType,
      contents_status: contentsStatus,
      contents_index: `${listIndex}`,
    };
    debugLog(LogEventTypes.LogTabContentsThumbnail, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabContentsThumbnail,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, []);

  // Review Shortcut 클릭시
  const logTabReviewShortcut = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
    };
    debugLog(LogEventTypes.LogTabReviewShortcut, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabReviewShortcut,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // Review List 더보기 클릭시
  const logTabReviewMore = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
    };
    debugLog(LogEventTypes.LogTabReviewMore, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabReviewMore,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // Review List 노출시
  const logImpressionReview = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
    };
    debugLog(LogEventTypes.LogImpressionReview, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogImpressionReview,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // Review Item 클릭시
  const logTabReviewThumbnail = useCallback(
    (reviewId: string) => {
      if (goodsBaseParams === null) {
        return;
      }
      const {
        detailGoods: { id, name },
      } = goodsBaseParams;
      const logParams = {
        review_id: reviewId,
        goods_id: `${id}`,
        goods_name: name,
      };
      debugLog(LogEventTypes.LogTabReviewThumbnail, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogTabReviewThumbnail,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        },
      });
    },
    [goodsBaseParams],
  );

  // 추천 리스트 노출시
  const logImpressionSectionGoods = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: {
        id,
        name,
        showRoom: { id: showRoomId, name: showRoomName },
      },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      showroom_id: `${showRoomId}`,
      showroom_name: showRoomName,
      recommend_type: RecommendationType.RELATION,
    };
    debugLog(LogEventTypes.LogImpressionSectionGoods, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogImpressionSectionGoods,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 추천 상품 썸네일 노출시
  const logImpressionSectionGoodsThumbnail = useCallback((goods: GoodsCardSmallProps, index: number) => {
    const { id, goodsName } = goods;
    const logParams = {
      goods_id: `${id}`,
      goods_name: goodsName,
      goods_index: `${index + 1}`,
      recommend_type: RecommendationType.RELATION,
    };
    debugLog(LogEventTypes.LogImpressionSectionGoodsThumbnail, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogImpressionSectionGoodsThumbnail,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, []);

  // 추천 상품 클릭시
  const logTabSectionGoodsThumbnail = useCallback(
    (goods: GoodsCardSmallProps, index: number) => {
      if (goodsBaseParams === null) {
        return;
      }
      const {
        detailGoods: {
          showRoom: { id: showRoomId, name: showRoomName },
        },
      } = goodsBaseParams;
      const { id, goodsName } = goods;
      const logParams = {
        goods_id: `${id}`,
        goods_name: goodsName,
        goods_index: `${index + 1}`,
        showroom_id: `${showRoomId}`,
        showroom_name: showRoomName,
        recommend_type: RecommendationType.RELATION,
      };
      debugLog(LogEventTypes.LogTabSectionGoodsThumbnail, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogTabSectionGoodsThumbnail,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        },
      });
    },
    [goodsBaseParams],
  );

  // 추천 리스트 더보기 클릭시
  const logTabSectionMore = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: {
        id,
        name,
        showRoom: { id: showRoomId, name: showRoomName },
      },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      showroom_id: `${showRoomId}`,
      showroom_name: showRoomName,
      recommend_type: RecommendationType.RELATION,
    };
    debugLog(LogEventTypes.LogTabSectionMore, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabSectionMore,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // cover swiper 시
  const logCoverSwiper = useCallback((index: number) => {
    const logParams = {
      main_media_index: `${index + 1}`,
    };
    debugLog(LogEventTypes.LogCoverSwiper, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogCoverSwiper,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, []);

  // 헤더 상단 showroom 로고 탭시 (헤더 상단)
  const logShowroomTabOnTopBar = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, showRoom },
    } = goodsBaseParams;
    const { id: showRoomId, code: showRoomCode } = showRoom ?? {};
    const logParams = {
      goods_id: `${id}`,
      showroom_id: showRoomId ? `${showRoomId}` : '',
      showroom_code: showRoomCode ?? '',
    };
    debugLog(LogEventTypes.LogShowroomLogoTabOnTopBar, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogShowroomLogoTabOnTopBar,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  }, [goodsBaseParams]);

  // showroom 로고 탭시 (상단)
  const logShowroomTabOnTop = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, showRoom },
    } = goodsBaseParams;
    const { id: showRoomId, name: showRoomName } = showRoom ?? {};
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      showroom_id: showRoomId ? `${showRoomId}` : '',
      showroom_name: showRoomName ?? '',
    };
    debugLog(LogEventTypes.LogShowroomLogoTabOnTop, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogShowroomLogoTabOnTop,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // showroom 로고 탭시 (하단)
  const logShowroomTabOnBottom = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, showRoom },
    } = goodsBaseParams;
    const { id: showRoomId } = showRoom ?? {};
    const logParams = {
      goods_id: `${id}`,
      showroom_id: showRoomId ? `${showRoomId}` : '',
    };
    debugLog(LogEventTypes.LogShowroomLogoTabOnBottom, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogShowroomLogoTabOnBottom,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 구매하기 탭시
  const logPurchaseTab = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, type, kind, ticket },
    } = goodsBaseParams;

    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_type: type,
      goods_kind: kind,
      ticket_kind: ticket?.kind ?? '',
    };
    debugLog(LogEventTypes.LogPurchaseTab, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogPurchaseTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 위시리스트에 상품을 담았을때
  const logAddToWish = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, brand, statusText, category },
    } = goodsBaseParams;
    const { id: brandId, name: brandName } = brand ?? {};
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_status: statusText,
      brand_name: brandName ?? '',
      brand_id: brandId ? `${brandId}` : '',
      ...categoryInfo,
    };
    const logWebBranchParams = {
      goods_id: logParams.goods_id,
    };
    debugLog(LogEventTypes.LogAddToWish, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogAddToWish,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Firebase, AppLogTypes.Prizm],
      },
    });
    tracking.logEvent({
      name: LogEventWebBranchTypes.LogAddToWish,
      parameters: logWebBranchParams,
      targets: {
        web: [WebLogTypes.Branch],
      },
    });
  }, [goodsBaseParams]);

  // 판매 예정 상품의 판매 알림 신청 완료시
  const logCompleteSalesNotificationIn = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, type, brand, category },
    } = goodsBaseParams;
    const { id: brandId, name: brandName } = brand ?? {};
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_type: type,
      brand_name: brandName ?? '',
      brand_id: brandId ? `${brandId}` : '',
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogCompleteSalesNotificationIn, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogCompleteSalesNotificationIn,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 판매 예정 상품의 판매 알림 신청 취소 완료시
  const logCompleteSalesNotificationOut = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, type },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_type: type,
    };
    debugLog(LogEventTypes.LogCompleteSalesNotificationOut, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogCompleteSalesNotificationOut,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 쿠폰 다운로드시
  const logCompleteCouponDownload = useCallback((couponRes: CouponDownloadedModel[]) => {
    if (couponRes.length === 0) {
      return;
    }

    const couponIds: string[] = [];
    const couponNames: string[] = [];
    const couponTypes: string[] = [];
    const costTypes: string[] = [];

    couponRes.forEach((coupon) => {
      const { couponId, display, salePolicy, useType } = coupon;
      const { name } = display;
      const { costType } = salePolicy;

      couponIds.push(`${couponId}`);
      couponNames.push(name);
      couponTypes.push(useType);
      costTypes.push(costType);
    });

    const logParams = {
      // string[]
      coupon_id: couponIds,
      // string[]
      coupon_name: couponNames,
      // string[]
      coupon_type: couponTypes,
      // string[]
      cost_type: costTypes,
    };

    debugLog(LogEventTypes.LogCompleteCouponDownload, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogCompleteCouponDownload,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Firebase],
      },
    });
  }, []);

  // 쇼룸 내 상품 탭시
  const logTabGoodsInShowroom = useCallback(
    (goods: GoodsCardProps, index: number) => {
      if (goodsBaseParams === null) {
        return;
      }

      const { id, goodsName } = goods;
      const {
        detailGoods: { showRoom },
      } = goodsBaseParams;
      const { id: showRoomId, name: showRoomName, type: showRoomType } = showRoom;

      const logParams = {
        goods_id: `${id}`,
        goods_index: `${index + 1}`,
        goods_name: goodsName,
        showroom_id: `${showRoomId}`,
        showroom_name: showRoomName,
        showroom_type: showRoomType,
      };

      debugLog(LogEventTypes.LogTabGoodsInShowroom, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogTabGoodsInShowroom,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    },
    [goodsBaseParams],
  );

  // 문의하기 탭시
  const logTabQnA = useCallback((goodsId: number) => {
    const logParams = {
      goods_id: `${goodsId}`,
    };

    debugLog(LogEventTypes.LogTabQnA, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogTabQnA,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, []);

  // 상세 이미지 탭 시
  const logTabContent = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category },
    } = goodsBaseParams;

    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      ...categoryInfo,
    };

    debugLog(LogEventTypes.LogTabContent, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabContent,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 이용 안내 탭 시
  const logTabDetailInfo = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category },
    } = goodsBaseParams;

    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      ...categoryInfo,
    };

    debugLog(LogEventTypes.LogTabDetailInfo, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabDetailInfo,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 교환/반품 안내 탭 시
  const logTabRefundInfo = useCallback(() => {
    debugLog(LogEventTypes.LogTabRefundInfo);
    tracking.logEvent({
      name: LogEventTypes.LogTabRefundInfo,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, []);

  // 상품고시/판매자 정보 탭 시
  const logTabProviderInfo = useCallback(() => {
    debugLog(LogEventTypes.LogTabProviderInfo);
    tracking.logEvent({
      name: LogEventTypes.LogTabProviderInfo,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, []);

  // 티켓 상품고시 탭 시
  const logTabTicketProviderInfo = useCallback(() => {
    debugLog(LogEventTypes.LogTabTicketProviderInfo);
    tracking.logEvent({
      name: LogEventTypes.LogTabTicketProviderInfo,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, []);

  // 연령인증 화면 진입 시
  const logViewIdentifyAdult = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
    };
    debugLog(LogEventTypes.LogViewIdentifyAdult, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogViewIdentifyAdult,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 연령인증 완료 시
  const logCompleteIdentifyAdult = useCallback((isAdult: boolean) => {
    const logParams = {
      adult_status: isAdult,
    };
    debugLog(LogEventTypes.LogCompleteIdentifyAdult, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogCompleteIdentifyAdult,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, []);

  // 상품상세 > 장바구니에 상품 추가 시 (Mweb only)
  const logAddToCart = useCallback(
    (optionSelectedParams: OptionSelectedModel) => {
      if (goodsBaseParams === null) {
        return;
      }
      const {
        detailGoods: { id, name, kind, brand, category },
      } = goodsBaseParams;
      const { id: brandId, name: brandName } = brand ?? {};
      const { id: optionId, price, discountRate, quantity } = optionSelectedParams;
      const categoryInfo = toCategoryFormat(category);
      const logParams = {
        goods_id: `${id}`,
        goods_name: name,
        goods_kind: kind,
        brand_name: brandName ?? '',
        brand_id: brandId ? `${brandId}` : '',
        option_price: price,
        discount_rate: discountRate,
        option_quantity: quantity,
        option_id: optionId,
        ...categoryInfo,
      };
      const logWebBranchParams = {
        goods_id: `${id}`,
      };
      const logWebFaceBookParams = {
        goods_id: `${id}`,
        brand_name: brandName ?? '',
        brand_id: brandId ? `${brandId}` : '',
        option_price: price,
        discount_rate: discountRate,
        option_quantity: quantity,
      };
      debugLog(LogEventTypes.LogAddToCart, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogAddToCart,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
        },
      });
      tracking.logEvent({
        name: LogEventWebBranchTypes.LogAddToCart,
        parameters: logWebBranchParams,
        targets: {
          web: [WebLogTypes.Branch],
        },
      });
      tracking.logEvent({
        name: LogEventWebFacebookTypes.LogAddToCart,
        parameters: logWebFaceBookParams,
        targets: {
          web: [WebLogTypes.Facebook],
        },
      });
    },
    [goodsBaseParams],
  );

  // 상품상세 > 구매하기(주문서) 시 (Mweb only)
  const logTabToCheckout = useCallback(
    (optionSelectedParams: OptionSelectedModel) => {
      if (goodsBaseParams === null) {
        return;
      }
      const {
        detailGoods: { id, name, kind, brand, showRoom, ticket },
      } = goodsBaseParams;
      const { id: brandId, name: brandName } = brand ?? {};
      const { onAir, liveId } = showRoom;
      const { id: optionId, price, discountRate, quantity } = optionSelectedParams;
      const logParams = {
        goods_id: `${id}`,
        goods_name: name,
        goods_kind: kind,
        ticket_kind: ticket?.kind ?? '',
        brand_name: brandName ?? '',
        brand_id: brandId ? `${brandId}` : '',
        live: onAir,
        live_id: liveId ? `${liveId}` : '',
        option_price: price,
        discount_rate: discountRate,
        option_quantity: quantity,
        option_id: optionId,
      };
      debugLog(LogEventTypes.LogTabToCheckout, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogTabToCheckout,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        },
      });
    },
    [goodsBaseParams],
  );

  // 혜택 안내 더보기 탭 시
  const logTabBenefitMore = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, category, kind, option },
    } = goodsBaseParams;
    const {
      defaultOption: { price },
    } = option;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_kind: kind,
      goods_price: price,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogTabBenefitMore, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabBenefitMore,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 취소환불 규정 더보기 탭 시
  const logTabCancelPolicyMore = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category },
    } = goodsBaseParams;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogTabCancelPolicyMore, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabCancelPolicyMore,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 상품 설명 더보기 탭 시
  const logTabDescriptionMore = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category, kind },
    } = goodsBaseParams;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_kind: kind,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogTabDescriptionMore, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabDescriptionMore,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 혜택 안내 더보기 탭 시
  const logTabCodeCopy = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, category },
    } = goodsBaseParams;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogTabCodeCopy, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabCodeCopy,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  }, [goodsBaseParams]);

  // 상품 상세 > 태그 정보 스와이프 시
  const logSwipeTagInfo = useCallback(
    (tagType: string) => {
      if (goodsBaseParams === null) {
        return;
      }
      const {
        detailGoods: { id, name, category },
      } = goodsBaseParams;
      const categoryInfo = toCategoryFormat(category);
      const logParams = {
        tag_type: tagType,
        goods_id: `${id}`,
        goods_name: name,
        ...categoryInfo,
      };
      debugLog(LogEventTypes.LogSwipeTagInfo, logParams);
      tracking.logEvent({
        name: LogEventTypes.LogSwipeTagInfo,
        parameters: logParams,
        targets: {
          web: [WebLogTypes.MixPanel],
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    },
    [goodsBaseParams],
  );

  // 상품 상세 > 지도 탭 시
  const logTabMap = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category },
    } = goodsBaseParams;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogTabMap, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabMap,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 상품 상세 > 주소 복사 탭 시
  const logTabAddressCopy = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, category },
    } = goodsBaseParams;
    const categoryInfo = toCategoryFormat(category);
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      ...categoryInfo,
    };
    debugLog(LogEventTypes.LogTabAddressCopy, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabAddressCopy,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // option 탭 시
  const logTabOption = useCallback((index: number) => {
    switch (index) {
      case 1:
        debugLog(LogEventTypes.LogTabOption2);
        tracking.logEvent({
          name: LogEventTypes.LogTabOption2,
          targets: {
            web: [WebLogTypes.MixPanel],
          },
        });
        break;
      case 2:
        debugLog(LogEventTypes.LogTabOption3);
        tracking.logEvent({
          name: LogEventTypes.LogTabOption3,
          targets: {
            web: [WebLogTypes.MixPanel],
          },
        });
        break;
      default:
        debugLog(LogEventTypes.LogTabOption1);
        tracking.logEvent({
          name: LogEventTypes.LogTabOption1,
          targets: {
            web: [WebLogTypes.MixPanel],
          },
        });
        break;
    }
  }, []);

  // 옵션블록 삭제 시
  const logTabDeleteOptionBlock = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, kind, ticket },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_kind: kind,
      ticket_kind: ticket?.kind ?? '',
    };
    debugLog(LogEventTypes.LogTabDeleteOptionBlock, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogTabDeleteOptionBlock,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  }, [goodsBaseParams]);

  // 옵션블록 생성 후 날짜선택 탭 시 뜨는 confirm message 응답 시
  const logTabReselectConfirm = useCallback((confirm: boolean) => {
    switch (confirm) {
      case false:
        debugLog(LogEventTypes.LogTabReselectConfirmClose);
        tracking.logEvent({
          name: LogEventTypes.LogTabReselectConfirmClose,
          targets: {
            web: [WebLogTypes.MixPanel],
          },
        });
        break;
      default:
        debugLog(LogEventTypes.LogTabReselectConfirm);
        tracking.logEvent({
          name: LogEventTypes.LogTabReselectConfirm,
          targets: {
            web: [WebLogTypes.MixPanel],
          },
        });
        break;
    }
  }, []);

  // 옵션 모달에서 좌석 선점 시간 종료 시 뜨는 confirm message 노출 시
  const logImpressionTimeoutConfirm = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }

    const {
      detailGoods: { id },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      selected_view: 'option',
    };

    debugLog(LogEventTypes.LogImpressionTimeoutConfirm, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogImpressionTimeoutConfirm,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  }, [goodsBaseParams]);

  // 옵션 모달 이탈 시
  const logCloseOptionModal = useCallback(() => {
    if (goodsBaseParams === null) {
      return;
    }
    const {
      detailGoods: { id, name, type, kind },
    } = goodsBaseParams;
    const logParams = {
      goods_id: `${id}`,
      goods_name: name,
      goods_type: type,
      goods_kind: kind,
    };
    debugLog(LogEventTypes.LogCloseOptionModal, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogCloseOptionModal,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [goodsBaseParams]);

  // 초기 Page 데이터 다 받았을 때 진행
  const logGoodsInit = useCallback((params: GoodsLogInitParams) => {
    setGoodsBaseParams(params);
  }, []);

  /**
   * 초기 데이터 주입
   */
  useEffect(() => {
    if (goodsBaseParams && !isInitRef.current) {
      isInitRef.current = true;
      logPageInit(goodsBaseParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodsBaseParams]);

  return {
    logGoodsInit,
    logTabPriceList,
    logTabBanner,
    logTabContentsMore,
    logTabContentsThumbnail,
    logTabReviewShortcut,
    logTabReviewMore,
    logImpressionReview,
    logTabReviewThumbnail,
    logImpressionSectionGoods,
    logImpressionSectionGoodsThumbnail,
    logTabSectionGoodsThumbnail,
    logTabSectionMore,
    logCoverSwiper,
    logShowroomTabOnTopBar,
    logShowroomTabOnTop,
    logShowroomTabOnBottom,
    logPurchaseTab,
    logAddToWish,
    logCompleteSalesNotificationIn,
    logCompleteSalesNotificationOut,
    logCompleteCouponDownload,
    logTabGoodsInShowroom,
    logTabQnA,
    logTabContent,
    logTabDetailInfo,
    logTabRefundInfo,
    logTabProviderInfo,
    logTabTicketProviderInfo,
    logViewIdentifyAdult,
    logCompleteIdentifyAdult,
    logAddToCart,
    logTabToCheckout,
    logTabBenefitMore,
    logTabCancelPolicyMore,
    logTabDescriptionMore,
    logTabCodeCopy,
    logSwipeTagInfo,
    logTabMap,
    logTabAddressCopy,
    logTabOption,
    logTabDeleteOptionBlock,
    logTabReselectConfirm,
    logImpressionTimeoutConfirm,
    logCloseOptionModal,
  };
};
