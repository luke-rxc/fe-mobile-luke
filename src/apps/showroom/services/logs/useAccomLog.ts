import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';

export const useAccomLog = () => {
  const logShowroomTabMap = (parameters: { showroomId: string; showroomName: string }) => {
    debug.log(LogEventTypes.LogShowroomTabMap, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabMap,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  const logShowroomTabAddressCopy = (parameters: { showroomId: string; showroomName: string }) => {
    debug.log(LogEventTypes.LogShowroomTabAddressCopy, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabAddressCopy,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return { logShowroomTabMap, logShowroomTabAddressCopy };
};
