import qs from 'qs';
import { GoodsSortingType } from '@constants/goods';
import type { FilterBarProps } from '@features/filter';
import type { GoodsCardProps } from '@pui/goodsCard';
import { getBenefitTagType } from '@utils/benefitTagType';
import { getImageLink } from '@utils/link';
import { CategoryFilterAll } from '../constants';
import type { FilterSectionGroupProps } from '../components';
import type { RegionSearchQueryTypes } from '../hooks';
import type {
  ShowroomFilterSchema,
  ShowroomRegionRoomItemSchema,
  ShowroomRegionRoomSearchSchema,
  ShowroomTagFilterSchema,
} from '../schemas';

export type FilterBarModel = FilterBarProps;

export const toRoomFilterModel = ({ placeFilter, sort }: ShowroomFilterSchema): FilterBarModel => {
  const options = placeFilter.map(({ name }) => ({ value: name, label: name }));

  // 지역 필터가 2개 이상일 경우 전체 옵션 추가
  options.length > 1 && options.unshift(CategoryFilterAll);

  const [defaultOption] = options;
  const [firstSortOption] = sort;

  return {
    category: {
      options,
      defaultValue: defaultOption?.value,
    },
    sort: {
      options: sort.map(({ code, text }) => ({ value: code, label: text })),
      value: firstSortOption?.code ?? GoodsSortingType.RECOMMENDATION,
    },
  };
};

export type ShowroomRegionRoomSearchModel = RoomItemModel[];

export const toShowroomRegionRoomSearchModel = (
  { content = [] }: ShowroomRegionRoomSearchSchema,
  query: RegionSearchQueryTypes,
): ShowroomRegionRoomSearchModel => content.map((item) => toRoomItemModel(item, query));

/**
 * 객실 아이템 Model Types
 */
export type RoomItemModel = GoodsCardProps;

/**
 * 객실 아이템 Model
 */
export const toRoomItemModel = (
  { brand, goods }: ShowroomRegionRoomItemSchema,
  query: RegionSearchQueryTypes,
): RoomItemModel => {
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
      resetTrigger: qs.stringify(query, { arrayFormat: 'comma', delimiter: '-' }),
    },
    tagType: benefits?.tagType && getBenefitTagType(benefits.tagType),
    benefitLabel: benefits?.label,
    hasCoupon,
    runOut: isRunOut,
  };
};

export type RegionTagFilterModel = {
  tagFilter: FilterSectionGroupProps[];
  sanitizeTags: Array<[number, string]>;
};

export const toRegionTagFilter = (raw: ShowroomTagFilterSchema, selectedTags: number[] = []): RegionTagFilterModel => {
  const sanitizeTags = new Map<number, string>();

  // TODO: 타입 정리 예정
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nested = (data: any) => {
    // Tag 그룹
    if ('child' in data) {
      const [first] = data.child;
      const selectedCount =
        'id' in first && data.child.filter(({ id }: { id: number }) => selectedTags.includes(id)).length;

      return {
        ...data,
        ...(Number.isInteger(selectedCount) && { selectedCount }),
        child: data.child.map(nested),
      };
    }

    // count 제거
    const { count, ...rest } = data;
    const selected = selectedTags.includes(rest.id);

    selected && sanitizeTags.set(rest.id, rest.name);

    // Tag 아이템
    return {
      ...rest,
      selected,
    };
  };

  const tagFilter = raw.tagFilter.map(nested);

  return {
    tagFilter,
    sanitizeTags: Array.from(sanitizeTags),
  };
};
