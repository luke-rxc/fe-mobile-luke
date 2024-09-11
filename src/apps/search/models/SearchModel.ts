import { v4 as uuid } from 'uuid';
import type { GoodsCardSmallProps } from '@pui/goodsCardSmall';
import type { GoodsCardProps } from '@pui/goodsCard';
import type { BrandListItemMediumProps } from '@pui/brandListItemMedium';
import type { ContentCardSmallProps } from '@pui/contentCardSmall';
import type { ContentListItemProps } from '@pui/contentListItem';
import type { LiveListItemProps } from '@pui/liveListItem';
import { getAppLink, getImageLink, getUniversalLink, getWebLink } from '@utils/link';
import { AppLinkTypes, UniversalLinkTypes, WebLinkTypes } from '@constants/link';
import { getBenefitTagType } from '@utils/benefitTagType';
import { userAgent } from '@utils/ua';
import { AllViewLabelingCriteriaForSection, CategoryFilterAll } from '../constants';
import type { SearchBarProps, SearchBrandCardProps, SearchLiveCardProps } from '../components';
import type {
  GoodsItemSchema,
  SearchHistoryListSchema,
  SearchAllSchema,
  SearchGoodsQuerySchema,
  SearchGoodsListSchema,
  SearchBrandListSchema,
  SearchContentListSchema,
  SearchLiveListSchema,
  SearchAutoCompleteSchema,
  SearchRecommendationListSchema,
  SearchGoodsSectionSchema,
  GoodsHistoryListSchema,
} from '../schemas';
import type { FilterTabType, GoodsSearchQueryParams } from '../types';

/**
 * 전체 검색 결과 Model Types
 */
export interface SearchAllModel {
  goods: Array<
    GoodsCardSmallProps & {
      'data-log-goods-id': string;
      'data-log-index': number;
    }
  >;
  brands: Array<
    SearchBrandCardProps & {
      'data-log-showroom-id': string;
    }
  >;
  content: Array<
    ContentCardSmallProps & {
      'data-log-content-id': string;
    }
  >;
  live: Array<
    SearchLiveCardProps & {
      'data-log-showroom-id': string;
      'data-log-showroom-name': string;
    }
  >;
}

/**
 * 전체 검색 결과 Model
 */
export const toSearchAllModel = (data: SearchAllSchema, params?: { query?: string }): SearchAllModel => {
  const { goodsList, showRoomList, contentsList, liveList } = data;

  // Goods
  const toGoodsList: SearchAllModel['goods'] = goodsList.map(({ brand, goods }, index) => {
    const { id, code, price, discountRate, name, primaryImage, benefits, hasCoupon, isRunOut } = goods;

    return {
      goodsCode: code,
      brandName: brand?.name ?? '',
      goodsName: name,
      price,
      discountRate,
      image: {
        src: primaryImage.path ? getImageLink(primaryImage.path, 512) : '',
        blurHash: primaryImage.blurHash,
      },
      prizmOnlyTagOption: {
        resetTrigger: params?.query,
      },
      tagType: benefits?.tagType && getBenefitTagType(benefits.tagType),
      benefitLabel: benefits?.label,
      hasCoupon,
      runOut: isRunOut,
      'data-log-goods-id': `${id}`,
      'data-log-index': index + 1,
    };
  });

  // Brands
  const toBrandList: SearchAllModel['brands'] = showRoomList.map((item) => {
    const { name, id, code, primaryImage, onAir, liveId, isFollowed, backgroundColor } = item;

    return {
      title: name,
      showroomCode: code,
      imageURL: primaryImage.path,
      size: 'medium',
      onAir,
      liveId,
      followed: isFollowed,
      mainColorCode: backgroundColor,
      showroomId: id, // * NOTE: BrandCard 컴포넌트에서 사용되지 않으며 제거될 예정 (SearchBrandCard follow관련 수정 필요)
      'data-log-showroom-id': `${id}`,
    };
  });

  // Content
  const toContentCardList: SearchAllModel['content'] = contentsList.map((item) => {
    const { id, name, startDate, code, contentType, image, showRoom } = item;

    return {
      title: name,
      startDate,
      contentCode: code,
      contentType,
      imageURL: image.path,
      blurHash: image.blurHash,
      showroomCode: showRoom?.code,
      contentId: id, // * NOTE: ContentCardSmall 컴포넌트에서 사용되지 않으며 제거될 예정
      'data-log-content-id': `${id}`,
    };
  });

  // Live
  const toLiveList: SearchAllModel['live'] = liveList.map((item) => {
    const {
      id,
      web,
      scheme,
      landingStory,
      landingType,
      liveSchedule,
      scheduleDate,
      title,
      svgLogo,
      bgImage,
      chromakeyImage,
      bgColor,
      showRoom,
    } = item;

    return {
      web,
      scheme,
      onAir: liveSchedule?.live.onAir ?? false,
      liveId: liveSchedule?.live.id,
      contentCode: landingStory?.code,
      contentType: landingStory?.contentsType,
      landingType,
      scheduleId: id,
      title,
      scheduleDate,
      ...(svgLogo?.path && { logoURL: getImageLink(svgLogo.path) }),
      chromakeyURL: getImageLink(chromakeyImage.path),
      backgroundURL: getImageLink(bgImage.path),
      bgColorCode: bgColor,
      followed: liveSchedule?.isFollowed,
      showroomCode: showRoom.code,
      profileURL: showRoom.primaryImage.path ? getImageLink(showRoom?.primaryImage.path) : '',
      'data-log-showroom-id': `${showRoom.id}`,
      'data-log-showroom-name': showRoom.name,
    };
  });

  return {
    goods: toGoodsList,
    brands: toBrandList,
    content: toContentCardList,
    live: toLiveList,
  };
};

