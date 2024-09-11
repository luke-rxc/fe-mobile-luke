import { useEffect } from 'react';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { ArticleDetail } from '../components';
import { SectionIds } from '../constants';
import { useArticleDetailService, useLogService } from '../services';

interface Props {
  articleId: number;
}

export const CsNoticeDetailContainer = ({ articleId }: Props) => {
  const { article, error, isError, isLoading } = useArticleDetailService(articleId);
  const { logMyNoticeViewArticle, logMyEventViewArticle } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '공지사항',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  useEffect(() => {
    if (!article?.sectionId) {
      return;
    }

    if (SectionIds.EVENT === article.sectionId) {
      logMyEventViewArticle({ articleId });
    } else {
      logMyNoticeViewArticle({ articleId });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  const loading = useLoadingSpinner(isLoading);

  if (loading) {
    return null;
  }

  // Error
  if (isError) {
    return <PageError error={error} />;
  }

  return (
    <>
      {article && (
        <ArticleDetail
          title={article.title}
          sectionName={article.sectionName}
          relativeTime={article.createdDate}
          body={article.body}
        />
      )}
    </>
  );
};
