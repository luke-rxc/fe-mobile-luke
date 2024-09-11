import { useMutation } from '@hooks/useMutation';
import { postContentHistory } from '../apis';

/**
 * 최근 본 컨텐츠 등록
 */
export const useContentHistoryService = () => {
  const { mutate: contentHistoryMutate } = useMutation((contentNo: number) => postContentHistory(contentNo));

  return {
    contentHistoryMutate,
  };
};