/**
 * 상품 아이템 Model Types
 */
export type GoodsItemModel = GoodsCardProps;

/**
 * 상품 아이템 Model
 */
export const toGoodsItemModel = (
  { brand, goods }: GoodsItemSchema,
  { query, categoryFilter, sort }: Pick<GoodsSearchQueryParams, 'query' | 'categoryFilter' | 'sort'> = {},
): GoodsItemModel => {
  const { id, code, primaryImage, name, price, discountRate, label, benefits, hasCoupon, isRunOut } = goods;

  return {
    goodsId: id,
    goodsCode: code,
    image: {
      src: primaryImage.path,
      blurHash: primaryImage.blurHash,
    },
    goodsName: name,
    price,
    discountRate,
    brandId: brand?.id,
    brandName: brand?.name,
    ...(brand?.primaryImage?.path && { brandImageUrl: getImageLink(brand?.primaryImage.path) }),
    label,
    prizmOnlyTagOption: {
      resetTrigger: [query, categoryFilter, sort].filter((elem) => !!elem).join('-'),
    },
    tagType: benefits?.tagType && getBenefitTagType(benefits.tagType),
    benefitLabel: benefits?.label,
    hasCoupon,
    runOut: isRunOut,
  };
};

/**
 * 최근 검색어 목록 Model Types
 */
export type SearchHistoryListModel = SearchHistoryListSchema;

/**
 * 최근 검색어 목록 Model
 */
export const toSearchHistoryListModel = (data: SearchHistoryListSchema): SearchHistoryListModel => {
  // query가 존재하지 않는 경우 제외 (null이 들어오는 경우 오류 발생 가능성 대응)
  return data.filter(({ query }) => !!query);
};

/**
 * 상품 섹션 아이템 Model
 */
export const toGoodsSectionItemModel = (content: GoodsItemSchema[]) => {
  return content.map(({ brand, goods }, index) => {
    const { id, code, price, discountRate, name, primaryImage, benefits, hasCoupon, isRunOut } = goods;

    return {
      goodsCode: code,
      brandName: brand?.name ?? '',
      goodsName: name,
      price,
      discountRate,
      image: {
        src: primaryImage.path ? getImageLink(primaryImage.path, 512) : '',
        blurHash: primaryImage.blurHash,
      },
      tagType: benefits?.tagType && getBenefitTagType(benefits.tagType),
      benefitLabel: benefits?.label,
      hasCoupon,
      runOut: isRunOut,
      'data-log-goods-id': `${id}`,
      'data-log-index': index + 1,
    };
  });
};

