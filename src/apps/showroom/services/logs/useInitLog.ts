/* eslint-disable no-underscore-dangle */
import toString from 'lodash/toString';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes, LogEventWebFacebookTypes } from '../../constants';
import {
  toShowroomModel,
  toGoodsListModel,
  toGoodsViewLogModel,
  toContentsViewLogModel,
  toSectionsViewLogModel,
  toSectionsListModel,
} from '../../models';

export const useInitLog = () => {
  /**
   * 쇼룸 진입 로깅
   */
  const logShowroomInit = (params: ReturnType<typeof toShowroomModel>) => {
    const parameters = {
      showroom_id: toString(params.id),
      showroom_name: params.name,
      showroom_type: params.type,
      is_map: params.hasMap,
      ...toContentsViewLogModel(params.content.contents),
      ...toGoodsViewLogModel(toGoodsListModel(params._goods.content)),
      ...toSectionsViewLogModel(toSectionsListModel(params._sections.content)),
    };

    debug.log(LogEventTypes.LogShowroomInit, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomInit,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
    tracking.logEvent({
      name: LogEventWebFacebookTypes.LogShowroomInit,
      targets: {
        web: [WebLogTypes.Facebook],
      },
    });
  };

  return { logShowroomInit };
};
