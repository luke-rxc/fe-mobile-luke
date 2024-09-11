import { useEffect, useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import { MYPAGE_CLAIM_RETURN_METHOD_QUERY_KEY, ProcessTypes } from '../constants';
import { getReturnMethod } from '../apis';
import { useClaimStore } from '../stores';

interface ServiceParams {
  orderId: string;
  processType?: ValueOf<typeof ProcessTypes>;
  reasonItem?: {
    reasonCode: string;
    reason?: string;
  };
  itemInfoList: {
    itemId?: number | string;
    itemOptionId?: number | string;
    exportId?: number | string;
  }[];
  claimType: 'return' | 'exchange';
}

interface ReturnMethodProps {
  code: string;
  name: string;
  isDisabled: boolean;
}

export const useClaimReturnMethodService = ({ orderId, processType, itemInfoList, claimType }: ServiceParams) => {
  // 회수 방법
  const [selectedReturnMethod, setReturnMethod] = useState<string | null>(null);
  // 유효성 여부
  const [isReturnMethodValid, setReturnMethodValid] = useState(false);
  /** 반품 사유 데이터 */
  const reasonItem = useClaimStore((state) => state.reasonItem);

  /**
   * 회수 방법 조회
   */
  const { data, error, isError, isLoading, isFetched, isSuccess } = useQuery(
    [MYPAGE_CLAIM_RETURN_METHOD_QUERY_KEY, orderId, itemInfoList, reasonItem.reasonCode],
    () =>
      getReturnMethod({
        orderId,
        itemInfoList,
        reasonCode: reasonItem.reasonCode,
        ...(reasonItem.reason && { reason: reasonItem.reason }),
        claimType,
      }),
    {
      enabled: reasonItem.reasonCode !== '' && processType === ProcessTypes.RECALL,
      cacheTime: 0,
    },
  );

  const handleChangeReturnMethod = ({ code }: ReturnMethodProps) => {
    setReturnMethod(code || null);
  };

  useEffect(() => {
    setReturnMethodValid(!!selectedReturnMethod);
  }, [selectedReturnMethod]);

  return {
    returnMethodItems: data,
    returnMethodItemsError: error,
    isReturnMethodItemsError: isError,
    isReturnMethodItemsLoading: isLoading,
    isReturnMethodItemsFetched: isFetched,
    isReturnMethodItemsSuccess: isSuccess,
    selectedReturnMethod,
    isReturnMethodValid,
    handleChangeReturnMethod,
  };
};
