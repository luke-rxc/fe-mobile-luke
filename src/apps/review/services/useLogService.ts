import { AppLogTypes, WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { LogEventTypes } from '../constants';

const debug = createDebug('review');

export const useLogService = () => {
  // 리뷰 리스트 페이지 진입 시
  const logViewReviewListPage = ({ type, id, name }: { type: string; id: number; name: string }) => {
    const parameters = {
      enter_type: type,
      enter_id: id,
      enter_name: name,
    };

    debug.log(LogEventTypes.LogReviewListViewPage, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogReviewListViewPage,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 리뷰 썸네일 노출 시
  const logImpressionReviewThumbnail = ({
    reviewId,
    goodsId,
    goodsName,
  }: {
    reviewId: number;
    goodsId: number;
    goodsName: string;
  }) => {
    const parameters = {
      review_id: reviewId,
      goods_id: goodsId,
      goods_name: goodsName,
    };

    debug.log(LogEventTypes.LogImpressionReviewThumbnail, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogImpressionReviewThumbnail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 리뷰 썸네일 탭 시
  const logTabReviewThumbnail = ({
    reviewId,
    goodsId,
    goodsName,
  }: {
    reviewId: number;
    goodsId: number;
    goodsName: string;
  }) => {
    const parameters = {
      review_id: reviewId,
      goods_id: goodsId,
      goods_name: goodsName,
    };

    debug.log(LogEventTypes.LogTabReviewThumbnail, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabReviewThumbnail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 리뷰 상세 조회 시
  const logViewReviewDetail = ({
    goodsId,
    goodsName,
    reviewId,
    optionId,
    optionName,
  }: {
    goodsId: number;
    goodsName: string;
    reviewId: number;
    optionId: number | null;
    optionName: string;
  }) => {
    const parameters: {
      goods_id: string;
      goods_name: string;
      review_id: string;
      option_id?: string;
      option_name?: string;
    } = {
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      review_id: `${reviewId}`,
      ...(optionId && {
        option_id: `${optionId}`,
      }),
      ...(optionName && {
        option_name: optionName,
      }),
    };

    debug.log(LogEventTypes.LogViewReviewDetail, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogViewReviewDetail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 리뷰 상세 페이지 내 컨텐츠 끝까지 구독(하단 도달)
  const logSwipeReviewDetail = ({
    goodsId,
    goodsName,
    reviewId,
    optionId,
    optionName,
  }: {
    goodsId: number;
    goodsName: string;
    reviewId: number;
    optionId: number | null;
    optionName: string;
  }) => {
    const parameters: {
      goods_id: string;
      goods_name: string;
      review_id: string;
      option_id?: string;
      option_name?: string;
    } = {
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      review_id: `${reviewId}`,
      ...(optionId && {
        option_id: `${optionId}`,
      }),
      ...(optionName && {
        option_name: optionName,
      }),
    };

    debug.log(LogEventTypes.LogSwipeReviewDetail, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogSwipeReviewDetail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 리뷰 상품 탭시
  const logTapReviewGoodsBanner = ({
    goodsId,
    goodsName,
    reviewId,
    optionId,
    optionName,
  }: {
    goodsId: number;
    goodsName: string;
    reviewId: number;
    optionId: number | null;
    optionName: string;
  }) => {
    const parameters: {
      goods_id: string;
      goods_name: string;
      review_id: string;
      option_id?: string;
      option_name?: string;
    } = {
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      review_id: `${reviewId}`,
      ...(optionId && {
        option_id: `${optionId}`,
      }),
      ...(optionName && {
        option_name: optionName,
      }),
    };

    debug.log(LogEventTypes.LogTapReviewGoodsBanner, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTapReviewGoodsBanner,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logViewReviewListPage,
    logImpressionReviewThumbnail,
    logTabReviewThumbnail,
    logViewReviewDetail,
    logSwipeReviewDetail,
    logTapReviewGoodsBanner,
  };
};
