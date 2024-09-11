import toString from 'lodash/toString';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';

/**
 * 리뷰 섹션피드 영역 이벤트 로깅
 */
export const useReviewLog = () => {
  /**
   * 리뷰 영역 노출 이벤트 로깅
   */
  const LogReviewImpression = (params: { showroomId: number; showroomName: string }) => {
    const { showroomId, showroomName } = params;

    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: toString(showroomName),
    };

    debug.log(LogEventTypes.LogShowroomImpressionReview, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomImpressionReview,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 리뷰 더보기 클릭 이벤트 로깅
   */
  const LogReviewMoreTab = (params: { showroomId: number; showroomName: string }) => {
    const { showroomId, showroomName } = params;

    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: toString(showroomName),
    };

    debug.log(LogEventTypes.LogShowroomTabReviewMore, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabReviewMore,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 리뷰 아이템(썸네일) 클릭 이벤트 로깅
   */
  const LogReviewThumbnailTab = (params: { showroomId: number; showroomName: string; reviewId: string }) => {
    const { showroomId, showroomName, reviewId } = params;

    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: toString(showroomName),
      review_id: toString(reviewId),
    };

    debug.log(LogEventTypes.LogShowroomTabReviewThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabReviewThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
      },
    });
  };

  return { LogReviewImpression, LogReviewMoreTab, LogReviewThumbnailTab };
};
