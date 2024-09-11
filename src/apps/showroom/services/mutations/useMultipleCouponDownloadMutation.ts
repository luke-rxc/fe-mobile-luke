import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { MultipleCouponDownloadSchema } from '../../schemas';
import { postMultipleCouponDownload, PostMultipleCouponDownloadParams } from '../../apis';

/**
 * 쿠폰 다운로드 Mutation
 */
export const useMultipleCouponDownloadMutation = (
  options?: UseMutationOptions<MultipleCouponDownloadSchema, ErrorModel, PostMultipleCouponDownloadParams>,
) => {
  return useMutation(postMultipleCouponDownload, options);
};
