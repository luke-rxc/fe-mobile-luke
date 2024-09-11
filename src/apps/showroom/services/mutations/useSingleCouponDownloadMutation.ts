import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { SingleCouponDownloadSchema } from '../../schemas';
import { postSingleCouponDownload, PostSingleCouponDownloadParams } from '../../apis';

/**
 * 단건 쿠폰 다운로드 Mutation
 */
export const useSingleCouponDownloadMutation = (
  options?: UseMutationOptions<SingleCouponDownloadSchema, ErrorModel, PostSingleCouponDownloadParams>,
) => {
  return useMutation(postSingleCouponDownload, options);
};
