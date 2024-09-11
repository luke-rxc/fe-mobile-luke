import { ErrorModel } from '@utils/api/createAxios';
import {
  useMutation as useMutationOriginal,
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';

export function useMutation<TData, TError = ErrorModel, TVariables = void, TContext = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutationOriginal(mutationFn, options);
}
