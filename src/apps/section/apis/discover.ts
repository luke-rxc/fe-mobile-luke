import { baseApiClient } from '@utils/api';
import { FilterSchema } from 'src/apps/showroom/schemas';
import {
  SectionLiveListSchema,
  SectionGoodsListSchema,
  SectionContentListSchema,
  SectionShowroomListSchema,
} from '../schemas';

/**
 * 상품 섹션 > Filter 조회
 */
export const getDiscoverFilterList = ({ sectionId, sectionType }: GetDiscoverSectionFilterParams) => {
  return baseApiClient.get<FilterSchema>(`/v2/discover/feed/${sectionId}/${sectionType}/filter`);
};
export interface GetDiscoverSectionFilterParams {
  sectionId: number;
  sectionType?: string;
}

/**
 * 섹션 데이터 조회를 위한 공통 Params
 */
export interface GetDiscoverSectionBaseParams {
  sectionId: string | number;
  sort?: string;
  pageParam?: string;
  categoryFilter?: number | string;
}

/**
 * 라이브 섹션 조회
 */
export const getDiscoverSectionLive = ({ sectionId, pageParam }: GetDiscoverSectionLiveParams) => {
  return baseApiClient.get<SectionLiveListSchema>(
    `/v1/discover/feed/${sectionId}/live${pageParam ? `?${pageParam}` : ''}`,
  );
};
export type GetDiscoverSectionLiveParams = GetDiscoverSectionBaseParams;

/**
 * 상품 섹션 조회
 */
export const getDiscoverSectionGoods = ({
  sectionId,
  sort,
  pageParam,
  categoryFilter = 0,
}: GetDiscoverSectionGoodsParams) => {
  return baseApiClient.get<SectionGoodsListSchema>(
    `/v2/discover/feed/${sectionId}/goods?${sort ? `sort=${sort}` : ''}${
      categoryFilter ? `&categoryFilter=${categoryFilter}` : ''
    }${pageParam ? `&${pageParam}` : ''}`,
  );
};
export type GetDiscoverSectionGoodsParams = GetDiscoverSectionBaseParams;

/**
 * 콘텐츠 섹션 조회
 */
export const getDiscoverSectionContent = ({ sectionId, pageParam }: GetDiscoverSectionContentParams) => {
  return baseApiClient.get<SectionContentListSchema>(
    `/v1/discover/feed/${sectionId}/story${pageParam ? `?${pageParam}` : ''}`,
  );
};
export type GetDiscoverSectionContentParams = GetDiscoverSectionBaseParams;

/**
 * 브랜드 섹션 조회
 */
export const getDiscoverSectionShowroom = ({ sectionId, pageParam }: GetDiscoverSectionShowroomParams) => {
  return baseApiClient.get<SectionShowroomListSchema>(
    `/v2/discover/feed/${sectionId}/showroom${pageParam ? `?${pageParam}` : ''}`,
  );
};
export type GetDiscoverSectionShowroomParams = GetDiscoverSectionBaseParams;
