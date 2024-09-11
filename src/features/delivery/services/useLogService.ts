import { AppLogTypes, WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { LogEventTypes } from '../constants';

export const debugCart = createDebug('Delivery:debug');

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

  const logViewDelivery = () => {
    log(
      LogEventTypes.LogViewDelivery,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logAddShippingAddress = () => {
    log(
      LogEventTypes.LogAddShippingAddress,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  const logEditShippingAddress = () => {
    log(
      LogEventTypes.LogEditShippingAddress,
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

  const logRemoveShippingAddress = () => {
    log(
      LogEventTypes.LogRemoveShippingAddress,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  // 주문 배송지 정보 변경 완료
  const logEditOrderShippingAddress = () => {
    log(
      LogEventTypes.LogEditOrderShippingAddress,
      {},
      {
        app: [AppLogTypes.MixPanel],
      },
    );
  };

  return {
    logViewDelivery,
    logAddShippingAddress,
    logEditShippingAddress,
    logEditDefault,
    logRemoveShippingAddress,
    logEditOrderShippingAddress,
  };
};
