import { useMutation } from '@hooks/useMutation';
import { postReplyReport } from '../apis';
import { ReplyPageType } from '../constants';

/**
 * 댓글 신고
 */
export const usePresetReplyReportService = ({ replyType, code }: { replyType: ReplyPageType; code: string }) => {
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
      postReplyReport({
        replyId,
        reasonCode,
        type: replyType,
        code,
      }),
  );

  return {
    isLoading,
    handleRequestReport,
  };
};
