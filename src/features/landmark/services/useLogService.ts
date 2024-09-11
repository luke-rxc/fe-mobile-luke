import { WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { LogEventTypes } from '../constants';

const debug = createDebug('services:useLogService');

export const useLogService = () => {
  // 알림 버튼 클릭 시
  const logClickBell = () => {
    debug.log(LogEventTypes.LogMyTabNotification);

    tracking.logEvent({
      name: LogEventTypes.LogMyTabNotification,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 햄버거 버튼 클릭 시
  const logClickHamburger = () => {
    debug.log(LogEventTypes.LogMyTabHamburgerBtn);

    tracking.logEvent({
      name: LogEventTypes.LogMyTabHamburgerBtn,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // Cart 버튼 클릭 시
  const logClickCart = () => {
    debug.log(LogEventTypes.LogMyTabCart);

    tracking.logEvent({
      name: LogEventTypes.LogMyTabCart,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // Navigation 메뉴 클릭 시
  const logClickNavigation = (logEvent: string) => {
    debug.log(logEvent);

    tracking.logEvent({
      name: logEvent,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logClickBell,
    logClickHamburger,
    logClickCart,
    logClickNavigation,
  };
};
