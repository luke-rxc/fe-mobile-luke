import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useAuth } from '@hooks/useAuth';
import { useLoading } from '@hooks/useLoading';
import { useEffect } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import classnames from 'classnames';
import { TitleSection } from '@pui/titleSection';
import { rn2br } from '@utils/string';
import { useCartService } from '../services';
import { CartContent } from '../components';
import { CartStockProvider } from '../contexts/CartStockContext';
import { CartCheckoutButton } from '../components/cart/CartCheckoutButton';
import { CART_PAGE_LOAD_TYPE } from '../constants';
import { CartLatestViewGoodsList } from '../components/cart/CartLatestViewGoodsList';

export const CartContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const { getIsLogin } = useAuth();
  const { isApp, isMobile } = useDeviceDetect();
  const {
    cartData,
    isCheckoutLoading,
    isCalculateLoading,
    pageLoad,
    latestViewGoodsList,
    handleRetry,
    handleChange,
    handleCheckout,
    handleDelete,
    handleLogin,
    handleLatestClick,
  } = useCartService();
  const exceptionProps = {
    isFull: true,
    title: '',
    description: rn2br('쇼핑백이 비어 있습니다\r\n상품을 발견하고 담아보세요'),
    ...(!cartData && {
      description: '로그인 후 확인할 수 있습니다',
      actionLabel: '로그인',
      onAction: handleLogin,
    }),
  };

  const isMobileWeb = isMobile && !isApp;

  useHeaderDispatch({
    type: 'mweb',
    quickMenus: ['cart', 'menu'],
    enabled: true,
    title: '쇼핑백',
  });

  useEffect(() => {
    if (pageLoad === CART_PAGE_LOAD_TYPE.LOADING || isCalculateLoading) {
      showLoading();
      return;
    }
    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad, isCalculateLoading]);

  if (pageLoad === CART_PAGE_LOAD_TYPE.LOADING) {
    return null;
  }

  if (!getIsLogin()) {
    const props = {
      ...exceptionProps,
      title: '',
      description: '로그인 후 확인할 수 있습니다',
      actionLabel: '로그인',
      onAction: handleLogin,
    };
    return (
      <AdjustStyled>
        <PageError {...props} className={classnames({ adjust: latestViewGoodsList.length > 0 })} />
        <CartLatestViewGoodsList latestViewGoodsList={latestViewGoodsList} onGoodsClick={handleLatestClick} />
      </AdjustStyled>
    );
  }

  if (pageLoad === CART_PAGE_LOAD_TYPE.NORMAL_ERROR) {
    const normalExceptionProps = {
      isFull: true,
      title: '일시적인 오류가 발생하였습니다',
      description: '잠시 후 다시 시도해주세요',
      actionLabel: '다시 시도',
      onAction: handleRetry,
    };

    return <PageError {...normalExceptionProps} />;
  }

  if (!cartData) {
    return null;
  }

  const {
    cartItemList,
    buyableItemCount,
    totalSalesPriceText,
    totalShippingCostText,
    totalPrice: { orderPrice },
  } = cartData;

  if (cartItemList.length === 0) {
    return (
      <AdjustStyled>
        <PageError {...exceptionProps} className={classnames({ adjust: latestViewGoodsList.length > 0 })} />
        <CartLatestViewGoodsList latestViewGoodsList={latestViewGoodsList} onGoodsClick={handleLatestClick} />
      </AdjustStyled>
    );
  }

  return (
    <ContainerStyled>
      {isMobileWeb && <TitleSection title="쇼핑백" />}
      <CartStockProvider>
        <CartContent
          cartItemList={cartItemList}
          totalSalesPriceText={totalSalesPriceText}
          totalShippingCostText={totalShippingCostText}
          orderPrice={orderPrice}
          onChange={handleChange}
          onDelete={handleDelete}
        />
        <CartCheckoutButton
          buyableItemCount={buyableItemCount}
          totalPrice={orderPrice}
          onCheckout={handleCheckout}
          isLoading={isCheckoutLoading}
        />
      </CartStockProvider>
    </ContainerStyled>
  );
};

const AdjustStyled = styled.div`
  & .adjust.is-full {
    position: relative;
    height: 18rem;
  }
`;

const ContainerStyled = styled.div`
  & > .title-box {
    height: 5.6rem;
  }

  .coupon-notifier {
    width: 100%;
    padding: 0 1.6rem;
    margin-top: ${({ theme }) => theme.spacing.s12};
    margin-bottom: ${({ theme }) => theme.spacing.s24};
  }
`;
