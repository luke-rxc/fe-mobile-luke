import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import range from 'lodash/range';
import toString from 'lodash/toString';
import get from 'lodash/get';
import { LogEventTypes } from '../constants';
import { ShowroomItemInfoModel, ShowroomItemModel } from '../models';

const debug = createDebug('onboarding');

export const useLogService = () => {
  // 온보딩 페이지 진입 시
  const logViewOnboardingPage = () => {
    debug.log(LogEventTypes.LogOnboardingViewPage);

    tracking.logEvent({
      name: LogEventTypes.LogOnboardingViewPage,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 온보딩 CTA 동작 시
  const logCompleteShowroomFollow = (params: ShowroomItemInfoModel[]) => {
    const parameters = {
      showroom_id: params.map((item) => item.id),
      showroom_name: params.map((item) => item.name),
    };

    debug.log(LogEventTypes.LogOnboardingCompleteShowroomFollow, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogOnboardingCompleteShowroomFollow,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 온보딩 페이지 내 쇼룸 노출 시
  const logImpressionShowroom = (last: number, size: number, params: ShowroomItemModel[]) => {
    const parameters = {
      showroom_id: params.map((item) => item.id),
      showroom_name: params.map((item) => item.name),
      showroom_index: Array.from(range(last + 1, last + size + 1, 1)),
    };

    debug.log(LogEventTypes.LogOnboardingImpressionShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogOnboardingImpressionShowroom,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 온보딩 페이지 내 전체 팔로우 탭 시
  const logTabSelectAll = (type: 'unselect_all' | 'select_all') => {
    const parameters = {
      selected_view: type,
    };

    debug.log(LogEventTypes.LogOnboardingTabSelectAll, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogOnboardingTabSelectAll,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 온보딩 페이지 내 쇼룸 탭 시
  const logTabShowroom = (params: { id: number; name: string; 'data-index': number }) => {
    const parameters = {
      showroom_id: params.id,
      showroom_name: params.name,
      showroom_index: toString(get(params, 'data-index')),
    };

    debug.log(LogEventTypes.LogOnboardingTabShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogOnboardingTabShowroom,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logViewOnboardingPage,
    logCompleteShowroomFollow,
    logImpressionShowroom,
    logTabSelectAll,
    logTabShowroom,
  };
};
