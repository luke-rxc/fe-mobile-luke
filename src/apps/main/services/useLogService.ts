import { createDebug } from '@utils/debug';
import { useInitLog, useCategoryShortcutLog, useBannerLog, useShortcutLog, useFeedLog } from './logs';

const debug = createDebug();

export const useLogService = () => {
  return {
    ...useInitLog(debug),
    ...useFeedLog(debug),
    ...useBannerLog(debug),
    ...useShortcutLog(debug),
    ...useCategoryShortcutLog(debug),
  };
};
