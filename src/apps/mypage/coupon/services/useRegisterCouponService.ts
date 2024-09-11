import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { useQueryString } from '@hooks/useQueryString';
import isEmpty from 'lodash/isEmpty';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { FormFields } from '../models';
import { useMutationCouponService } from './useMutationCouponService';
import { RegisterCouponReceiveProps, RegisterCouponQueryParams } from '../types';
import { COUPON_STRING, REGISTER_COUPON_EVENT_TYPE } from '../constants';
import { useLogService, CompleteKeywordCouponParams } from './useLogService';

/**
 * 쿠폰 등록 Service
 */
export const useRegisterCouponService = () => {
  /**
   * 키워드 입력 field 초기값
   */
  const formMethods = useForm<FormFields>({
    defaultValues: {
      keyword: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { getValues, setValue, reset, handleSubmit } = formMethods;
  const { alert, close, couponUpdated, initialValues, generateHapticFeedback } = useWebInterface();
  const { closeModal } = useModal();
  const { isApp } = useDeviceDetect();
  const { logCompleteKeywordCoupon } = useLogService();

  /**
   * 등록 버튼 비활성화 여부
   */
  const [isDisabled, setDisabled] = useState(true);

  /**
   * URL쿼리 스트링 내 couponCode 값(외부 화면에서 딥링크로 키워드 쿠폰코드 전달 시 사용)
   */
  const { couponCode } = useQueryString<RegisterCouponQueryParams>();

  /**
   * 등록 모달 닫기 호출
   */
  const closeRegisterModal = (params: RegisterCouponReceiveProps) => {
    close(
      { ...params },
      {
        doWeb: () => {
          closeModal('', { ...params });
        },
      },
    );
  };

  /**
   * 키워드 쿠폰 등록 API 호출
   */
  const { mutate: postKeywordCouponMutation } = useMutationCouponService({
    onSuccess: (data) => {
      const receiveParams = {
        type: REGISTER_COUPON_EVENT_TYPE.ON_SUCCESS,
        data: {
          couponId: data.coupon.couponId,
        },
      } as RegisterCouponReceiveProps;
      const logParams = {
        couponId: data.coupon.couponId,
        couponName: data.coupon.display.name,
        couponType: data.coupon.useType,
        costType: data.coupon.salePolicy.costType,
      } as CompleteKeywordCouponParams;
      reset();
      couponUpdated();
      logCompleteKeywordCoupon(logParams);
      generateHapticFeedback({ type: GenerateHapticFeedbackType.Success });
      closeRegisterModal(receiveParams);
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      alert({ message: error.data?.message ?? COUPON_STRING.REGISTER_MODAL.DEFAULT_ERROR_MESSAGE });
    },
  });
  /**
   * 키워드 쿠폰 등록 버튼 onSubmit 이벤트
   */
  const handleSubmitKeyword = handleSubmit(() => {
    const currentValue = formMethods.getValues();
    postKeywordCouponMutation(currentValue);
  });

  const setRegisterContent = (value: string) => {
    setValue('keyword', value);
    const currentValue = getValues('keyword');
    if (currentValue.length < 1 || currentValue.length > 20) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const decodeCouponCode = (code: string) => {
    let result = '';
    try {
      result = decodeURIComponent(code);
    } catch (error) {
      result = code;
    }
    return result;
  };

  const setAutoInputContent = (code: string) => {
    const initValue = decodeCouponCode(code);
    setRegisterContent(initValue);
  };

  /**
   * 키워드 입력 필드 onChange 이벤트
   */
  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterContent(event.target.value);
  };

  useEffect(() => {
    /**
     * 앱의 경우, url queryString에 couponCode 있는 경우 텍스트필드 세팅
     */
    if (isApp && couponCode) {
      setAutoInputContent(couponCode);
    }
    /**
     * 모웹의 경우, initialValues 내 couponCode로 전달 받아서 텍스트필드 세팅
     */
    if (!isEmpty(initialValues)) {
      const { type, data } = initialValues as RegisterCouponReceiveProps;
      if (type === REGISTER_COUPON_EVENT_TYPE.ON_OPEN) {
        if (data && data.couponCode) {
          setAutoInputContent(data.couponCode);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode, initialValues]);

  return {
    handleSubmitKeyword,
    handleChangeKeyword,
    formMethods,
    isDisabled,
  };
};
