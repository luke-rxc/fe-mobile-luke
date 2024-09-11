import React from 'react';
import isNull from 'lodash/isNull';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes } from '@constants/log';
import { LogEventTypes } from '../constants';

export type UsablePointTypes = number | null;

export const useLogService = () => {
  const isInitRef = React.useRef<boolean>(false);
  const [usablePoint, setUsablePoint] = React.useState<UsablePointTypes>(null);

  const logPointInit = (params: { usablePoint: UsablePointTypes }) => {
    setUsablePoint(params.usablePoint);
  };

  const logPageInit = ({ usablePoint: usable_point }: { usablePoint: NonNullable<UsablePointTypes> }) => {
    debug.log(LogEventTypes.LogViewPoint, { usable_point });

    tracking.logEvent({
      name: LogEventTypes.LogViewPoint,
      targets: { app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage] },
      parameters: { usable_point },
    });
  };

  React.useEffect(() => {
    if (!isNull(usablePoint) && !isInitRef.current) {
      isInitRef.current = true;
      logPageInit({ usablePoint });
    }
  }, [usablePoint]);

  return { logPointInit };
};
