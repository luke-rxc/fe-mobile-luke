import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { ShortcutListItemModel, toShortcutLogModel } from '../../models';

/**
 * 홈 숏컷 이벤트 로깅
 */
export const useShortcutLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 숏컷 노출 시
   */
  const logShortcutView = (params: ShortcutListItemModel[]) => {
    type Parameters = {
      banner_id: string;
      banner_type: string;
      banner_name: string;
      contents_id: string[];
      contents_name: string[];
      landing_scheme: string[];
      contents_type: string[];
      contents_index: number[];
    };

    const parameters = params.reduce<Parameters>((acc, cur) => {
      const item = toShortcutLogModel(cur);

      return {
        banner_id: acc.banner_id || item.banner_id,
        banner_type: acc.banner_type || item.banner_type,
        banner_name: acc.banner_name || item.banner_name,
        contents_id: [...(acc.contents_id || []), item.contents_id],
        contents_name: [...(acc.contents_name || []), item.contents_name],
        landing_scheme: [...(acc.landing_scheme || []), item.landing_scheme],
        contents_type: [...(acc.contents_type || []), item.contents_type],
        contents_index: [...(acc.contents_index || []), item.contents_index],
      };
    }, {} as Parameters);

    debug.log(LogEventTypes.HomeImpressionShortcutbanner, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeImpressionShortcutbanner,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 숏컷 탭 시
   */
  const logShortcutTab = (params: ShortcutListItemModel) => {
    const parameters = toShortcutLogModel(params);

    debug.log(LogEventTypes.HomeTabShortcutbanner, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabShortcutbanner,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return { logShortcutView, logShortcutTab };
};
