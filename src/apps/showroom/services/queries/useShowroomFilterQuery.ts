import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useQuery } from '@hooks/useQuery';
import { Awaited } from '../../types';
import { ShowroomQueryKeys } from '../../constants';
import { getShowroomFilter, GetShowroomFilterParam, GetShowroomParam } from '../../apis';
import { toFilterModel } from '../../models';

type DataItem = ReturnType<typeof toFilterModel>;
type QueryFnData = Awaited<ReturnType<typeof getShowroomFilter>>;
type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof ShowroomQueryKeys['showroomFilterList']>>;
type QueryFunctionParams = GetShowroomFilterParam & Pick<GetShowroomParam, 'showroomCode'>;
type QueryFunctionOptions = Omit<UseQueryOptions<QueryFnData, ErrorModel, DataItem>, 'select'>;

/**
 * 일반 쇼룸의 상품 리스트 Filter 조회를 위한 Query
 */
export const useShowroomFilterQuery = (
  { showroomCode, showroomId, showroomType, ...params }: QueryFunctionParams,
  options?: QueryFunctionOptions,
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionCtx) => {
    const [{ params: param }] = queryKey;
    return getShowroomFilter({ ...param });
  }, []);

  return useQuery(
    ShowroomQueryKeys.showroomFilterList(showroomCode, { showroomId, ...params }),
    (ctx) => queryFn(ctx as QueryFunctionCtx),
    {
      enabled: !!showroomId && showroomType !== 'CONCEPT',
      cacheTime: 0,
      select: toFilterModel,
      ...(options || {}),
    },
  );
};
