import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { useCallback, useRef } from 'react';
import { useQueryClient, QueryFunctionContext, UseInfiniteQueryOptions, InfiniteData } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { ShowroomQueryKeys } from '../../constants';
import { GoodsItemSchema } from '../../schemas';
import { Awaited } from '../../types';
import { getGoodsList, GetGoodsListParam, GetShowroomParam } from '../../apis';
import { toGoodsListModel } from '../../models';

type DataItem = ReturnType<typeof toGoodsListModel>[0];
type QueryFnData = Awaited<ReturnType<typeof getGoodsList>>;
type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof ShowroomQueryKeys['goodsList']>, string>;
type QueryFunctionParams = GetGoodsListParam & Pick<GetShowroomParam, 'showroomCode'>;
type QueryFunctionOptions = Omit<
  UseInfiniteQueryOptions<QueryFnData, ErrorModel, DataItem>,
  'initialData' | 'select' | 'getNextPageParam' | 'onSuccess'
> & {
  /** Filter ID */
  categoryFilter?: number;
  /** 초기데이터 */
  initialData?: LoadMoreResponseSchema<GoodsItemSchema>;
  /**
   * @param page 추가된 아이템
   * @param pages 모든 아이템
   */
  onSuccess?: (page: DataItem[], pages: DataItem[]) => void;
};

/**
 * 일반/PGN 쇼룸 하위의 상품 정보 조회를 위한 Query
 */
export const useGoodsListQuery = (params: QueryFunctionParams, options?: QueryFunctionOptions) => {
  const queryClient = useQueryClient();
  const { initialData, onSuccess, ...restOptions } = options || {};

  const { showroomCode, showroomId, sort, categoryFilter, size = 20 } = params;
  const showroomSort = useRef<string>('');

  /**
   * query Key
   */
  const key = ShowroomQueryKeys.goodsList(showroomCode, { size, categoryFilter, sort, showroomId });

  /**
   * 기본 옵션
   */
  const defaultOptions = {
    cacheTime: 0,
    staleTime: initialData && Infinity,
    initialData: initialData && { pages: [initialData], pageParams: [initialData.nextParameter] },
  };

  /**
   * 마지막 페이지의 인덱스를 반환
   */
  const getLastPageIndex = () => {
    const data = queryClient.getQueryData<InfiniteData<QueryFnData>>(key);

    if (isUndefined(data) || isEmpty(data.pages)) {
      return 0;
    }

    return data.pages.slice(0, -1).flatMap(({ content }) => content).length;
  };

  /**
   * query function
   */
  const queryFn = useCallback(({ queryKey, pageParam }: QueryFunctionCtx) => {
    const [{ params: param }] = queryKey;
    return getGoodsList({ ...param, nextParameter: pageParam });
  }, []);

  const query = useInfiniteQuery(key, (ctx) => queryFn(ctx as QueryFunctionCtx), {
    getNextPageParam: ({ nextParameter }) => nextParameter,
    select: ({ pages, pageParams }) => {
      showroomSort.current = pages[0].metadata?.sort as string;

      return {
        pages: toGoodsListModel(
          pages?.flatMap(({ content }) => content),
          params,
        ),
        pageParams,
      };
    },
    onSuccess: ({ pages }) => onSuccess?.(pages.slice(getLastPageIndex()), pages),
    ...defaultOptions,
    ...restOptions,
  });

  return { ...query, sort: showroomSort.current };
};
