import { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { useLoading } from '@hooks/useLoading';
import { ContentListItem } from '@pui/contentListItem';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { TitleSection } from '@pui/titleSection';
import { rn2br } from '@utils/string';
import { useSearchContentService, useLogService } from '../services';

interface Props {
  query?: string;
}

export const SearchContentListContainer = ({ query = '' }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const {
    content,
    contentError,
    isContentError,
    isContentLoading,
    isContentFetching,
    hasMoreContent,
    handleLoadContent,
  } = useSearchContentService({ query });

  const { logContentListTabContent } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '콘텐츠',
    enabled: !isContentLoading,
    quickMenus: ['cart', 'menu'],
  });

  useEffect(() => {
    if (isContentLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentLoading]);

  // Loading
  if (isContentLoading) {
    return null;
  }

  /* eslint-disable no-nested-ternary */
  return (
    <Container>
      <TitleSection title="콘텐츠" />
      {isContentError ? (
        // Error
        <PageError error={contentError} />
      ) : isEmpty(content) ? (
        // Empty
        <PageError description={rn2br('검색 결과가 없습니다\r\n다른 검색어를 입력해보세요')} />
      ) : (
        // Success
        <InfiniteScroller
          infiniteOptions={{ rootMargin: '50px' }}
          disabled={!hasMoreContent}
          onScrolled={handleLoadContent}
          loading={isContentFetching}
        >
          {content?.map((item, index) => (
            <ContentListItem
              key={item.id}
              {...item}
              listIndex={index}
              onClick={() => {
                logContentListTabContent({
                  contentsId: `${item.id}`,
                  contentsName: item.name,
                  contentsType: item.contentType,
                  contentsIndex: index,
                  query,
                });
              }}
            />
          ))}
        </InfiniteScroller>
      )}
    </Container>
  );
  /* eslint-enable no-nested-ternary */
};

const Container = styled.div`
  margin-bottom: 2.4rem;
`;
