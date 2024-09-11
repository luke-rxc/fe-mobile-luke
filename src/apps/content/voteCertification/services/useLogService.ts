import { WebLogTypes, AppLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { LogEventTypes } from '../constants';

export const debug = createDebug();
const debugLog = (type: LogEventTypes, params?: unknown, ...args: unknown[]) => {
  debug.log(`Log[${type}]: `, params, ...args);
};

export const useLogService = () => {
  // 투표 인증서 진입 노출
  const logVoteCertificationInit = ({ contentCode, voteId }: { contentCode: string; voteId: string }) => {
    const logParams = {
      contents_code: contentCode,
      vote_id: `${voteId}`,
    };

    debugLog(LogEventTypes.LogVoteCertificationInit, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogVoteCertificationInit,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 투표 공유 버튼 탭
  const logVoteShareButtonTab = ({ contentCode, voteId }: { contentCode: string; voteId: string }) => {
    const logParams = {
      contents_code: contentCode,
      vote_id: `${voteId}`,
    };

    debugLog(LogEventTypes.LogVoteShareButtonTab, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogVoteShareButtonTab,
      parameters: logParams,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  return {
    logVoteCertificationInit,
    logVoteShareButtonTab,
  };
};
