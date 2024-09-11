import { useEffect, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { getQnaList } from '../apis';
import { QueryKeys } from '../constants';
import { toQnaListModel } from '../models';

export const useQnaListService = () => {
  const { receiveValues, emitClearReceiveValues, showToastMessage } = useWebInterface();

  // 토스트 메시지 전송한 ID 목록
  const toastIdsRef = useRef<number[]>([]);

  const { data, error, refetch, isError, isLoading, isFetching, isFetched, isSuccess } = useQuery(
    [QueryKeys.MAIN, QueryKeys.QNA_LIST],
    () => getQnaList(),
    {
      select: toQnaListModel,
      // 문의 등록 후 바로 갱신이 필요하므로 캐시 사용 안함
      cacheTime: 0,
    },
  );

  useEffect(() => {
    if (isEmpty(receiveValues)) return;

    const { type, id } = receiveValues as { type: string; id: number };

    if (!type || !id) return;

    if (type === 'registeredQnA' && !toastIdsRef.current.includes(id)) {
      refetch();
      showToastMessage({ message: '문의를 등록했습니다' });

      // ? id값을 통해 토스트 반복 노출되는 이슈 방지 (https://rxc.atlassian.net/browse/FE-4561)
      toastIdsRef.current.push(id);
    }

    // App 내에서도 갱신되는 케이스가 존재하는 것으로 예상되어 App 체크 제외
    emitClearReceiveValues();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return {
    requests: data,
    error,
    isError,
    isLoading,
    isFetching,
    isFetched,
    isSuccess,
  };
};
