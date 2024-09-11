import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useQuery } from '@hooks/useQuery';
import { Awaited } from '../../types';
import { ShowroomQueryKeys } from '../../constants';
import { getRegionShortcut, GetRegionShortcutParams, GetShowroomParam } from '../../apis';
import { toRegionShortcutListModel } from '../../models';

type DataItem = ReturnType<typeof toRegionShortcutListModel>;
type QueryFnData = Awaited<ReturnType<typeof getRegionShortcut>>;
type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof ShowroomQueryKeys['regionShortcut']>>;
type QueryFunctionOptions = Omit<UseQueryOptions<QueryFnData, ErrorModel, DataItem>, 'select'>;
type QueryFunctionParams = GetRegionShortcutParams & Pick<GetShowroomParam, 'showroomCode'>;

/**
 * 쇼룸 지역 숏컷 조회 Query
 */
export const useRegionShortcutListQuery = (
  { showroomCode, ...params }: QueryFunctionParams,
  options?: QueryFunctionOptions,
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionCtx) => {
    const [{ params: param }] = queryKey;
    return getRegionShortcut(param);
  }, []);

  return useQuery(ShowroomQueryKeys.regionShortcut(showroomCode, params), (ctx) => queryFn(ctx as QueryFunctionCtx), {
    cacheTime: 0,
    select: (data) => toRegionShortcutListModel(data, params),
    ...(options || {}),
  });
};
