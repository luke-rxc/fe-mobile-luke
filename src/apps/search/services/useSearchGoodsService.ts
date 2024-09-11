import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useQuery } from '@hooks/useQuery';
import type { FilterBarProps } from '@features/filter';
import { createDebug } from '@utils/debug';
import { getGoodsSearchFilter, getGoodsSearchResult } from '../apis';
import { SearchQueryKeys, CategoryFilterAll, FallbackSortingValue } from '../constants';
import { useChangeHistory } from '../hooks';
import { toGoodsFilterModel, toGoodsListModel } from '../models';
import { useLogService } from './useLogService';
import type { FilterTabType, GoodsSearchQueryParams } from '../types';

const debug = createDebug();

export const useSearchGoodsService = (params: GoodsSearchQueryParams) => {
  const { query = '', ...restParams } = params;
  const { changeHistory } = useChangeHistory();

  // 정렬 타입 (default Empty 상태)
  const [sorted, setSorted] = useState('');

  // 현재 필터 값 (default 전체)
  const currentFilterValue = +(params.categoryFilter || CategoryFilterAll.id);

  // Log
  const { logGoodsListViewPage, logGoodsListTabFilter, logGoodsListTabSorting } = useLogService();

  /**
   * 상품 필터 조회
   */
  const {
    data: goodsFilter,
    error: goodsFilterError,
    isError: isGoodsFilterError,
    isLoading: isGoodsFilterLoading,
    isFetching: isGoodsFilterFetching,
    isFetched: isGoodsFilterFetched,
    isSuccess: isGoodsFilterSuccess,
  } = useQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RESULT_GOODS_FILTER, query],
    () => getGoodsSearchFilter({ query }),
    {
      select: toGoodsFilterModel,
    },
  );

  // 필터 변경 이벤트 핸들러
  const handleChangeGoodsFilter: Required<FilterBarProps<FilterTabType>>['category']['onChange'] = (
    e,
    category,
    filterIndex,
  ) => {
    const { label, value } = category;

    debug.log('handleChangeGoodsFilter', e, category);

    // filter index는 1부터 시작으로 정의됨
    logGoodsListTabFilter({ categoryName: label, categoryId: `${value}`, filterIndex: filterIndex + 1, query });

    // 전체인 경우 filter 값 제거
    const categoryFilter = CategoryFilterAll.id === value ? undefined : value;

    changeHistory({ ...params, categoryFilter });
  };

  // 정렬 변경 이벤트 핸들러
  const handleChangeGoodsSorting: Required<
    FilterBarProps<FilterTabType, ArrayElement<NonNullable<typeof goodsFilter>['sort']>>
  >['sort']['onChange'] = (e, { value }) => {
    debug.log('handleChangeGoodsSorting', value);

    logGoodsListTabSorting({ sortedType: value, query });

    changeHistory({ ...params, sort: value });
  };

  /**
   * 상품 검색 결과 조회
   */
  const {
    data: goods,
    error: goodsError,
    isError: isGoodsError,
    isLoading: isGoodsLoading,
    isFetching: isGoodsFetching,
    hasNextPage: hasMoreGoods,
    fetchNextPage: handleLoadGoods,
  } = useInfiniteQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_RESULT_GOODS, query, { ...restParams }],
    ({ pageParam: nextParameter }) => getGoodsSearchResult({ query, nextParameter, ...restParams }),
    {
      select: ({ pages, ...rest }) => {
        const [first] = pages;

        // 정렬 조건 초기 설정
        !sorted && setSorted(first.metadata.sort);

        return {
          pages: pages.flatMap((raw) =>
            toGoodsListModel(raw, { query, categoryFilter: currentFilterValue, sort: restParams.sort }),
          ),
          ...rest,
        };
      },
      enabled: isGoodsFilterSuccess,
      getNextPageParam: ({ nextParameter }) => nextParameter,
      onError: () => {
        // 정렬 조건 초기 설정시 오류가 발생하는 경우 대체 조건 적용
        !sorted && setSorted(FallbackSortingValue);
      },
    },
  );

  useEffect(() => {
    logGoodsListViewPage({ query });

    return () => {
      // 정렬 조건 제거
      setSorted('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Filter & Sorting
    filterValue: currentFilterValue,
    sortingValue: sorted,

    // 전체 카테고리 여부
    isCategoryAll: currentFilterValue === CategoryFilterAll.id,

    // Goods Filter
    goodsFilter,
    goodsFilterError,
    isGoodsFilterError,
    isGoodsFilterLoading,
    isGoodsFilterFetching,
    isGoodsFilterFetched,
    isGoodsFilterSuccess,
    handleChangeGoodsFilter,
    handleChangeGoodsSorting,

    // Goods
    goods: goods?.pages,
    goodsError,
    isGoodsError,
    isGoodsLoading,
    isGoodsFetching,
    hasMoreGoods,
    handleLoadGoods,
  };
};
