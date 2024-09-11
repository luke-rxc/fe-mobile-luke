import { AppLogTypes, WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { LogEventTypes } from '../constants';

export const debugCart = createDebug('PrizmPay:debug');

interface LogTrackingTarget {
  web?: WebLogTypes[];
  app?: AppLogTypes[];
}

/* eslint-disable @typescript-eslint/naming-convention */
export const useLogService = () => {
  const log = (eventName: LogEventTypes, params: Record<string, unknown>, targets: LogTrackingTarget) => {
    debugCart.log(`eventName: ${eventName}`, params, targets);
    tracking.logEvent({
      name: eventName,
      parameters: params,
      targets,
    });
  };

  const logViewPrizmPay = () => {
    log(
      LogEventTypes.LogViewPrizmPay,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logAddPrizmPay = () => {
    log(
      LogEventTypes.LogAddPrizmPay,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logEditCardAlias = () => {
    log(
      LogEventTypes.LogEditCardAlias,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logEditDefault = () => {
    log(
      LogEventTypes.LogEditDefault,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logRemovePrizmPay = () => {
    log(
      LogEventTypes.LogRemovePrizmPay,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logTabScanCard = () => {
    log(
      LogEventTypes.LogTabScanCard,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    );
  };

  return {
    logViewPrizmPay,
    logAddPrizmPay,
    logEditCardAlias,
    logEditDefault,
    logRemovePrizmPay,
    logTabScanCard,
  };
};
