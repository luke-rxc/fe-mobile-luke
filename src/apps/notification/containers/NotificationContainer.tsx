import classnames from 'classnames';
import { useEffect } from 'react';
import styled from 'styled-components';

import isEmpty from 'lodash/isEmpty';
import { Banner } from '@pui/banner';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useAuth } from '@hooks/useAuth';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { LoadingSpinner, Notification, TitleSectionForAndroid, GoodsHistory } from '../components';
import { useGoodsHistoryService, useLogService, useNotificationService } from '../services';

export const NotificationContainer = () => {
  const { getIsLogin } = useAuth();
  const { logViewNotificationFeed, logTabRecentGoods } = useLogService();

  // 알림
  const {
    showNotificationSettingBanner,
    handleClickNotificationSettingBanner,
    notifications,
    errorNotifications,
    isNotificationsError,
    isNotificationsLoading,
    isNotificationsFetching,
    isNotificationsSuccess,
    hasNotificationsNextPage,
    handleLoadNotification,
    handleClickLogin,
  } = useNotificationService({
    // 로그인 상태인 경우 활성
    enabled: getIsLogin(),
  });

  // 최근 본 상품
  const {
    goodsHistory,
    errorGoodsHistory,
    isGoodsHistoryError,
    isGoodsHistoryLoading,
    isGoodsHistoryFetching,
    hasGoodsHistoryNextPage,
    handleLoadGoodsHistory,
  } = useGoodsHistoryService({
    // 비로그인 상태 or 알림이 없는 경우 활성
    enabled: !getIsLogin() || (isNotificationsSuccess && isEmpty(notifications)),
  });

  useHeaderDispatch({
    type: 'mweb',
    title: '알림',
    quickMenus: ['cart', 'menu'],
    enabled: !isNotificationsLoading && !isGoodsHistoryLoading,
  });

  useEffect(() => {
    logViewNotificationFeed();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩
  if (isNotificationsLoading || isGoodsHistoryLoading) {
    return <LoadingSpinner />;
  }

  // 오류
  if (isNotificationsError || isGoodsHistoryError) {
    return (
      <>
        <TitleSectionForAndroid title="Notification" />
        <PageError isFull error={errorNotifications || errorGoodsHistory} />
      </>
    );
  }

  // 비로그인 Empty
  if (!getIsLogin()) {
    return (
      <>
        <TitleSectionForAndroid title="Notification" />
        <PageErrorStyled
          isFull={!goodsHistory.length}
          description="알림을 보려면 로그인해주세요"
          actionLabel="로그인"
          onAction={handleClickLogin}
        />
        <GoodsHistory
          goodsList={goodsHistory}
          disabled={!hasGoodsHistoryNextPage || isGoodsHistoryFetching}
          onScrolled={handleLoadGoodsHistory}
          onListClick={({ goodsId, goodsName }) => {
            logTabRecentGoods({ id: goodsId, name: goodsName });
          }}
        />
      </>
    );
  }

  // Empty
  if (!notifications?.length) {
    return (
      <>
        <TitleSectionForAndroid title="Notification" />
        <PageErrorStyled
          isFull={!goodsHistory.length}
          description="받은 알림이 없습니다<br />쇼룸을 팔로우하고 알림을 받아보세요"
        />
        <GoodsHistory
          goodsList={goodsHistory}
          disabled={!hasGoodsHistoryNextPage || isGoodsHistoryFetching}
          onScrolled={handleLoadGoodsHistory}
          onListClick={({ goodsId, goodsName }) => {
            logTabRecentGoods({ id: goodsId, name: goodsName });
          }}
        />
      </>
    );
  }

  // 알림 목록
  return (
    <Main>
      <TitleSectionForAndroid title="Notification" />
      <div
        className={classnames('banner-wrapper', {
          'is-show': showNotificationSettingBanner,
        })}
      >
        <Banner
          title="알림이 차단되어 있습니다"
          description="설정을 변경하고 맞춤 알림을 받아보세요"
          onClick={handleClickNotificationSettingBanner}
        />
      </div>
      <InfiniteScroller
        disabled={!hasNotificationsNextPage || isNotificationsFetching}
        loading={isNotificationsFetching}
        onScrolled={handleLoadNotification}
      >
        {notifications && notifications.map(({ id, ...props }) => <Notification key={id} {...props} />)}
      </InfiniteScroller>
    </Main>
  );
};

const PageErrorStyled = styled(PageError)`
  ${({ isFull, theme }) =>
    !isFull &&
    `
    ${theme.mixin.centerItem()};
    height: 18rem;
  `}
`;

const Main = styled.main`
  padding-bottom: 2.4rem;

  .banner-wrapper {
    overflow: hidden;
    opacity: 0;
    max-height: 0;
    transition: opacity 0.25s ease-out, max-height 0.25s ease-out 0.25s;

    &.is-show {
      opacity: 1;
      max-height: 95px;
      transition: opacity 0.25s ease-out, max-height 0.25s ease-out;
    }

    ${Banner} {
      padding: 1.2rem 2.4rem;
    }
  }
`;
