import toString from 'lodash/toString';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';

export const useProfileLog = () => {
  /**
   * 프로필 클릭(탭) 로깅
   */
  const logProfileTab = (params: { showroomId: number; showroomName: string; liveId?: number; onAir: boolean }) => {
    const { showroomId, showroomName, liveId, onAir } = params;
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: toString(showroomName),
      live_id: liveId && toString(liveId),
      onair: onAir,
    };

    debug.log(LogEventTypes.LogShowroomProfileTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomProfileTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 쇼룸 설명영역의 링크 클릭(탭) 로깅
   */
  const logDescriptionLinkTab = (params: { url: string }) => {
    const parameters = { landing_url: params.url };

    debug.log(LogEventTypes.LogDescriptionLinkTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogDescriptionLinkTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 쇼룸 팔로우 이벤트 로깅
   */
  const logShowroomChangeFollow = ({
    showroomId,
    showroomName,
    follow,
  }: {
    showroomId: number;
    showroomName: string;
    follow: boolean;
  }) => {
    const eventType = follow ? LogEventTypes.LogBrandFollowComplete : LogEventTypes.LogBrandUnfollowComplete;
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
    };

    debug.log(eventType, parameters);

    tracking.logEvent({
      parameters,
      name: eventType,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  return { logProfileTab, logShowroomChangeFollow, logDescriptionLinkTab };
};
