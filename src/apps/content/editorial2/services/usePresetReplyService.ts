import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { ReplyQueryKeys } from '../constants';

/**
 * 댓글 입력/리스트 간 연동
 * - TODO: 수정
 */
export const usePresetReplyService = ({ code }: { code: string }) => {
  const queryClient = useQueryClient();

  const handleResetList = useCallback(() => {
    queryClient.resetQueries([ReplyQueryKeys.REPLY_LIST, code]);
  }, [code, queryClient]);

  return {
    handleResetList,
  };
};
