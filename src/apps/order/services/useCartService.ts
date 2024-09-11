import { AppLinkTypes } from '@constants/link';
import { useUserAdultService } from '@features/authIntegrate/services';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { toAppLink } from '@utils/link';
import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { AuthAdultReceiveProps } from '@features/authIntegrate/types';
import { AuthCloseWebAppType } from '@features/authIntegrate/constants';
import { useErrorService } from '@features/exception/services';
import { createCheckout, deleteCartItem, getCart, updateCartQuantity, updatePriceInfo } from '../apis';
import { ADULT_REQUIRED_ERROR, CartPageLoadType, CART_PAGE_LOAD_TYPE, USER_CART } from '../constants';
import { CartGoodsDataModel, toCartModel } from '../models';
import { CartSchema } from '../schemas';
import { useCartLogService } from './useLogService';
import { useLatestViewGoodsList } from './useLatestViewGoodsList';

export const useCartService = () => {
  const { isApp } = useDeviceDetect();
  const { isLogin } = useAuth();
  const queryClient = useQueryClient();
  const history = useHistory();
  const { confirm, alert, showToastMessage, signIn, receiveValues, cartUpdated } = useWebInterface();
  const [pageLoad, setPageLoad] = useState<CartPageLoadType>(CART_PAGE_LOAD_TYPE.LOADING);
  const {
    logViewCart,
    logRemoveFromCart,
    logTabPurchase,
    logViewIdentifyAdult,
    logCompleteIdentifyAdult,
    logTabRecentGoods,
  } = useCartLogService();
  // 성인인증 관련
  const { handleGetUserAdultInfo, toAuthAdultIntegrate } = useUserAdultService();
  const { latestViewGoodsList, isFetching: isLatestViewGoodsListFetching } = useLatestViewGoodsList();
  // error
  const { handleError } = useErrorService();

  const {
    data: cartData,
    isLoading,
    isError: isCartError,
    isFetching,
    isFetched,
    refetch,
  } = useQuery(USER_CART, getCart, {
    select: toCartModel,
    enabled: isLogin,
    cacheTime: 0,
  });

  /**
   * 장바구니 상품 목록을 반환
   */
  const getGoodsList = useCallback(
    (): CartGoodsDataModel[] =>
      cartData?.cartItemList
        .map((cartItem) => cartItem.shippingGroupList)
        .flat()
        .map((shipping) => shipping.brandGroupList)
        .flat()
        .map((brandGroup) => brandGroup.cartDataList)
        .flat() ?? [],
    [cartData],
  );

  /**
   * 장바구니 상품의 cartId 목록을 반환
   */
  const getCartIds = useCallback((): number[] => getGoodsList().map((goods) => goods.cartId) ?? [], [getGoodsList]);
  const getBuyableCartIds = useCallback(
    (): number[] =>
      getGoodsList()
        .filter((goods) => goods.isBuyable)
        .map((goods) => goods.cartId) ?? [],
    [getGoodsList],
  );

  const { mutateAsync: executeCalculate, isLoading: isCalculateLoading } = useMutation(
    () => {
      return updatePriceInfo({ cartIdList: getCartIds() ?? [] });
    },
    {
      onMutate: () => {
        const base = getBaseMutateContext();
        return { ...base };
      },
      onSuccess: (schema) => {
        queryClient.setQueryData(USER_CART, schema);
      },
      onError: (err, variables, context) => {
        showToast(err.data?.message || '장바구니 계산기 오류가 발생하였습니다');
        setPageLoad(CART_PAGE_LOAD_TYPE.NORMAL_ERROR);
        queryClient.setQueryData(USER_CART, context?.previousUserCart);
      },
    },
  );

  const { mutateAsync: executeUpdateQuantity } = useMutation(updateCartQuantity, {
    onMutate: () => {
      const base = getBaseMutateContext();
      return { ...base };
    },
    onSuccess: async () => {
      await executeCalculate();
      isApp && notifyCartUpdated();
    },
    onError: (err) => {
      // 정의되지 않은 에러
      if (err.data?.code === 'E500001') {
        setPageLoad(CART_PAGE_LOAD_TYPE.NORMAL_ERROR);
        showToast(err.data?.message ?? '장바구니 상품 수량 변경시 오류가 발생하였습니다');
      }
    },
  });

  const { mutateAsync: executeDeleteItem } = useMutation(deleteCartItem, {
    onMutate: () => {
      const base = getBaseMutateContext();
      return { ...base };
    },
    onSuccess: async (_, variables) => {
      const { cartId } = variables;
      const cartGoods = getGoodsList().find((goods) => goods.cartId === cartId);

      if (cartGoods) {
        logRemoveFromCart(cartGoods.goods);
      }

      await executeCalculate();
      isApp && notifyCartUpdated();
    },
    onError: (err) => {
      showToast(err.data?.message || '장바구니 항목 삭제 오류가 발생하였습니다');
    },
  });

  const { mutateAsync: buy, isLoading: isCheckoutLoading } = useMutation(createCheckout);

  const handleCheckout = useCallback(async () => {
    const cartIds = getBuyableCartIds() ?? [];

    if (cartIds.length === 0) {
      await alert({ message: '구매가능한 상품이 없습니다' });
      return;
    }

    try {
      const { orderCheckoutId } = await buy({
        cartIdList: cartIds,
      });

      logTabPurchase({
        orderCount: cartData?.buyableItemCount ?? 0,
        orderPrice: cartData?.totalPrice.orderPrice ?? 0,
      });

      if (isApp) {
        toAppLink(AppLinkTypes.CHECKOUT, { checkoutId: orderCheckoutId });
        return;
      }

      history.push(`/order/checkout/${orderCheckoutId}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.data?.code === ADULT_REQUIRED_ERROR) {
        const { merchantId, shopId } = await handleGetUserAdultInfo();
        // 미성년 또는 미인증자는 팝업
        if (await toAuthAdultIntegrate(merchantId, shopId)) {
          logViewIdentifyAdult();
        }
        return;
      }

      handleError({
        error: e,
        defaultMessage: '주문서 생성 오류가 발생하였습니다',
      });
    }

    // eslint-disable-next-line
  }, [getBuyableCartIds]);

  const handleChange = useCallback(async (cartId: number, quantity: number) => {
    await executeUpdateQuantity({ quantity, cartId });
    // eslint-disable-next-line
  }, []);

  const handleDelete = useCallback(async (cartId: number, skipConfirmation?: boolean) => {
    const isOK = skipConfirmation || (await confirm({ title: '상품을 삭제할까요?' }));
    return isOK ? executeDeleteItem({ cartId }) : Promise.reject(new Error('cancel'));
    // eslint-disable-next-line
  }, []);

  const handleLogin = useCallback(async () => {
    const isSignIn = await signIn();

    if (isSignIn) {
      refetch();
    }

    // eslint-disable-next-line
  }, []);

  function getBaseMutateContext() {
    const previousUserCart = queryClient.getQueryData<CartSchema>(USER_CART);
    return { previousUserCart };
  }

  const showToast = useCallback((message: string) => {
    showToastMessage(
      { message },
      {
        autoDismiss: 2000,
        direction: 'bottom',
      },
    );
    // eslint-disable-next-line
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLatestClick = useCallback((goodsId: number, goodsName: string) => {
    logTabRecentGoods({ goodsId, goodsName });
    // eslint-disable-next-line
  }, []);

  const notifyCartUpdated = () => {
    const schema = queryClient.getQueryData<CartSchema>(USER_CART);

    if (schema) {
      const { cartItemList } = toCartModel(schema);

      cartUpdated({ itemCount: cartItemList.length });
    }
  };

  useEffect(() => {
    if (isCartError) {
      setPageLoad(CART_PAGE_LOAD_TYPE.NORMAL_ERROR);
      return;
    }

    if (isLatestViewGoodsListFetching) {
      setPageLoad(CART_PAGE_LOAD_TYPE.LOADING);
      return;
    }

    if (isLogin && (isLoading || isFetching)) {
      setPageLoad(CART_PAGE_LOAD_TYPE.LOADING);
      return;
    }

    if (isFetched) {
      logViewCart({
        orderCount: cartData?.buyableItemCount ?? 0,
        orderPrice: cartData?.totalPrice.orderPrice ?? 0,
      });
    }

    setPageLoad(CART_PAGE_LOAD_TYPE.SUCCESS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartError, isLogin, isLoading, isFetching, isFetched, isLatestViewGoodsListFetching]);

  /** 성인인증 진행여부 */
  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues as AuthAdultReceiveProps;
      if (type === AuthCloseWebAppType.AUTH_ADULT) {
        const { isAuthSuccess, message } = data;
        logCompleteIdentifyAdult({ status: isAuthSuccess });

        if (isAuthSuccess) {
          handleCheckout();
        } else {
          message !== null &&
            alert({
              message,
            });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return {
    cartData,
    pageLoad,
    isCheckoutLoading,
    isCalculateLoading,
    latestViewGoodsList,

    handleChange,
    handleDelete,
    handleCheckout,
    handleLogin,
    handleRetry,
    handleLatestClick,
  };
};
