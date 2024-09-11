import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { Sticky } from '@features/landmark/components/sticky';
import { Tabs } from '@pui/tabs';
import { WebLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useTheme } from '@hooks/useTheme';
import { Divider } from '@pui/divider';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { getWebLink } from '@utils/link';
import { FaqListItem } from '../components';
import { CategoryIds } from '../constants';
import { useArticleListService, useLogService } from '../services';

interface Props {
  className?: string;
  sectionId?: number;
}

export const CsFaqListContainer = styled(({ className, sectionId }: Props) => {
  const history = useHistory();
  const { isApp } = useDeviceDetect();
  const { theme } = useTheme();

  const {
    // tabs
    sections,
    currentSection,
    isLoadingSections,

    // articles
    articles,
    isLoadingArticles,
    isFetchingArticles,
    hasNextPageArticles,
    handleLoadArticleList,

    // mixed
    error,
    isError,
  } = useArticleListService(CategoryIds.FAQ, sectionId);

  const { logMyFaqViewFaq } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: 'FAQ',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  useEffect(() => {
    logMyFaqViewFaq();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 탭 및 게시글 로딩
  useLoadingSpinner(isLoadingSections || isLoadingArticles);

  // 탭 로딩 상태
  if (isLoadingSections) {
    return null;
  }

  // 오류
  if (isError) {
    return <PageError error={error} />;
  }

  return (
    <div className={className}>
      {/* 탭 */}
      {sections && (
        <Sticky wasSticky>
          <Tabs
            type="underline"
            value={currentSection?.id}
            data={sections.map(({ id, name }) => ({ value: id, label: name }))}
            getValue={({ value }) => value}
            onChange={(e, { value }) => {
              history.replace(getWebLink(WebLinkTypes.CS_FAQ_LIST, value ? { sectionId: value } : {}));
            }}
            {...(isApp && { style: { background: theme.color.surface } })}
          />
          <Divider l={0} r={0} />
        </Sticky>
      )}

      {/* 게시글 Empty */}
      {!isLoadingArticles && isEmpty(articles) && <PageError description="등록된 FAQ가 없습니다" />}

      {/* 게시글 목록 */}
      {!isLoadingArticles && articles && (
        <InfiniteScroller
          disabled={!hasNextPageArticles}
          infiniteOptions={{ rootMargin: '50px' }}
          loading={hasNextPageArticles && isFetchingArticles}
          onScrolled={handleLoadArticleList}
        >
          <ul>
            {articles.map(({ articleId, title }) => (
              <li key={articleId}>
                <FaqListItem articleId={articleId} title={title} />
              </li>
            ))}
          </ul>
        </InfiniteScroller>
      )}
    </div>
  );
})`
  padding-bottom: 2.4rem;
`;
