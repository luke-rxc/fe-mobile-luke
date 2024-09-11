import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { CategoryShortcutItemModel } from '../../models';

export const useCategoryShortcutLog = (debug: ReturnType<typeof createDebug>) => {
  const logCategoryShortcutImpression = (params: CategoryShortcutItemModel[]) => {
    type Parameters = {
      discover_category_id: (string | undefined)[];
      discover_category_title: (string | undefined)[];
      discover_category_index: (string | undefined)[];
    };

    const parameters = params.reduce<Parameters>(
      (acc, cur, index) => ({
        discover_category_id: [...(acc.discover_category_id || []), cur.id],
        discover_category_title: [...(acc.discover_category_title || []), cur.title],
        discover_category_index: [...(acc.discover_category_index || []), `${index + 1}`],
      }),
      {} as Parameters,
    );

    debug.log(LogEventTypes.HomeImpressionCategoryshortcut, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeImpressionCategoryshortcut,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  const logCategoryShortcutTab = (params: CategoryShortcutItemModel) => {
    const parameters = {
      discover_category_id: params.id,
      discover_category_title: params.title,
      discover_category_index: (params.index || 0) + 1,
    };

    debug.log(LogEventTypes.HomeTabCategoryshortcut, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabCategoryshortcut,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return { logCategoryShortcutImpression, logCategoryShortcutTab };
};
