/**
 * @see https://github.com/abdalla/react-hotjar
 * @see https://help.hotjar.com/hc/en-us/articles/115011639927-Understanding-the-Tracking-Code
 */
import { hotjar as hotJar } from 'react-hotjar';

import env from '@env';
import { LogEventWebParams, LogUserWebParams, LogEventBaseParams, LogUserBaseParams } from '@models/LogModel';
import { WebLogTypes, WebUserLogTypes, AppLogTypes, AppUserLogTypes } from '@constants/log';
import { logEvent as appLogEvent, logUser as appLogUser } from '@utils/webInterface';
import { branch, facebook, mixPanel } from '@utils/log';

const { authKey, isProduction } = env;

/** ******************************************************
 * Initial SDK
 ****************************************************** */
export const initHotJar = () => {
  hotJar.initialize(authKey.hotJar.key, authKey.hotJar.version);
};

export const initMixPanel = () => {
  mixPanel.init(authKey.mixPanel, { debug: !isProduction, ignore_dnt: true });
};

/** ******************************************************
 * Tracking Web Log Methods
 ****************************************************** */
/** LogEvent Types */
const webLogEvent = (params: LogEventWebParams) => {
  const { name, parameters, targets } = params;
  targets.forEach((target: WebLogTypes) => {
    if (target === WebLogTypes.MixPanel) {
      mixPanel.track(name, parameters);
    }
    if (target === WebLogTypes.Branch) {
      branch.logEvent(name, parameters);
    }
    if (target === WebLogTypes.Facebook) {
      facebook.track(name, parameters);
    }
  });
};

/** LogEvent Types */
const webLogUser = (params: LogUserWebParams) => {
  const { parameters, targets } = params;
  targets.forEach((target: WebLogTypes) => {
    if (target === WebLogTypes.MixPanel) {
      mixPanel.logUser({ ...parameters });
    }
  });
};

/** ******************************************************
 * Tracking Universal Log Methods (Web + App)
 ****************************************************** */
export interface LogTrackingTarget {
  web?: WebLogTypes[];
  app?: AppLogTypes[];
}

export interface LogUserTrackingTarget {
  web?: WebUserLogTypes[];
  app?: AppUserLogTypes[];
}

export interface LogEventParam extends LogEventBaseParams {
  targets: LogTrackingTarget;
}

export interface LogUserParam extends LogUserBaseParams {
  targets: LogUserTrackingTarget;
}

export const logEvent = ({ name, parameters, targets }: LogEventParam) => {
  const { web: webTarget, app: appTarget } = targets;
  const webTargetExecute = () => {
    if (webTarget) {
      webLogEvent({
        name,
        parameters,
        targets: webTarget,
      });
    }
  };

  if (appTarget) {
    appLogEvent(
      {
        name,
        parameters,
        targets: appTarget,
      },
      {
        doWeb: () => {
          webTargetExecute();
        },
      },
    );
  } else {
    webTargetExecute();
  }
};

export const logUser = ({ parameters, targets }: LogUserParam) => {
  const { web: webTarget, app: appTarget } = targets;
  const webTargetExecute = () => {
    if (webTarget) {
      webLogUser({
        parameters,
        targets: webTarget,
      });
    }
  };

  if (appTarget) {
    appLogUser(
      {
        parameters,
        targets: appTarget,
      },
      {
        doWeb: () => webTargetExecute,
      },
    );
  } else {
    webTargetExecute();
  }
};
