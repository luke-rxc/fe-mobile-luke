import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import {
  getEndOfAfterTomorrow,
  getEndOfTwoDaysAfterTomorrow,
  periodStringToDate,
  periodDateToString,
  isValidPeriodDate,
  stringArrayToNumberArray,
} from '../utils';

export type RegionSearchQueryTypes = {
  rootPlace: string;
  startDate: number;
  endDate: number;
  placeFilter?: string;
  tagFilter?: number[];
  sort?: string;
};

type RegionSearchQueryParsedTypes = Partial<
  Omit<{ [K in keyof RegionSearchQueryTypes]: string }, 'tagFilter'> & {
    tagFilter?: string | string[];
  }
>;

type RegionSearchQueryStringifyParamTypes = Partial<
  Omit<{ [K in keyof RegionSearchQueryTypes]: string }, 'tagFilter'> & {
    tagFilter?: number[];
  }
>;

/**
 * 지역 검색 Query Hook
 */
export const useRegionSearchQuery = () => {
  const history = useHistory();
  const { pathname, search } = useLocation();

  /**
   * Query 파싱 데이터
   */
  const parsedQuery = useMemo<RegionSearchQueryTypes>(() => {
    const {
      rootPlace = '',
      startDate,
      endDate,
      tagFilter,
      ...parsed
    } = qs.parse(decodeURIComponent(search), {
      ignoreQueryPrefix: true,
      comma: true,
    }) as RegionSearchQueryParsedTypes;

    // 기간 파싱값
    const parsedPeriod = { startDate, endDate };

    // 기간 기본값
    const defaultPeriod = {
      startDate: getEndOfAfterTomorrow().getTime(),
      endDate: getEndOfTwoDaysAfterTomorrow().getTime(),
    };

    // 유효하지 않은 기간인 경우 기본값 사용
    const period = isValidPeriodDate(parsedPeriod) ? periodStringToDate(parsedPeriod) : defaultPeriod;

    // 태그 필터 숫자 배열로 변환
    const filter = stringArrayToNumberArray(tagFilter);

    return {
      rootPlace,
      ...period,
      tagFilter: filter,
      ...parsed,
    };
  }, [search]);

  /**
   * Query 업데이트
   */
  const updateQuery = (query: Partial<RegionSearchQueryTypes>) => {
    const { rootPlace, startDate, endDate } = query;

    // 업데이트할 기간
    const updatePeriod = { startDate, endDate };

    // Query 병합 및 기간 포맷 변경
    const mergeQuery = {
      ...parsedQuery,
      ...query,
      ...periodDateToString(isValidPeriodDate(updatePeriod) ? updatePeriod : parsedQuery),
    };

    // 지역 변경 여부
    const isChangedRootPlace = !!rootPlace && rootPlace !== parsedQuery.rootPlace;

    // 지역 변경 시 지역 및 기간 제외 나머지 초기화
    if (isChangedRootPlace) {
      historyReplace(pick(mergeQuery, ['rootPlace', 'startDate', 'endDate']));
      return;
    }

    historyReplace(omitBy(mergeQuery, (value) => isEmpty(value)));
  };

  /**
   * Query 문자열 변환 및 History Replace
   */
  const historyReplace = (params: RegionSearchQueryStringifyParamTypes) => {
    const queries = qs.stringify(params, { arrayFormat: 'comma' });

    history.replace([pathname, queries].join('?'));
  };

  return {
    query: parsedQuery,
    updateQuery,
  };
};
