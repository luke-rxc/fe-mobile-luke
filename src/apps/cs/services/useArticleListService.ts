import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getArticleList } from '../apis';
import { QueryKeys } from '../constants';
import type { SectionSchema } from '../schemas';
import { toArticleListModel } from '../models';
import { useSectionListService } from './useSectionListService';

export const useArticleListService = (categoryId: number, sectionId?: number) => {
  const [currentSection, setCurrentSection] = useState<SectionSchema | undefined>();

  // 섹션 목록
  const {
    sections,
    error: errorSections,
    isError: isErrorSections,
    isLoading: isLoadingSections,
    isFetching: isFetchingSections,
  } = useSectionListService(categoryId);

  useEffect(() => {
    if (sections?.length) {
      // default section
      const [firstSection] = sections;

      const selectedSection = sections.find(({ id }) => id === sectionId);

      setCurrentSection(selectedSection ?? firstSection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, sectionId]);

  // 게시글 목록
  const {
    data: articles,
    error: errorArticles,
    isError: isErrorArticles,
    isLoading: isLoadingArticles,
    isFetching: isFetchingArticles,
    isFetched: isFetchedArticles,
    isSuccess: isSuccessArticles,
    hasNextPage: hasNextPageArticles,
    fetchNextPage: fetchNextPageArticles,
  } = useInfiniteQuery(
    [QueryKeys.MAIN, QueryKeys.ARTICLE_LIST, currentSection?.id],
    ({ pageParam: nextParameter }) => getArticleList({ sectionId: currentSection?.id ?? 0, nextParameter }),
    {
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toArticleListModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      enabled: !!currentSection,
    },
  );

  return {
    // sections
    sections,
    currentSection,
    errorSections,
    isErrorSections,
    isLoadingSections,
    isFetchingSections,

    // articles
    articles: articles?.pages || [],
    errorArticles,
    isErrorArticles,
    isLoadingArticles,
    isFetchingArticles,
    isFetchedArticles,
    isSuccessArticles,
    hasNextPageArticles,
    handleLoadArticleList: fetchNextPageArticles,

    // mixed
    error: errorSections || errorArticles,
    isError: isErrorSections || isErrorArticles,
  };
};
