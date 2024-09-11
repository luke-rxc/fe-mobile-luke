/**
 * 최근 본 상품 저장
 */

import { useMutation } from '@hooks/useMutation';
import { postHistory, HistoryPostParam } from '../apis';

export const useHistorySaveService = () => {
  const { mutate: historySaveMutate } = useMutation(({ goodsId, showRoomId }: HistoryPostParam) =>
    postHistory({ goodsId, showRoomId }),
  );

  return {
    historySaveMutate,
  };
};
