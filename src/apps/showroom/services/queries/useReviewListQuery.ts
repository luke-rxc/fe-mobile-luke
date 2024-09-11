import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useQuery } from '@hooks/useQuery';
import { Awaited } from '../../types';
import { ShowroomQueryKeys } from '../../constants';
import { getReviewList, GetReviewListParams, GetShowroomParam } from '../../apis';
import { toReviewListModel } from '../../models';

type DataItem = ReturnType<typeof toReviewListModel>;
type QueryFnData = Awaited<ReturnType<typeof getReviewList>>;
type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof ShowroomQueryKeys['reviewList']>>;
type QueryFunctionOptions = Omit<UseQueryOptions<QueryFnData, ErrorModel, DataItem>, 'select'>;
type QueryFunctionParams = GetReviewListParams & Pick<GetShowroomParam, 'showroomCode'>;

/**
 * 리뷰 리스트 조회
 */
export const useReviewListQuery = (
  { showroomCode, ...params }: QueryFunctionParams,
  options?: QueryFunctionOptions,
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionCtx) => {
    const [{ params: param }] = queryKey;
    return getReviewList(param);
  }, []);

  return useQuery(ShowroomQueryKeys.reviewList(showroomCode, params), (ctx) => queryFn(ctx as QueryFunctionCtx), {
    cacheTime: 0,
    select: (data) => toReviewListModel(data, { showroomId: params.showroomId }),
    ...(options || {}),
  });
};
