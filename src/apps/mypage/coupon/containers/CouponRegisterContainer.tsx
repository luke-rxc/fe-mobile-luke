import { FormProvider } from 'react-hook-form';
import { useEffect } from 'react';
import { useLogService, useRegisterCouponService } from '../services';
import { KeywordRegisterContent } from '../components';
/**
 * My Page > 쿠폰 등록 컨테이너
 */
export const CouponRegisterContainer = () => {
  const { handleSubmitKeyword, handleChangeKeyword, formMethods, isDisabled } = useRegisterCouponService();
  const { logTabKeywordCoupon } = useLogService();

  /**
   * 쿠폰 등록 페이지 진입 시 이벤트 로깅
   */
  useEffect(() => {
    logTabKeywordCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...formMethods}>
      <KeywordRegisterContent
        onKeywordSubmit={handleSubmitKeyword}
        onChange={handleChangeKeyword}
        disabled={isDisabled}
      />
    </FormProvider>
  );
};
