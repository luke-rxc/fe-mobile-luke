import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useQuery } from '@hooks/useQuery';
import { Awaited } from '../../types';
import { ShowroomQueryKeys } from '../../constants';
import { getShowroom, GetShowroomParam } from '../../apis';
import { toShowroomModel } from '../../models';

type DataItem = ReturnType<typeof toShowroomModel>;
type QueryFnData = Awaited<ReturnType<typeof getShowroom>>;
type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof ShowroomQueryKeys['showroomInfo']>>;
type QueryFunctionOptions = Omit<UseQueryOptions<QueryFnData, ErrorModel, DataItem>, 'select'>;

/**
 * 쇼룸 정보 조회를 위한 Query
 */
export const useShowroomQuery = (params: GetShowroomParam, options?: QueryFunctionOptions) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionCtx) => {
    const [{ params: param }] = queryKey;
    return getShowroom(param);
  }, []);

  return useQuery(ShowroomQueryKeys.showroomInfo(params), (ctx) => queryFn(ctx as QueryFunctionCtx), {
    cacheTime: 0,
    select: toShowroomModel,
    ...(options || {}),
  });
};
