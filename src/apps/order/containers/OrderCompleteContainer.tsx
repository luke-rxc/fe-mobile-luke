import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { OrderCompleteError, OrderContent } from '../components';
import { useOrderCompleteService } from '../services';
import { OrderStatus } from '../types';
import { ActionBottom } from '../constants';

export const OrderCompleteContainer = () => {
  const { isApp, isIOS } = useDeviceDetect();
  const {
    error,
    isShowBottomControl,
    isLoading,
    isIdle,
    orderInfo,
    goodsCode,
    checkoutId,
    expiredDate,
    handleNavigate,
  } = useOrderCompleteService();
  const loading = useLoadingSpinner((isLoading || orderInfo?.orderStatus === OrderStatus.LOADING) && !error);
  const isIOSApp = isApp && isIOS;
  const containerClassName = classNames({
    'is-ios-app': isIOSApp,
    action: isShowBottomControl,
  });
  const elRef = useRef<HTMLDivElement | null>(null);
  const actionWrapperBottom = orderInfo ? ActionBottom[orderInfo.action.type] : '';

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    quickMenus: ['cart', 'menu'],
    title: '결제',
  });

  useEffect(() => {
    window.scrollTo(0, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, orderInfo?.orderStatus]);

  useEffect(() => {
    // ios 웹뷰내에 html position 제대로 잡지 못하는 이슈
    if (isIOSApp && !loading) {
      if (elRef.current) {
        elRef.current.classList.add('fixed');

        setTimeout(() => {
          if (elRef.current) {
            elRef.current?.classList.remove('fixed');
          }
        }, 0);
      }
    }
  }, [isIOSApp, loading]);

  if (error) {
    return <OrderCompleteError {...error} checkoutId={checkoutId} goodsCode={goodsCode} expiredDate={expiredDate} />;
  }

  if (isIdle) {
    return null;
  }

  if (loading) {
    return (
      <ContainerStyled className="loading">
        <div className="title-section">결제 중입니다</div>
      </ContainerStyled>
    );
  }

  if (!orderInfo) {
    return null;
  }

  return (
    <ContainerStyled className={containerClassName} ref={elRef} actionWrapperBottom={actionWrapperBottom}>
      <div className="wrapper">
        {isIOSApp && <GlobalStyle />}
        <div className="title-section">
          <span className="title">{orderInfo.title}</span>
          {orderInfo.description && <p className="description">{orderInfo.description}</p>}
        </div>
        <OrderContent item={orderInfo} onNavigate={handleNavigate} isShowBottomControl={isShowBottomControl} />
      </div>
    </ContainerStyled>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

const ContainerStyled = styled.div<{ actionWrapperBottom?: string }>`
  &.is-ios-app {
    &.fixed {
      height: 0;
    }
    /**
      ios 웹뷰 뷰포트 - 상단 타이틀 영역(56px)
     */
    height: calc(100vh - 5.6rem);
    overflow-y: scroll;
  }

  & .wrapper {
    padding-bottom: calc(env(safe-area-inset-bottom));
  }

  &.action {
    & .wrapper {
      ${({ actionWrapperBottom }) =>
        actionWrapperBottom && `padding-bottom: calc(${actionWrapperBottom} + env(safe-area-inset-bottom));`}
    }
  }

  .title-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.black};
    padding: 3.2rem 1.6rem 3.2rem 1.6rem;
    font: ${({ theme }) => theme.fontType.t24B};

    .title {
      padding-bottom: ${({ theme }) => theme.spacing.s8};
    }

    .description {
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }
`;
