import { useEffect, useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import { MYPAGE_CLAIM_REFUND_REASON_QUERY_KEY, ETC_REASON_CODE, ProcessTypes, ClaimTypes } from '../constants';
import { GetReasonItemsRequest, getRefundReasonItems } from '../apis';

interface ServiceParams {
  orderId: string;
  goodsKind?: GetReasonItemsRequest['goodsKind'];
  processType?: ValueOf<typeof ProcessTypes>;
  exportId?: number;
  itemInfoList?: {
    /** 주문 상품의 아이템 아이디 */
    itemId?: number | string;
    /** 주문 상품의 옵션 아이디 */
    itemOptionId?: number | string;
  }[];
  claimType: ValueOf<typeof ClaimTypes>;
}

export const useClaimCancelReasonService = ({
  orderId,
  goodsKind,
  processType,
  exportId,
  itemInfoList,
  claimType,
}: ServiceParams) => {
  // 취소 사유 코드
  const [reasonCode, setReasonCode] = useState<string | null>(null);
  // 취소 사유 코드 오류 여부
  const [isReasonCodeError, setIsReasonCodeError] = useState(false);
  // 기타 사유 여부
  const [isEtcReasonCode, setIsEtcReasonCode] = useState(false);
  // 기타 사유 (직접 입력)
  const [reason, setReason] = useState<string | null>(null);
  // 기타 사유 오류 여부
  const [isReasonError, setIsReasonError] = useState(false);
  // 유효성 여부
  const [isValid, setIsValid] = useState(false);

  const { data, error, isError, isLoading, isFetched, isSuccess } = useQuery(
    [MYPAGE_CLAIM_REFUND_REASON_QUERY_KEY, orderId, goodsKind, exportId, itemInfoList],
    () => getRefundReasonItems({ orderId, goodsKind, exportId, itemInfoList }),
    {
      enabled:
        processType === ProcessTypes.REASON &&
        (claimType !== 'REFUND_REQUEST' || (claimType === 'REFUND_REQUEST' && itemInfoList && itemInfoList.length > 0)),
      cacheTime: 0,
    },
  );

  const handleChangeReasonCode = (code: string) => {
    setReasonCode(code || null);
    setIsReasonCodeError(!code);
    setIsEtcReasonCode(code === ETC_REASON_CODE);
  };

  const handleChangeReason = (text: string) => {
    setReason(text || null);
    setIsReasonError(!text.trim() || text.length > 500);
  };

  useEffect(() => {
    if (isEtcReasonCode) {
      setIsValid(!!reason?.trim());
    } else {
      setIsValid(!!reasonCode);
    }
  }, [reasonCode, reason, isEtcReasonCode, isReasonError]);

  return {
    reasonItems: data || [],
    reasonItemsError: error,
    isReasonItemsError: isError,
    isReasonItemsLoading: isLoading,
    isReasonItemsFetched: isFetched,
    isReasonItemsSuccess: isSuccess,
    handleChangeReasonCode,
    handleChangeReason,
    reasonCode,
    reason,
    isReasonCodeError,
    isReasonError,
    isEtcReasonCode,
    isValid,
  };
};
