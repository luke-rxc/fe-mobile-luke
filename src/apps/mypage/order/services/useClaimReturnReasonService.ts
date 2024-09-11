import { useEffect, useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { ProcessTypes, MYPAGE_CLAIM_RETURN_REASON_QUERY_KEY, ClaimCauseTypes, ClaimTypes } from '../constants';
import { getReturnShippingCost, getReturnExchangeReasonItems, getExchangeShippingCost } from '../apis';

interface ServiceParams {
  orderId: string;
  processType?: ValueOf<typeof ProcessTypes>;
  itemInfoList: {
    itemId?: number | string;
    itemOptionId?: number | string;
    exportId?: number | string;
    goodsOptionId?: number | string;
  }[];
  claimType: 'RETURN_REQUEST' | 'EXCHANGE_REQUEST';
}

interface ReasonProps {
  code: string;
  text: string;
  cause: {
    code: string;
    name: string;
  };
}

export const useClaimReturnReasonService = ({ orderId, processType, itemInfoList, claimType }: ServiceParams) => {
  // 취소 사유 코드
  const [reasonCode, setReasonCode] = useState<string | null>(null);
  // 취소 사유 코드 오류 여부
  const [isReasonCodeError, setIsReasonCodeError] = useState(false);
  // 귀책 사유 코드
  const [causeCode, setCauseCode] = useState<string | null>(null);
  // 귀책 사유명
  const [causeName, setCauseName] = useState<string | null>(null);
  // 판매자 귀책 사유 (직접 입력)
  const [sellerCause, setSellerCause] = useState<string | null>(null);
  // 판매자 귀책 사유 오류 여부
  const [sellerCauseError, setSellerCauseError] = useState(false);
  // 유효성 여부
  const [isValid, setIsValid] = useState(false);
  // 구매자 귀책 사유에 따른 예상 배송비
  const [estimatedReturnShippingCost, setEstimatedReturnShippingCost] = useState<number | string | undefined>('');

  /**
   * 반품/교환 사유 조회
   */
  const getClaimTypeText = claimType === ClaimTypes.RETURN_REQUEST ? 'return' : 'exchange';

  const { data, error, isError, isLoading, isFetched, isSuccess } = useQuery(
    [MYPAGE_CLAIM_RETURN_REASON_QUERY_KEY, orderId, getClaimTypeText, itemInfoList],
    () => getReturnExchangeReasonItems({ orderId, claimType: getClaimTypeText, itemInfoList }),
    {
      enabled: processType === ProcessTypes.REASON && itemInfoList.length > 0,
      cacheTime: 0,
    },
  );

  const getShippingCost = claimType === ClaimTypes.RETURN_REQUEST ? getReturnShippingCost : getExchangeShippingCost;
  /**
   * 예상 반품 배송비 조회
   */
  const {
    mutateAsync: executeShippingCost,
    isLoading: isLoadingReturnShippingCost,
    isError: isErrorReturnShippingCost,
    error: returnShippingCostError,
  } = useMutation(getShippingCost);

  const handleChangeReasonCode = async ({ code, cause }: ReasonProps) => {
    setReasonCode(code || null);
    setIsReasonCodeError(!code);
    setCauseCode(cause.code);
    setCauseName(cause.name);
    const params = { orderId, reasonCode: code, reason: sellerCause, itemInfoList };
    const response = await executeShippingCost(params);
    response &&
      setEstimatedReturnShippingCost(
        claimType === ClaimTypes.RETURN_REQUEST ? response.returnShippingCost : response.exchangeShippingCost,
      );
  };

  const handleChangeDetailCause = (text: string) => {
    setSellerCause(text || null);
    setSellerCauseError(!text.trim() || text.length > 500);
  };

  useEffect(() => {
    if (causeCode === ClaimCauseTypes.SELLER) {
      setIsValid(!!sellerCause?.trim());
    } else {
      setIsValid(!!reasonCode);
    }
  }, [reasonCode, sellerCause, causeCode, sellerCauseError]);

  return {
    reasonItems: data || [],
    reasonItemsError: error,
    isReasonItemsError: isError,
    isReasonItemsLoading: isLoading,
    isReasonItemsFetched: isFetched,
    isReasonItemsSuccess: isSuccess,
    handleChangeReasonCode,
    handleChangeDetailCause,
    reasonCode,
    sellerCause,
    estimatedReturnShippingCost,
    isReasonCodeError,
    sellerCauseError,
    isValid,
    causeCode,
    causeName,
    isLoadingReturnShippingCost,
    isErrorReturnShippingCost,
    returnShippingCostError,
  };
};
