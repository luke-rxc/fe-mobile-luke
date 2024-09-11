import qs from 'qs';
import { baseApiClient } from '@utils/api';
// import { regionFilterTagsMock } from './__mocks__';
import type {
  ShowroomMetaSchema,
  ShowroomFilterSchema,
  ShowroomTagFilterSchema,
  ShowroomRegionRoomSearchSchema,
} from '../schemas';

/**
 * 쇼룸 지역 숏컷 > 검색 > 지역/날짜 브릿지 모달 지역 조회
 */
export const getShowroomRegion = ({ showroomId }: ShowroomRegionParams) => {
  return baseApiClient.get<ShowroomMetaSchema>(`/v1/showroom/${showroomId}/accom/meta`);
};

export interface ShowroomRegionParams {
  showroomId: number;
}

/**
 * 쇼룸 객실 검색 태그 필터 조회 Request Parameters
 */
interface GetShowroomTagFilterParams {
  // 쇼룸 ID
  showroomId: number;
  // 1레벨 지역명
  rootPlace: string;
}

/**
 * 쇼룸 객실 검색 태그 필터 조회 API
 */
export const getShowroomTagFilter = ({
  showroomId,
  ...params
}: GetShowroomTagFilterParams): Promise<ShowroomTagFilterSchema> => {
  // mocks
  // return Promise.resolve(regionFilterTagsMock);

  return baseApiClient.get(`/v1/showroom/${showroomId}/accom/room/filter/tag`, params);
};

/**
 * 쇼룸 객실 검색 필터 조회 Request Parameters
 */
interface GetShowroomRegionFilterParams {
  // 쇼룸 ID
  showroomId: number;
  // 1레벨 지역명
  rootPlace?: string;
}

/**
 * 쇼룸 객실 검색 필터 조회 API
 */
export const getShowroomRegionFilter = ({
  showroomId,
  ...params
}: GetShowroomRegionFilterParams): Promise<ShowroomFilterSchema> => {
  return baseApiClient.get(`/v1/showroom/${showroomId}/accom/room/filter`, params);
};

/**
 * 쇼룸 객실 검색 조회 Request Parameters
 */
interface GetShowroomSearchListParams {
  showroomId: number;
  rootPlace: string;
  startDate: number;
  endDate: number;
  placeFilter?: string;
  tagFilter?: number[];
  sort?: string;
  offset?: number;
  size?: number;
  nextParameter?: string;
}

/**
 * 쇼룸 객실 검색 조회 API
 */
export const getShowroomRegionSearchList = ({
  showroomId,
  nextParameter,
  size = 20,
  ...rest
}: GetShowroomSearchListParams): Promise<ShowroomRegionRoomSearchSchema> => {
  return baseApiClient.get(
    `/v1/showroom/${showroomId}/accom/room`,
    {
      size,
      ...rest,
      ...qs.parse(nextParameter ?? ''),
    },
    {
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
    },
  );
};
