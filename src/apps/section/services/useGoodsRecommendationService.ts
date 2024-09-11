import qs from 'qs';
import { useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { InfiniteData } from 'react-query';
import { createDebug } from '@utils/debug';
import { useQuery } from '@hooks/useQuery';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { TabsProps } from '@pui/tabs';
import { FilterSchema, SectionMetaDataSchema } from '../schemas';
import { GoodsRecommendationQueryKeys } from '../constants';
import { getGoodsRecommendationFilterList, getGoodsRecommendationList } from '../apis';
import { useSection, useParsedQuery } from '../hooks';
import { toSectionGoodsModel, toFilterModel, SectionGoodsListModel, SectionGoodsModel } from '../models';
import { useSectionGoodsLog } from './logs';

const debug = createDebug();

export const useGoodsRecommendationService = () => {
  const history = useHistory();
  const location = useLocation();
  const { sectionId } = useSection();
  const {
    type = 'relation',
    categoryFilter = 0,
    sort,
  } = useParsedQuery<{ type: string; categoryFilter: number; sort: string }>({ parseNumbers: true });

  const recommendType = type.toLocaleUpperCase();

  // 추가로드된 아이템만 이벤트 로깅에 적재하기 위한 인덱스값
  const goodsCountRef = useRef<number>(0);
  // 이벤트로깅시 필요한 메타데이터
  const goodsMetaRef = useRef<SectionMetaDataSchema>();
  const goodsTitleRef = useRef<string | undefined>();
  const goodsSortRef = useRef<string | undefined>(sort);

  const logger = useSectionGoodsLog(debug);
  /**
   * 추천 상품 리스트 Query
   */
  const query = useInfiniteQuery(
    [GoodsRecommendationQueryKeys.SECTION_GOODS_QUERY_KEY, categoryFilter, type, sort, sectionId],
    ({ pageParam }) =>
      getGoodsRecommendationList({ sectionId: +sectionId, type, categoryFilter: +categoryFilter, sort, pageParam }),
    {
      keepPreviousData: +categoryFilter >= 0,
      getNextPageParam: ({ nextParameter }) => nextParameter,
      select: ({ pages, pageParams }) => {
        const { title, sort: sortValue } = pages[0].metadata;

        goodsMetaRef.current = pages[0].metadata;
        goodsCountRef.current = pages.slice(0, -1).reduce((acc, cur) => acc + cur.content.length || 0, 0);
        goodsTitleRef.current = title;
        goodsSortRef.current = sortValue || sort;

        return {
          pages: toSectionGoodsModel(pages, { sectionId: +sectionId, categoryFilter: +categoryFilter, sort }),
          pageParams,
        };
      },
      onSuccess: ({ pages }: InfiniteData<ArrayElement<SectionGoodsModel>>) => {
        logger.logSectionGoodsImpression({
          ...(goodsMetaRef.current || {}),
          list: pages.slice(goodsCountRef.current),
          recommendType,
          discoverCategoryId: goodsMetaRef.current?.id,
        });
      },
    },
  );

  const getGoodsHandlers: SectionGoodsListModel['getHandlers'] = {
    onListClick: (item) => {
      logger.logSectionGoodsTab({
        ...(goodsMetaRef.current || {}),
        item,
        recommendType,
        discoverCategoryId: goodsMetaRef.current?.id,
      });
    },
  };

  /**
   * 추천 상품 리스트 Query
   */
  const filterQuery = useQuery(
    [GoodsRecommendationQueryKeys.SECTION_FILTER_QUERY_KEY, sectionId],
    () => getGoodsRecommendationFilterList({ sectionId: +sectionId }),
    { select: toFilterModel, staleTime: Infinity, cacheTime: 0 },
  );

  /**
   * 카테고리 필터 반환
   *
   * 카테고리 필터가 2개 이상인 경우 카테고리 필터 노출(이때 전체 항목 추가)
   */
  const getFilter = () => {
    if (filterQuery.data?.categoryFilter && filterQuery.data?.categoryFilter.length > 1) {
      return [{ name: '전체', id: 0 }].concat(filterQuery.data.categoryFilter);
    }

    return undefined;
  };

  const handleChangeTabFilter = (data: ArrayElement<FilterSchema['categoryFilter']>, index: number) => {
    const { id, name } = data;
    logger.logSectionGoodsFilterTab({
      ...(goodsMetaRef.current || {}),
      item: { id, name, index: index + 1 },
      recommendType,
      discoverCategoryId: goodsMetaRef.current?.id,
    });
    history.push([location.pathname, qs.stringify({ categoryFilter: id, sort, type })].join('?'));
  };

  const handleChangeTabSorting = (sortValue: string) => {
    logger.logSectionGoodsSortingTab({
      ...(goodsMetaRef.current || {}),
      sortType: sortValue,
      recommendType,
      discoverCategoryId: goodsMetaRef.current?.id,
    });
    history.push([location.pathname, qs.stringify({ categoryFilter, sort: sortValue, type })].join('?'));
  };

  useEffect(() => {
    if (sectionId && goodsMetaRef.current) {
      logger.logSectionGoodsPageView({ ...goodsMetaRef.current, recommendType });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, recommendType, goodsMetaRef.current]);

  return {
    /** goods query state */
    ...query,
    getGoodsHandlers,

    /** meta data */
    title: goodsTitleRef.current,
    sort: goodsSortRef.current,

    /** Filter & Sorting */
    filterList: getFilter(),
    sortingOptions: filterQuery.data && filterQuery.data.sort,
    selectedFilterId: +categoryFilter,
    defaultSortingValue: goodsSortRef.current,
    handleChangeTabFilter,
    handleChangeTabSorting,
  };
};
