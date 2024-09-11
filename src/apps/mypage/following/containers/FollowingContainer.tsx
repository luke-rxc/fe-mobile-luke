import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { TitleSection } from '@pui/titleSection';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import isEmpty from 'lodash/isEmpty';
import { PageError } from '@features/exception/components';
import { useLoading } from '@hooks/useLoading';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { rn2br } from '@utils/string';
import { useFollowService } from '../services';
import { FollowingBrandListItemMedium } from '../components';

export const FollowingContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    followingList,
    followingError,
    isFollowingError,
    isFollowingLoading,
    isFollowingFetching,
    hasMoreFollowing,
    handleLoadFollowing,
    handleUpdateFollow,
  } = useFollowService();

  useEffect(() => {
    if (isFollowingLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFollowingLoading]);

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: '팔로잉',
    quickMenus: ['cart', 'menu'],
    transitionTrigger: triggerRef,
  });

  if (isFollowingLoading) return null;

  /**
   * Error Case
   */
  if (isFollowingError) {
    return <PageError isFull error={followingError} />;
  }

  /**
   * Empty Case
   */
  if (isEmpty(followingList)) {
    return <PageError isFull defaultMessage={rn2br('팔로우한 쇼룸이 없습니다\r\n쇼룸을 발견하고 팔로우해보세요')} />;
  }

  return (
    <>
      <TitleSection title="팔로잉" ref={triggerRef} />

      {followingList && (
        <ListWrapper>
          <InfiniteScroller
            disabled={!hasMoreFollowing}
            loading={isFollowingFetching}
            onScrolled={handleLoadFollowing}
            infiniteOptions={{ rootMargin: '50px' }}
          >
            {followingList.map((item) => (
              <FollowingBrandListItemMedium key={item.showroomId} {...item} onClickFollow={handleUpdateFollow} />
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
