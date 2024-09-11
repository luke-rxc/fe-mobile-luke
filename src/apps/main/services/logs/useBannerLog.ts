import get from 'lodash/get';
import toString from 'lodash/toString';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { toBannerListLogModel, BannerItemModel } from '../../models';

/**
 * 홈 배너 이벤트 로깅
 */
export const useBannerLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 배너영역 편성 콘텐츠 노출 시
   */
  const logBannerView = (params: BannerItemModel) => {
    const parameters = toBannerListLogModel(params);

    debug.log(LogEventTypes.HomeImpressionTopbanner, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeImpressionTopbanner,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 배너영역 편성 콘텐츠 탭 시
   */
  const logBannerTab = (params: BannerItemModel) => {
    const parameters = toBannerListLogModel(params);

    debug.log(LogEventTypes.HomeTabTopbanner, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabTopbanner,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 배너영역 편성 콘텐츠 내 쇼룸 프로필 탭 시
   */
  const logBannerShowroomTab = (params: BannerItemModel) => {
    const parameters = {
      ...toBannerListLogModel(params),
      onair: params.profileInfo.onAir,
      live_id: toString(params.profileInfo.liveId),
      showroom_id: toString(get(params, 'data-showroom-id')),
      showroom_name: toString(get(params, 'data-showroom-name')),
    };

    debug.log(LogEventTypes.HomeTabTopbannerShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabTopbannerShowroom,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return { logBannerView, logBannerTab, logBannerShowroomTab };
};
