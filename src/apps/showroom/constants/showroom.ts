import {
  GetShowroomParam,
  GetGoodsListParam,
  GetSectionsListParams,
  GetShowroomFilterParam,
  GetReviewListParams,
  GetRegionShortcutParams,
} from '../apis';

/**
 * showroom query key
 */
export const ShowroomQueryKeys = {
  all: [{ scope: 'showroom-key' }] as const,

  showroom: (showroomCode: GetShowroomParam['showroomCode']) =>
    [{ ...ShowroomQueryKeys.all[0], entity: showroomCode }] as const,

  showroomInfo: (params: GetShowroomParam) =>
    [{ ...ShowroomQueryKeys.showroom(params.showroomCode)[0], sub: 'showroomInfo', params }] as const,

  showroomFilterListAll: (showroomCode: GetShowroomParam['showroomCode']) =>
    [{ ...ShowroomQueryKeys.showroom(showroomCode)[0], sub: 'showroomFilterList' }] as const,

  showroomFilterList: (showroomCode: GetShowroomParam['showroomCode'], params: GetShowroomFilterParam) =>
    [{ ...ShowroomQueryKeys.showroomFilterListAll(showroomCode)[0], params }] as const,

  goodsListAll: (showroomCode: GetShowroomParam['showroomCode']) =>
    [{ ...ShowroomQueryKeys.showroom(showroomCode)[0], sub: 'goodsList' }] as const,

  goodsList: (showroomCode: GetShowroomParam['showroomCode'], params: GetGoodsListParam) =>
    [{ ...ShowroomQueryKeys.goodsListAll(showroomCode)[0], params }] as const,

  sectionsListAll: (showroomCode: GetShowroomParam['showroomCode']) =>
    [{ ...ShowroomQueryKeys.showroom(showroomCode)[0], sub: 'sectionsList' }] as const,

  sectionList: (showroomCode: GetShowroomParam['showroomCode'], params: GetSectionsListParams) =>
    [{ ...ShowroomQueryKeys.sectionsListAll(showroomCode)[0], params }] as const,

  reviewList: (showroomCode: GetShowroomParam['showroomCode'], params: GetReviewListParams) => [
    { ...ShowroomQueryKeys.showroom(showroomCode)[0], sub: 'reviewList', params },
  ],
  regionShortcut: (showroomCode: GetShowroomParam['showroomCode'], params: GetRegionShortcutParams) => [
    { ...ShowroomQueryKeys.showroom(showroomCode)[0], sub: 'regionShortcut', params },
  ],
} as const;

/**
 * Showroom Section Types
 */
export const ShowroomSectionType = {
  GOODS: 'GOODS',
  CONTENT: 'STORY',
  SHOWROOM: 'SHOWROOM',
  DISCOVER_BANNER: 'DISCOVER_BANNER',
} as const;

/**
 * Section/Content 타이틀 내, 전체 라벨 표시 가준
 */
export const AllViewLabelingCriteriaForFeed = 4 as const;
