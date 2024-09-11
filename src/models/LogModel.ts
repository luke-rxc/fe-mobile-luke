import { WebLogTypes, WebUserLogTypes, AppLogTypes, AppUserLogTypes } from '@constants/log';

/**
 * Log Event Param
 */
export type LogEventBaseParams = {
  name: string;
  parameters?: Record<string, unknown>;
};

export type LogEventAppParams =
  | LogEventBaseParams & {
      targets: AppLogTypes[];
    };

export type LogEventWebParams =
  | LogEventBaseParams & {
      targets: WebLogTypes[];
    };

/**
 * Log User Param
 */
export type LogUserBaseParams = {
  parameters?: Record<string, unknown>;
};

export type LogUserAppParams =
  | LogUserBaseParams & {
      targets: AppUserLogTypes[];
    };

export type LogUserWebParams =
  | LogUserBaseParams & {
      targets: WebUserLogTypes[];
    };
