/**
 * banner query key
 */
export const BannerQueryKey = 'MAIN_BANNER' as const;

/**
 * shortcut query key
 */
export const ShortcutQueryKey = 'MAIN_SHORTCUT' as const;

/**
 * category shortcut query key
 */
export const CategoryShortcutQueryKey = 'MAIN_CATEGORY_SHORTCUT' as const;

/**
 * feed query key
 */
export const FeedQueryKeys = 'MAIN_FEED' as const;

/**
 * 전체 라벨 표시 가준
 */
export const AllViewLabelingCriteriaForFeed = 4;

/**
 * 피드 당 최대 아이템 노출 개수
 */
export const MaximumNumberOfItemsDisplayedInFeed = 8;

/**
 * Feed Types
 */
export const FeedType = {
  GOODS: 'GOODS',
  CONTENT: 'STORY',
  SHOWROOM: 'SHOWROOM',
  LIVE: 'LIVE',
} as const;

/**
 * 한 번에 불러올 피드 아이템 개수
 */
export const LoadMoreFeedSize = 4;

/**
 * 숏컷 배너 parallax 최대 scroll Y 값
 */
export const ShortcutBannerParallaxScrollY = 367;
