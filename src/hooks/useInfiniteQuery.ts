import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery as useInfiniteQueryOriginal,
  UseInfiniteQueryOptions,
} from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = ErrorModel,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
) {
  return useInfiniteQueryOriginal(queryKey, queryFn, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
}
