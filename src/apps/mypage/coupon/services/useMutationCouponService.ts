import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { UpdateKeywordCouponRequestParam, postKeywordCoupon } from '../apis';
import { CouponSchema } from '../schemas';

/**
 * 키워드 쿠폰 등록 Mutation
 */
export const useMutationCouponService = (
  options?: UseMutationOptions<CouponSchema, ErrorModel, UpdateKeywordCouponRequestParam>,
) => {
  return useMutation(postKeywordCoupon, options);
};
