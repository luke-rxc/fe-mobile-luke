import { baseApiClient } from '@utils/api';
import { FilterSchema } from 'src/apps/showroom/schemas';
import { SectionGoodsListSchema } from '../schemas';

/**
 * 콘셉트 쇼룸 섹션 > Filter 조회
 */
export const getShowroomGoodsFilterList = ({ sectionId }: GetShowroomGoodsFilterListParams) => {
  return baseApiClient.get<FilterSchema>(`/v2/showroom/section/${sectionId}/goods/filter`);
};

export interface GetShowroomGoodsFilterListParams {
  sectionId: number;
}

/**
 * 콘셉트 쇼룸 섹션 > 상품 목록 조회
 */
export const getShowroomGoodsList = ({
  sectionId,
  nextParameter = '',
  size = 8,
  sort,
  categoryFilter = 0,
}: GetShowroomSectionListParams) => {
  return baseApiClient.get<SectionGoodsListSchema>(
    `/v2/showroom/section/${sectionId}/goods?size=${size}${sort ? `&sort=${sort}` : ''}${
      categoryFilter ? `&categoryFilter=${categoryFilter}` : ''
    }${nextParameter ? `&${nextParameter}` : ''}`,
  );
};

export interface GetShowroomSectionListParams {
  sectionId: number;
  size?: number;
  nextParameter?: string;
  sort?: string;
  categoryFilter?: number;
}
