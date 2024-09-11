import { useMutation } from '@hooks/useMutation';
import { postCommentReport } from '../apis';
import { CommentPageType } from '../constants';

/**
 * 댓글 신고
 */
export const usePresetCommentReportService = ({
  commentType,
  code,
}: {
  commentType: CommentPageType;
  code: string;
}) => {
  const { mutateAsync: handleRequestReport, isLoading } = useMutation(
    ({
      replyId,
      reasonCode,
    }: {
      /** 댓글 id */
      replyId: number;
      /** 신고 코드 */
      reasonCode: number;
    }) =>
      postCommentReport({
        replyId,
        reasonCode,
        type: commentType,
        code,
      }),
  );

  return {
    isLoading,
    handleRequestReport,
  };
};
