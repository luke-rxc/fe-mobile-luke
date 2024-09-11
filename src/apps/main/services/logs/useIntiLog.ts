import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';

/**
 * 홈 화면 진입
 */
export const useInitLog = (debug: ReturnType<typeof createDebug>) => {
  const logHomeView = () => {
    debug.log(LogEventTypes.HomeViewHome);

    tracking.logEvent({
      name: LogEventTypes.HomeViewHome,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return { logHomeView };
};
