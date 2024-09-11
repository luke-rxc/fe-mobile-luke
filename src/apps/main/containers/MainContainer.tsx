import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useFooterDispatch } from '@features/landmark/hooks/useFooter';
import { PageError } from '@features/exception/components';
import { Spinner } from '@pui/spinner';
import { useMainService } from '../services';
import { BannerList, FeedList, ShortcutBanner, CategoryShortcutList } from '../components';

/**
 * Main Container
 */
export const MainContainer = styled<React.VFC<{ className?: string }>>(({ className }) => {
  const {
    banner,
    bannerHandlers,
    shortcut,
    shortcutHandlers,
    categoryShortcut,
    categoryShortcutHandlers,
    feed,
    feedHandlers,
  } = useMainService();
  const isLoading = banner.isLoading || shortcut.isLoading || categoryShortcut.isLoading || feed.isLoading;

  const history = useHistory();
  const handleReload = () => history.go(0);

  /**
   * header setting
   */
  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    overlay: isLoading || !!banner.data?.length,
    quickMenus: ['cart', 'menu'],
  });

  /**
   * footer setting
   */
  useFooterDispatch({
    enabled: banner.isSuccess && feed.isSuccess,
  });

  /**
   * data loading
   */
  if (isLoading) {
    return <Spinner className={className} size="large" />;
  }

  /**
   * page error
   */
  if (banner.isError && (feed.isError || feed.data?.length)) {
    return (
      <PageError
        title="일시적인 오류가 발생하였습니다"
        description="잠시 후 다시 시도해주세요"
        actionLabel="다시시도"
        onAction={handleReload}
      />
    );
  }

  return (
    <div className={className}>
      {!!banner.data?.length && <BannerList banners={banner.data} {...bannerHandlers} />}
      {!!shortcut.data?.length && <ShortcutBanner shortcuts={shortcut.data} {...shortcutHandlers} />}
      {!!categoryShortcut.data?.length && (
        <CategoryShortcutList items={categoryShortcut.data} {...categoryShortcutHandlers} />
      )}
      {feed.data?.length ? (
        <FeedList feeds={feed.data} hasMore={feed.hasNextPage} {...feedHandlers} />
      ) : (
        <PageError className="feed-error" error={feed.error} isFull={false} defaultMessage="상품을 찾을 수 없습니다" />
      )}
    </div>
  );
})`
  padding-bottom: 2.4rem;

  .feed-error {
    padding: 6.7rem 2.4rem;
  }

  ${Spinner}& {
    ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
    ${({ theme }) => theme.mixin.centerItem()};
    width: 100vw;
    height: 100vh;
    padding-top: 0;
  }

  ${ShortcutBanner}:first-child {
    margin-top: 8rem;
  }

  ${FeedList}:first-child {
    margin-top: 8rem;
  }
`;
