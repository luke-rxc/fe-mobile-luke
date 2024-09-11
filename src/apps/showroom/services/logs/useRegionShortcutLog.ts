import toString from 'lodash/toString';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';

/**
 * 지역 숏컷 영역 이벤트 로깅
 */
export const useRegionShortcutLog = () => {
  const LogRegionShortcutImpression = (params: {
    showroomId: number;
    showroomName: string;
    shortcutIndex: string[];
    shortcutName: string[];
  }) => {
    const { showroomId, showroomName, shortcutName, shortcutIndex } = params;

    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: toString(showroomName),
      shortcut_name: shortcutName,
      shortcut_index: shortcutIndex,
    };

    debug.log(LogEventTypes.LogImpressionSearchShortcut, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogImpressionSearchShortcut,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
      },
    });
  };

  const LogRegionShortcutTab = (params: {
    showroomId: number;
    showroomName: string;
    shortcutIndex: string;
    shortcutName: string;
  }) => {
    const { showroomId, showroomName, shortcutIndex, shortcutName } = params;

    const parameters = {
      showroom_id: showroomId,
      showroom_name: showroomName,
      shortcut_index: shortcutIndex,
      shortcut_name: shortcutName,
    };

    debug.log(LogEventTypes.LogTabSearchShortcut, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogTabSearchShortcut,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.Prizm],
      },
    });
  };

  return { LogRegionShortcutImpression, LogRegionShortcutTab };
};