/**
 * 상품 섹션 리스트 Model Types
 */
export type GoodsSectionListModel = {
  items: SearchAllModel['goods'];
  sectionLink?: string;
};

/**
 * 상품 섹션 리스트 Model
 */
export const toGoodsSectionListModel = ({
  content = [],
  sectionId,
}: SearchGoodsSectionSchema): GoodsSectionListModel => {
  const items = toGoodsSectionItemModel(content);

  const { isApp } = userAgent();

  const sectionLink =
    content.length >= AllViewLabelingCriteriaForSection
      ? getUniversalLink(UniversalLinkTypes.SECTION_DISCOVER, { sectionId })
      : undefined;

  return { items, sectionLink: isApp ? sectionLink?.app : sectionLink?.web };
};

/**
 * 카테고리 필터 목록 Model
 */
export const toGoodsCategoryFilterModel = (
  categoryFilter: SearchGoodsQuerySchema['categoryFilter'] = [],
): FilterTabType[] => {
  // 카테고리 필터 count 합계
  let totalCount = 0;

  // 카테고리 필터 rename
  const renamed = categoryFilter.map(({ name: label, id: value, count }) => {
    // total sum
    totalCount += count;

    return { label, value, count };
  });

  // 카테고리 필터 전체 요소 (count 업데이트)
  const { name: label, id: value, count: defaultCount } = CategoryFilterAll;

  // 카테고리 필터 전체 요소 추가
  renamed.unshift({ label, value, count: defaultCount + totalCount });

  // 카테고리 필터가 2개 이하인 경우 (전체 + 1개 카테고리만 존재하는 경우)
  if (renamed.length <= 2) {
    return [];
  }

  return renamed;
};

/**
 * 정렬 필터 목록 Model
 */
export const toGoodsSortModel = (sort: SearchGoodsQuerySchema['sort']) =>
  sort.map(({ code, text }) => ({ label: text, value: code }));

/**
 * 상품 필터 Model
 */
export const toGoodsFilterModel = ({ categoryFilter, sort }: SearchGoodsQuerySchema) => ({
  category: toGoodsCategoryFilterModel(categoryFilter),
  sort: toGoodsSortModel(sort),
});

/**
 * 상품 리스트 Model Types
 */
export type GoodsListModel = GoodsItemModel[];

/**
 * 상품 리스트 Model
 */
export const toGoodsListModel = (
  { content = [] }: SearchGoodsListSchema,
  params?: Parameters<typeof toGoodsItemModel>[1],
): GoodsListModel => {
  return content.map((item) => toGoodsItemModel(item, params));
};

/**
 * 브랜드 목록 Model Types
 */
export type BrandSearchResultModel = BrandListItemMediumProps[];

/**
 * 쇼룸 검색 결과 Model
 */
export const toShowroomSearchResultModel = ({ content = [] }: SearchBrandListSchema): BrandSearchResultModel => {
  return content.map((item) => {
    const { id, name, code, primaryImage, onAir, liveId, isFollowed, goodsList, backgroundColor } = item;

    return {
      title: name,
      showroomId: id,
      showroomCode: code,
      imageURL: getImageLink(primaryImage.path),
      onAir,
      liveId,
      followed: isFollowed,
      goods: goodsList?.map((goods) => ({
        goodsId: goods.id,
        goodsCode: goods.code,
        goodsName: goods.name,
        price: goods.price,
        discountRate: goods.discountRate,
        image: {
          src: goods.primaryImage.path,
          blurHash: goods.primaryImage.blurHash,
        },
      })),
      mainColorCode: backgroundColor,
    };
  });
};

/**
 * 콘텐츠 목록 Model Types
 */
export type ContentSearchResultModel = ContentListItemProps[];

