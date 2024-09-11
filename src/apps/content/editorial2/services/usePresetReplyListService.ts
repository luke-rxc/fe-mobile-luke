import { useState, useEffect, useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { deleteReply, getReplyList, getReplyReport } from '../apis';
import { ReplyPageType, ReplyQueryKeys } from '../constants';
import type { ReplyModel, ReplyReasonModel } from '../models';
import type { ReplyListSchema, ReplyReasonSchema } from '../schema';

/**
 * 댓글 리스트
 */
export const usePresetReplyListService = ({ type, code }: { type: ReplyPageType; code: string }) => {
  const [replyList, setReplyList] = useState<ReplyModel[]>([]);
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
    [ReplyQueryKeys.REPLY_LIST, code],
    ({ pageParam: nextParameter }) => getReplyList({ type, code }, { nextParameter }),
    {
      select: ({ pages, ...params }) => ({
        pages: pages.flatMap((replyData: ReplyListSchema): ReplyModel[] => {
          const { content } = replyData;
          return content.map((reply: ReplyModel) => ({
            ...reply,
          }));
        }),
        ...params,
      }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  /** 신고사유 조회 */
  const { data: reasonItem = [] } = useQuery([ReplyQueryKeys.REPLY_REPORT], () => getReplyReport(), {
    select: (res: ReplyReasonSchema[]) => res.map((reason) => reason as ReplyReasonModel),
  });

  /** 댓글 삭제 */
  const { mutateAsync: handleDeleteReply } = useMutation((replyId: number) => deleteReply(replyId));

  /** 신고 완료 성공시 */
  const handleCompleteReportReply = useCallback((reply: ReplyModel) => {
    reportIds.current.push(reply.id);
    setReplyList((prev) => {
      return prev.filter((replyItem) => replyItem.id !== reply.id);
    });
  }, []);

  useEffect(() => {
    if (data?.pages) {
      const list = data.pages.filter((reply) => !reportIds.current.includes(reply.id));
      setReplyList(list);
    }
  }, [data?.pages]);

  return {
    // 댓글리스트
    replyList,
    isListFetching: isFetching,
    isListInitLoading: isLoading,
    isListError: isError,
    listError: listError as ErrorModel,
    hasNextPage,
    handleGetList: fetchNextPage,
    // 댓글 삭제
    handleDeleteReply,
    // 신고사유
    reasonItem,
    // 신고 완료
    handleCompleteReportReply,
  };
};
