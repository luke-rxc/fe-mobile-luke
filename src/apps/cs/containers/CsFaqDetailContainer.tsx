import { useEffect } from 'react';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { ArticleDetail } from '../components';
import { useArticleDetailService, useLogService } from '../services';

interface Props {
  articleId: number;
}

export const CsFaqDetailContainer = ({ articleId }: Props) => {
  const { article, error, isError, isLoading } = useArticleDetailService(articleId);
  const { logMyFaqViewArticle } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: 'FAQ',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  useEffect(() => {
    logMyFaqViewArticle({ articleId });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {article && <ArticleDetail title={`Q. ${article.title}`} sectionName={article.sectionName} body={article.body} />}
    </>
  );
};
