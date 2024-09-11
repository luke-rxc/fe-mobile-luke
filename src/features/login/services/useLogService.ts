import { AppLogTypes, WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { mixPanel, tracking } from '@utils/log';
import { LogEventTypes, LogEventWebBranchTypes, LogEventWebFacebookTypes } from '../constants';
import { UserJoinSchema } from '../schemas';
import { SSOAccountInfo } from '../types';

export const debugCart = createDebug('Delivery:debug');

interface LogTrackingTarget {
  web?: WebLogTypes[];
  app?: AppLogTypes[];
}

/* eslint-disable @typescript-eslint/naming-convention */
export const useLogService = () => {
  const log = (
    eventName: LogEventTypes | LogEventWebBranchTypes,
    params: Record<string, unknown>,
    targets: LogTrackingTarget,
  ) => {
    debugCart.log(`eventName: ${eventName}`, params, targets);
    tracking.logEvent({
      name: eventName,
      parameters: params,
      targets,
    });
  };

  const logViewSignIn = () => {
    log(
      LogEventTypes.LogViewSignIn,
      {},
      {
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logViewVerificationCode = (type: string) => {
    log(
      LogEventTypes.LogViewVerificationCode,
      {
        sign_up: type === 'join',
      },
      {
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logCompleteSignUp = (method: string) => {
    log(
      LogEventTypes.LogCompleteSignUp,
      {
        sign_up_method: method,
      },
      {
        web: [WebLogTypes.MixPanel],
      },
    );
    log(
      LogEventWebBranchTypes.LogCompleteSignUp,
      {
        sign_up_method: method,
      },
      {
        web: [WebLogTypes.Branch],
      },
    );
    log(
      LogEventWebFacebookTypes.LogCompleteSignUp,
      {},
      {
        web: [WebLogTypes.Facebook],
      },
    );
  };

  const logUserProperties = (user: UserJoinSchema, sso?: SSOAccountInfo) => {
    mixPanel.alias(user.userId);
    tracking.logUser({
      parameters: {
        sign_up_method: user.loginType.toLowerCase(),
        user_id: `${user.userId}`,
        sign_up_date: new Date(user.createdDate).toISOString().replace(/\..*/, ''),
        ...(sso?.ageRange && { age_range: sso?.ageRange }),
        ...(sso?.birthYear && { birth_year: sso?.birthYear }),
        ...(sso?.gender && { gender: sso?.gender }),
      },
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
    mixPanel.register({ distinct_id: user.userId });
  };

  const logCompleteSignIn = (method: string) => {
    log(
      LogEventTypes.LogCompleteSignIn,
      {
        sign_in_method: method,
      },
      {
        web: [WebLogTypes.MixPanel],
      },
    );
    log(
      LogEventWebBranchTypes.LogCompleteSignIn,
      {
        sign_in_method: method,
      },
      {
        web: [WebLogTypes.Branch],
      },
    );
  };

  return {
    logViewSignIn,
    logViewVerificationCode,
    logCompleteSignUp,
    logCompleteSignIn,
    logUserProperties,
  };
};
