import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoading } from '@hooks/useLoading';
import { ContentListItem } from '@pui/contentListItem';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { TitleSection } from '@pui/titleSection';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useContentsHistoryService } from '../services';

export const ContentsHistoryContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    contents,
    contentsHistoryError,
    isContentsHistoryError,
    isContentsHistoryLoading,
    isContentsHistoryFetching,
    hasMoreContentsHistory,
    handleLoadContentsHistory,
  } = useContentsHistoryService();

  useEffect(() => {
    if (isContentsHistoryLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentsHistoryLoading]);

  useHeaderDispatch({
    type: 'mweb',
    title: '최근 본 콘텐츠',
    enabled: !isContentsHistoryLoading,
    quickMenus: ['cart', 'menu'],
    transitionTrigger: triggerRef,
  });

  if (isContentsHistoryLoading) return null;

  /** Error case */
  if (isContentsHistoryError) {
    return <PageError isFull description={contentsHistoryError?.data?.message ?? '일시적인 오류가 발생하였습니다'} />;
  }

  /** Empty case */
  if (isEmpty(contents)) {
    return <PageError isFull description="최근 본 콘텐츠가 없습니다" />;
  }

  return (
    <>
      <TitleSection title="최근 본 콘텐츠" ref={triggerRef} />

      {contents && (
        <ListWrapper>
          <InfiniteScroller
            infiniteOptions={{ rootMargin: '50px' }}
            disabled={!hasMoreContentsHistory}
            onScrolled={handleLoadContentsHistory}
            loading={isContentsHistoryFetching}
          >
            {contents.map((item) => (
              <ContentListItem key={item.id} {...item} />
            ))}
          </InfiniteScroller>
        </ListWrapper>
      )}
    </>
  );
};

const ListWrapper = styled.div`
  padding-bottom: 2.4rem;
`;
