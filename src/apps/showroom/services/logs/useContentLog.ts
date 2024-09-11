import get from 'lodash/get';
import toString from 'lodash/toString';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { toContentListModel } from '../../models';

export const useContentLog = () => {
  /**
   * 콘텐츠 아이템 클릭(탭) 로깅
   */
  const logContentTab = (
    params: ReturnType<typeof toContentListModel>['contents'][0],
    showroomId: number,
    showroomName: string,
  ) => {
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
      contents_id: toString(params.contentId),
      contents_name: params.title,
      contents_type: params.contentType.toLowerCase(),
      contents_index: toString(get(params, 'data-index')),
      contents_status: toString(get(params, 'data-status')),
    };

    debug.log(LogEventTypes.LogContentsThumbnailTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogContentsThumbnailTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 콘텐츠 전체 보기 클릭(탭) 로깅
   */
  const logContentMoreTab = (params: { showroomId: number; showroomName: string }) => {
    const parameters = {
      showroom_id: toString(params.showroomId),
      showroom_name: toString(params.showroomName),
    };

    debug.log(LogEventTypes.LogStoryMoreTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogStoryMoreTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  return { logContentTab, logContentMoreTab };
};
