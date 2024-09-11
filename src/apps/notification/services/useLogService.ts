import { WebLogTypes, AppLogTypes } from '@constants/log';
import { tracking } from '@utils/log';
import { createDebug } from '@utils/debug';
import { LogEventTypes } from '../constants';

const debug = createDebug('notification');

export const useLogService = () => {
  // 알림피드 방문
  const logViewNotificationFeed = () => {
    debug.log(LogEventTypes.LogViewNotificationFeed);

    tracking.logEvent({
      name: LogEventTypes.LogViewNotificationFeed,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 알림피드 메시지 클릭
  const logTabMessages = ({ id, type }: { id: number; type: string }) => {
    const parameters = {
      message_id: id,
      message_type: type,
    };

    debug.log(LogEventTypes.LogTabMessages, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabMessages,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 알림피드 메시지 내 프로필 영역 클릭
  const logTabProfileImage = ({ id, type }: { id: number; type: string }) => {
    const parameters = {
      message_id: id,
      message_type: type,
    };

    debug.log(LogEventTypes.LogTabProfileImage, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabProfileImage,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 최근 본 상품 클릭
  const logTabRecentGoods = ({ id, name }: { id: number; name: string }) => {
    const parameters = {
      goods_id: `${id}`,
      goods_name: name,
    };

    debug.log(LogEventTypes.LogTabRecentGoods, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabRecentGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 캠페인 메세지 알림피드 내 노출 시
  const logImpressionCampaignMessage = ({ campaignId }: { campaignId: number }) => {
    const parameters = {
      campaign_id: campaignId,
    };

    debug.log(LogEventTypes.LogImpressionCampaignMessage, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogImpressionCampaignMessage,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel],
      },
    });
  };

  // 캠페인 메세지 알림피드 내 클릭 시
  const logTabCampaignMessage = ({ campaignId }: { campaignId: number }) => {
    const parameters = {
      campaign_id: campaignId,
    };

    debug.log(LogEventTypes.LogTabCampaignMessage, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabCampaignMessage,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
      },
    });
  };

  return {
    logViewNotificationFeed,
    logTabMessages,
    logTabProfileImage,
    logTabRecentGoods,
    logImpressionCampaignMessage,
    logTabCampaignMessage,
  };
};
