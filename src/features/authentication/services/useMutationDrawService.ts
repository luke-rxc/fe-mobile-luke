import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { DrawAuthenticationRequestParam, drawAuthentication } from '../apis';
import { DrawAuthSchema } from '../schemas';

/**
 * 응모 Mutation
 */
export const useMutationDrawService = (
  options?: UseMutationOptions<DrawAuthSchema, ErrorModel, DrawAuthenticationRequestParam>,
) => {
  return useMutation(drawAuthentication, options);
};
