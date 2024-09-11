import { useCallback } from 'react';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { debugLog } from '../utils';
import { LogEventTypes } from '../constants';

const handleEventLogging = ({
  name,
  parameters,
  targets,
}: {
  name: LogEventTypes;
  parameters: Record<string, unknown>;
  targets?: tracking.LogTrackingTarget;
}) => {
  debugLog(name, parameters);
  tracking.logEvent({
    name,
    parameters,
    targets: {
      web: [WebLogTypes.MixPanel, ...(targets?.web ?? [])],
      ...(targets?.app && { app: targets.app }),
    },
  });
};

export const useGoodsDetailLogService = () => {
  // 이용정보 > 탭 메뉴 탭 시
  const logTabDetailInfo = useCallback((goodsId: number, tabName: string) => {
    const logParams = {
      goodsId: `${goodsId}`,
      tab_name: tabName,
    };

    handleEventLogging({
      name: LogEventTypes.LogTabDetailInfoTab,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { logTabDetailInfo };
};
