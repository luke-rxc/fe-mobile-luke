import { useQuery } from '@hooks/useQuery';
import { getArticleDetail } from '../apis';
import { QueryKeys } from '../constants';
import { toArticleDetailModel } from '../models';

export const useArticleDetailService = (articleId: number) => {
  // 공지사항 섹션 상세
  const { data, error, isError, isLoading, isFetching, isFetched, isSuccess } = useQuery(
    [QueryKeys.MAIN, QueryKeys.ARTICLE_DETAIL, articleId],
    () => getArticleDetail({ articleId }),
    {
      select: toArticleDetailModel,
    },
  );

  return {
    article: data,
    error,
    isError,
    isLoading,
    isFetching,
    isFetched,
    isSuccess,
  };
};
