import {
  useInitLog,
  useContentLog,
  useCouponLog,
  useGoodsLog,
  useProfileLog,
  useSectionLog,
  useReviewLog,
  useAccomLog,
  useRegionShortcutLog,
} from './logs';

/**
 * 이벤트 로깅 서비스
 */
export const useLogService = () => ({
  ...useInitLog(),
  ...useContentLog(),
  ...useCouponLog(),
  ...useGoodsLog(),
  ...useProfileLog(),
  ...useSectionLog(),
  ...useReviewLog(),
  ...useAccomLog(),
  ...useRegionShortcutLog(),
});
