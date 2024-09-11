import qs from 'qs';
import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { InfiniteData } from 'react-query';
import { createDebug } from '@utils/debug';
import { useQuery } from '@hooks/useQuery';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { FilterSchema, SectionMetaDataSchema } from '../schemas';
import { CategoryQueryKeys } from '../constants';
import { getCategoryFilterList, getCategorySectionGoods } from '../apis';
import { useSection, useParsedQuery } from '../hooks';
import {
  toSectionHeaderListModel,
  toSectionGoodsModel,
  toFilterModel,
  SectionHeaderListModel,
  SectionGoodsListModel,
  SectionGoodsModel,
} from '../models';
import { useSectionGoodsLog } from './logs';

const debug = createDebug();

export const useCategoryService = () => {
  const history = useHistory();
  const location = useLocation();
  const { sectionId } = useSection();
  const { categoryFilter = 0, sort } = useParsedQuery<{ categoryFilter: number; sort: string }>({ parseNumbers: true });

  // 추가로드된 아이템만 이벤트 로깅에 적재하기 위한 인덱스값
  const categoryCountRef = useRef<number>(0);
  // 이벤트로깅시 필요한 메타데이터
  const categoryMetaRef = useRef<SectionMetaDataSchema>();
  const categoryHeaderRef = useRef<SectionHeaderListModel>();
  const categoryTitleRef = useRef<string | undefined>();
  const categorySortRef = useRef<string | undefined>(sort);

  const logger = useSectionGoodsLog(debug);
  /**
   * 카테고리섹션 상품 리스트 Query
   */
  const query = useInfiniteQuery(
    [CategoryQueryKeys.CATEGORY_SECTION_GOODS_QUERY_KEY, categoryFilter, sort, sectionId],
    ({ pageParam }) =>
      getCategorySectionGoods({ sectionId: +sectionId, categoryFilter: +categoryFilter, sort, pageParam }),
    {
      keepPreviousData: +categoryFilter >= 0,
      getNextPageParam: ({ nextParameter }) => nextParameter,
      select: ({ pages, pageParams }) => {
        const { title, headerList, sort: sortValue } = pages[0].metadata;

        categoryMetaRef.current = pages[0].metadata;
        categoryCountRef.current = pages.slice(0, -1).reduce((acc, cur) => acc + cur.content.length || 0, 0);
        categoryHeaderRef.current = categoryHeaderRef.current || (headerList && toSectionHeaderListModel(headerList));
        categoryTitleRef.current = title;
        categorySortRef.current = sortValue;

        return {
          pages: toSectionGoodsModel(pages, { sectionId: +sectionId, categoryFilter: +categoryFilter, sort }),
          pageParams,
        };
      },
      onSuccess: ({ pages }: InfiniteData<ArrayElement<SectionGoodsModel>>) => {
        logger.logSectionGoodsImpression({
          ...(categoryMetaRef.current || {}),
          list: pages.slice(categoryCountRef.current),
          discoverCategoryId: categoryMetaRef.current?.id,
        });
      },
    },
  );

  const getGoodsHandlers: SectionGoodsListModel['getHandlers'] = {
    onListClick: (item) => {
      logger.logSectionGoodsTab({
        ...(categoryMetaRef.current || {}),
        item,
        discoverCategoryId: categoryMetaRef.current?.id,
      });
    },
  };

  /**
   * 카테고리섹션 상품 리스트 Query
   */
  const filterQuery = useQuery(
    [CategoryQueryKeys.CATEGORY_SECTION_FILTER_QUERY_KEY, sectionId],
    () => getCategoryFilterList({ sectionId: +sectionId }),
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
      ...(categoryMetaRef.current || {}),
      item: { id, name, index: index + 1 },
      discoverCategoryId: categoryMetaRef.current?.id,
    });
    history.push([location.pathname, qs.stringify({ categoryFilter: id, sort })].join('?'));
  };

  const handleChangeTabSorting = (sortValue: string) => {
    logger.logSectionGoodsSortingTab({
      ...(categoryMetaRef.current || {}),
      sortType: sortValue,
      discoverCategoryId: categoryMetaRef.current?.id,
    });
    history.push([location.pathname, qs.stringify({ categoryFilter, sort: sortValue })].join('?'));
  };

  useEffect(() => {
    if (sectionId && categoryHeaderRef.current) {
      logger.logSectionGoodsPageView({ discoverCategoryId: +sectionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryHeaderRef.current]);

  return {
    /** goods query state */
    ...query,
    getGoodsHandlers,

    /** meta data */
    headers: categoryHeaderRef.current,
    title: categoryTitleRef.current,
    sort: categorySortRef.current,

    /** Filter & Sorting */
    filterList: getFilter(),
    sortingOptions: filterQuery.data && filterQuery.data.sort,
    selectedFilterId: +categoryFilter,
    defaultSortingValue: categorySortRef.current,
    handleChangeTabFilter,
    handleChangeTabSorting,
  };
};
