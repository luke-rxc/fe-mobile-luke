import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { CommentQueryKeys } from '../constants';

/**
 * 댓글 입력/리스트 간 연동
 * - TODO: 수정
 */
export const usePresetCommentService = ({ code }: { code: string }) => {
  const queryClient = useQueryClient();

  const handleResetList = useCallback(() => {
    queryClient.resetQueries([CommentQueryKeys.COMMENT_LIST, code]);
  }, [code, queryClient]);

  return {
    handleResetList,
  };
};
