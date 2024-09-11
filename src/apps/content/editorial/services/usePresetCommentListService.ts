import { useState, useEffect, useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { deleteComment, getCommentList, getCommentReport } from '../apis';
import { CommentPageType, CommentQueryKeys } from '../constants';
import type { CommentModel, CommentReasonModel } from '../models';
import type { CommentListSchema, CommentReasonSchema } from '../schema';

/**
 * 댓글 리스트
 */
export const usePresetCommentListService = ({ type, code }: { type: CommentPageType; code: string }) => {
  const [commentList, setCommentList] = useState<CommentModel[]>([]);
  const reportIds = useRef<number[]>([]); // 신고된 댓글 id

  /** 댓글 조회 */
  const {
    data,
    isError,
    isLoading,
    isFetching,
    error: listError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    [CommentQueryKeys.COMMENT_LIST, code],
    ({ pageParam: nextParameter }) => getCommentList({ type, code }, { nextParameter }),
    {
      select: ({ pages, ...params }) => ({
        pages: pages.flatMap((commentData: CommentListSchema): CommentModel[] => {
          const { content } = commentData;
          return content.map((reply: CommentModel) => ({
            ...reply,
          }));
        }),
        ...params,
      }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
    },
  );

  /** 신고사유 조회 */
  const { data: reasonItem = [] } = useQuery([CommentQueryKeys.COMMENT_REPORT], () => getCommentReport(), {
    select: (res: CommentReasonSchema[]) => res.map((reason) => reason as CommentReasonModel),
  });

  /** 댓글 삭제 */
  const { mutateAsync: handleDeleteComment } = useMutation((replyId: number) => deleteComment(replyId));

  /** 신고 완료 성공시 */
  const handleCompleteReportComment = useCallback((comment: CommentModel) => {
    reportIds.current.push(comment.id);
    setCommentList((prev) => {
      return prev.filter((commentItem) => commentItem.id !== comment.id);
    });
  }, []);

  useEffect(() => {
    if (data?.pages) {
      const list = data.pages.filter((comment) => !reportIds.current.includes(comment.id));
      setCommentList(list);
    }
  }, [data?.pages]);

  return {
    // 댓글리스트
    commentList,
    isListFetching: isFetching,
    isListInitLoading: isLoading,
    isListError: isError,
    listError: listError as ErrorModel,
    hasNextPage,
    handleGetList: fetchNextPage,
    // 댓글 삭제
    handleDeleteComment,
    // 신고사유
    reasonItem,
    // 신고 완료
    handleCompleteReportComment,
  };
};