/**
 * 콘텐츠 검색 결과 Model
 */
export const toContentSearchResultModel = ({ content = [] }: SearchContentListSchema): ContentSearchResultModel => {
  return content.map((item) => {
    const { id, name, code, contentType, image, startDate, isActive, showRoom } = item;
    const { path, blurHash } = image;

    return {
      id,
      name,
      code,
      contentType,
      imageProps: {
        path,
        blurHash: blurHash ?? null,
      },
      startDate,
      release: isActive,
      showroomCode: showRoom?.code,
    };
  });
};

/**
 * 라이브 검색 결과 Model Types
 */
export type LiveSearchResultModel = Array<LiveListItemProps & { showroomId: number }>;

/**
 * 라이브 검색 결과 Model
 */
export const toLiveSearchResultModel = ({ content = [] }: SearchLiveListSchema): LiveSearchResultModel => {
  return content.map((item) => {
    const {
      id,
      landingStory,
      landingType,
      liveSchedule,
      scheduleDate,
      title,
      svgLogo,
      bgColor,
      bgImage,
      chromakeyImage,
      showRoom,
      web,
      scheme,
    } = item;

    return {
      web,
      scheme,
      onAir: liveSchedule?.live.onAir ?? false,
      liveId: liveSchedule?.live.id,
      contentCode: landingStory?.code,
      contentType: landingStory?.contentsType,
      landingType,
      scheduleId: id,
      title,
      scheduleDate,
      ...(svgLogo?.path && { logoURL: getImageLink(svgLogo.path) }),
      chromakeyURL: getImageLink(chromakeyImage.path),
      backgroundURL: getImageLink(bgImage.path),
      bgColorCode: bgColor,
      followed: liveSchedule?.isFollowed,
      showroomName: showRoom.name,
      showroomCode: showRoom.code,
      profileURL: showRoom.primaryImage.path ? getImageLink(showRoom?.primaryImage.path) : '',
      // 로그 트래킹에 사용되는 데이터
      showroomId: showRoom.id,
    };
  });
};

export type SearchAutoCompleteModel = SearchBarProps['autoComplete'];

/**
 * 검색 자동완성 Model
 *
 * @description 최근검색어(최대 4개) + 자동완성(N개) = 40개 (deviceId로 최근검색어를 조회)
 */
export const toSearchAutoCompleteModel = ({
  keyword,
  autoCompleteList,
  recentlyList,
}: SearchAutoCompleteSchema & { keyword: string }): SearchAutoCompleteModel => {
  return {
    keyword,
    list: [
      // 최근검색어
      ...recentlyList.map(({ id, query, searchDate }) => ({
        id,
        keyword: query,
        date: searchDate,
      })),
      // 자동완성
      ...autoCompleteList.map((item) => ({ id: uuid(), keyword: item })),
    ],
  };
};

/**
 * 추천 검색어 목록 Model Types
 */
export type SearchRecommendationListModel = SearchRecommendationListSchema;

/**
 * 추천 검색어 목록 Model
 */
export const toSearchRecommendationListModel = (
  data: SearchRecommendationListSchema,
): SearchRecommendationListModel => {
  // query가 존재하지 않는 경우 제외 (null이 들어오는 경우 오류 발생 가능성 대응)
  return data.filter(({ query }) => !!query);
};

/**
 * 최근 본 상품 리스트 Model Types
 */
export type GoodsHistoryListModel = GoodsItemModel[];

/**
 * 최근 본 상품 리스트 Model
 */
export const toGoodsHistoryListModel = ({ content = [] }: GoodsHistoryListSchema): GoodsSectionListModel => {
  const items = toGoodsSectionItemModel(content);

  const { isApp } = userAgent();

  const sectionLink =
    // eslint-disable-next-line no-nested-ternary
    content.length >= AllViewLabelingCriteriaForSection
      ? isApp
        ? getAppLink(AppLinkTypes.RECENT_GOODS_LIST)
        : getWebLink(WebLinkTypes.GOODS_HISTORY)
      : undefined;

  return { items, sectionLink };
};
