import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import { useQuery } from '@hooks/useQuery';
import React, { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@hooks/useMutation';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { getAppLink, getWebLink, toAppLink } from '@utils/link';
import { useWebInterface } from '@hooks/useWebInterface';
import { getPayReRegistrationBannerList, getUserPrizmPayList } from '@features/prizmPay/apis';
import { getDeliveryList } from '@features/delivery/apis';
import { toDeliveryListModel } from '@features/delivery/models';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { DrawerOrdererAuthContainer } from '@features/authentication/containers/DrawerOrdererAuthContainer';
import { PRIZM_PAY_REGISTER_ENTRY_URL } from '@features/prizmPay/constants';
import { DrawerPrizmPayRegisterEntryContainer } from '@features/prizmPay/containers';
import { toBannerModel } from '@features/prizmPay/models';
import { useAuth } from '@hooks/useAuth';
import { PGType } from '@constants/order';
import { setSeatLockId } from '@features/seat/utils';
import { useQueryString } from '@hooks/useQueryString';
import { CALL_WEB_EVENT } from '@features/seat/constants/seat';
import {
  CheckoutModel,
  CheckoutShippingModel,
  FormFields,
  toCheckoutCouponModel,
  toCheckoutModel,
  toCheckoutPrizmPayModel,
} from '../models';
import {
  createOrder,
  getCartCouponList,
  getCheckout,
  getInterestFreeCardList,
  getLockTime,
  OrderParam,
  updateRecipientInfo,
} from '../apis';
import { CheckoutOrderSchema, CheckoutSchema } from '../schemas';
import { usePayments } from '../hooks';
import {
  defaultFormValues,
  DEFAULT_MINIMUM_INSTALLMENT_AMOUNT,
  ORDER_COMPLETE_PATH,
  PageLoadType,
  PAGE_LOAD_TYPE,
  PAYMENT_TYPE,
  TICKET_MESSAGE_LIST,
} from '../constants';
import { SelectedCoupon, CHECKOUT_TYPE, CREATE_ORDER_ERROR, PG_TYPE } from '../types';
import { useOrderLogService } from './useLogService';
import { replaceSingleQuote, setOrderLoggingMark } from '../utils';

export const useCheckoutService = (checkoutId: number) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { pay, init: initPayment } = usePayments();
  const method = useForm<FormFields>({
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });
  const { getValues, setValue, trigger, reset } = method;
  const {
    alert,
    showToastMessage,
    close,
    open,
    orderInfo: webInfOrderInfo,
    setTopBar,
    setDismissConfirm,
  } = useWebInterface();
  const [pageLoad, setPageLoad] = useState<PageLoadType>(PAGE_LOAD_TYPE.LOADING);
  const {
    logViewCheckout,
    logCompleteIdentify,
    logAddPrizmPay,
    logAddShippingAddress,
    logViewCheckoutOnPG,
    logTabPaymentType,
    logTabCheckout,
    logImpressionTimeout,
  } = useOrderLogService();
  const [isCheckoutAuthCollapsed, setIsCheckoutAuthCollapsed] = useState<boolean | null>(null);
  const isAlreadyRequest = useRef(false);
  const selectedDeliveryId = useRef<number | null>(null);
  const { isApp } = useDeviceDetect();
  const { openModal } = useModal();
  const initialValidRef = useRef<boolean[]>([false, false, false]);
  const { userInfo } = useAuth();
  const queryString = useQueryString<{ goodsCode?: string }>();

  const {
    data: checkoutData,
    refetch,
    isLoading: isCheckoutLoading,
    isError: isCheckoutError,
    error: checkoutError,
    isFetched: isCheckoutFetched,
    isSuccess: isCheckoutSuccess,
  } = useQuery(['checkout', checkoutId], () => getCheckout({ checkoutId }), {
    select: toCheckoutModel,
    cacheTime: 0,
    onSuccess: (model) => {
      queryClient.setQueryData(['checkout', 'cart-coupon'], { usableCouponList: model.cartCouponList });
      isCheckoutAuthCollapsed === null && setIsCheckoutAuthCollapsed(!model.orderer.isIdentify);
    },
  });

  const enable = useCallback(() => {
    return (
      checkoutData?.paymentInfo.paymentTypeList.map((item) => item.pgType).includes(PAYMENT_TYPE.PRIZM_PAY) ?? false
    );
  }, [checkoutData]);

  const isEnablePrizmPay = enable();

  const getPrizmPayList = () => {
    return Promise.all([getUserPrizmPayList({}), getInterestFreeCardList()]);
  };

  const {
    data: prizmPayList,
    refetch: refetchPrizmPayList,
    isLoading: isPrizmPayListLoading,
    isError: isPrizmPayListError,
    isSuccess: isPrizmPayListSuccess,
  } = useQuery(['checkout', 'pay'], () => getPrizmPayList(), {
    select: (res) => {
      const [prizmPayResponse, interestResponse] = res;
      return prizmPayResponse.content.map((card) => {
        const interestFreeCard = interestResponse.find((interest) => interest.cardCode === card.cardCode);
        return toCheckoutPrizmPayModel(card, interestFreeCard);
      });
    },
    enabled: isEnablePrizmPay,
  });

  const { data: bannerList } = useQuery(['checkout', 'pay-banner'], () => getPayReRegistrationBannerList(), {
    select: (res) => res.bannerList.map(toBannerModel),
    enabled: isEnablePrizmPay && userInfo?.isPrizmPayReRegistrationRequired,
  });

  const {
    data: deliveryList,
    refetch: refetchShippingList,
    isLoading: isDeliveryListLoading,
    isError: isDeliveryListError,
    isFetched: isDeliveryListFetched,
    isSuccess: isDeliveryListSuccess,
  } = useQuery(['checkout', 'delivery'], () => getDeliveryList({}), {
    select: (res) => toDeliveryListModel(res).content,
  });

  const { mutateAsync: updateCheckoutRecipientInfo } = useMutation(
    (recipient: { name?: string; phone?: string; postCode: string; address: string; addressDetail?: string }) => {
      return updateRecipientInfo({ checkoutId, recipient });
    },
    {
      onError: (err) => {
        showToast(err?.data?.message ?? '배송비 계산 중 오류가 발생하였습니다');
      },
    },
  );

  const { mutateAsync: createOrderInfo, isLoading: isCreateOrderLoading } = useMutation((param: OrderParam) => {
    return createOrder({ checkoutId, param });
  });

  const { data: cartCouponList } = useQuery(
    ['checkout', 'cart-coupon'],
    () =>
      Promise.resolve({
        usableCouponList: [],
      }),
    {
      select: (schema) => {
        return schema.usableCouponList;
      },
      cacheTime: 0,
    },
  );

  const { mutateAsync: executeGetCartCouponList } = useMutation(getCartCouponList, {
    onError: (err) => {
      showToast(err?.data?.message ?? '장바구니 쿠폰 정보를 불러올 수 없습니다');
      queryClient.setQueriesData(['checkout', 'cart-coupon'], {
        usableCouponList: [],
      });
    },
  });

  const { data: expiredDate, refetch: refetchExpiredDate } = useQuery(
    ['checkout', 'lock-time'],
    () => getLockTime({ checkoutId }),
    {
      cacheTime: 0,
      enabled: !!checkoutData?.seatExpiredDate,
    },
  );

  const handleGoodsCouponChange = useCallback(
    async (selectedCoupon: SelectedCoupon) => {
      const { useGoodsCoupons: couponList } = getValues();
      const goodsCouponList = (couponList as SelectedCoupon[])
        .filter(
          (coupon) =>
            coupon.goodsId !== selectedCoupon.goodsId && coupon.couponDownloadId !== selectedCoupon.couponDownloadId,
        )
        .concat(selectedCoupon.couponDownloadId === -1 ? [] : selectedCoupon);
      setValue('useGoodsCoupons', goodsCouponList);

      const cartCouponListSchema = await executeGetCartCouponList({
        checkoutId,
        param: {
          useCouponList: goodsCouponList.map((coupon) => {
            const { couponSale, couponDownloadId, goodsId } = coupon;
            return { couponSale, couponDownloadId, goodsId };
          }),
        },
      });
      setValue('useCartCoupon', null);
      const cartCouponListModel = cartCouponListSchema.usableCouponList.map(toCheckoutCouponModel);
      queryClient.setQueryData(['checkout', 'cart-coupon'], { usableCouponList: cartCouponListModel });
    },
    [setValue, getValues, checkoutId, executeGetCartCouponList, queryClient],
  );

  async function handleShippingSelect(shipping: Omit<CheckoutShippingModel, 'isDefault' | 'addressName'>) {
    const param = {
      name: shipping.name ?? '',
      phone: shipping.phone ?? '',
      postCode: shipping.postCode ?? '',
      address: shipping.address ?? '',
      addressDetail: shipping.addressDetail ?? '',
    };
    selectedDeliveryId.current = shipping.id;
    await executeCalculateShippingCost(param);
  }

  async function executeCalculateShippingCost(param: {
    name: string;
    phone: string;
    postCode: string;
    address: string;
    addressDetail: string;
  }) {
    const { name, phone, postCode, address, addressDetail } = param;
    const data = queryClient.getQueryData<CheckoutSchema>(['checkout', checkoutId]);

    if (data) {
      const {
        recipient,
        payment: { totalShippingCost, orderPrice },
      } = await updateCheckoutRecipientInfo({
        ...(name && { name }),
        ...(phone && { phone }),
        postCode,
        address,
        ...(addressDetail && { addressDetail }),
      });
      const payment = {
        ...data.payment,
        totalShippingCost,
        orderPrice,
      };

      queryClient.setQueryData(['checkout', checkoutId], { ...data, ...{ recipient, payment } });
    }
  }

  async function handleBuy() {
    if (!checkoutData) {
      showAlert('주문서가 존재하지 않습니다');
      return;
    }

    if (isAlreadyRequest.current) {
      return;
    }

    const param = getOrderParam();

    if (isValid(param)) {
      try {
        isAlreadyRequest.current = true;
        const { isAddressRequired, ...other } = param;
        const orderInfo = await createOrderInfo(other);
        executePay(orderInfo, { seatExpiredDate: checkoutData.seatExpiredDate });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        showToast(err?.data?.message ?? '주문 오류가 발생하였습니다');

        if (err?.data?.code === CREATE_ORDER_ERROR.NOT_IDENTIFIED) {
          setIsCheckoutAuthCollapsed(true);

          const schema = queryClient.getQueryData(['checkout', checkoutId]) as CheckoutSchema;

          if (schema) {
            queryClient.setQueryData(['checkout', checkoutId], {
              ...schema,
              orderer: {
                ...schema.orderer,
                isIdentify: false,
                name: null,
                phone: null,
              },
            });

            reset({
              ...getValues(),
              name: '',
              phone: '',
            });

            await trigger(['name', 'phone'], { shouldFocus: true });
          }
        }
      } finally {
        setTimeout(() => {
          isAlreadyRequest.current = false;
        }, 1000);
        logTabCheckout();
      }
    }
  }

  function isValid(param: OrderParam & { isAddressRequired: boolean }): boolean {
    const {
      orderer: { name: ordererName, phone: ordererPhone },
      recipient: { name, phone, postCode, address, addressDetail, deliveryRequestMessage },
      payment: { paymentType, prizmPayId, orderPrice, cardInstallmentPlan },
      isAddressRequired,
    } = param;

    if (!ordererName || !ordererPhone) {
      showToast('입력되지 않은 주문자 정보가 있습니다');
      return false;
    }

    if (!((name && phone) || (isAddressRequired && postCode && address && addressDetail))) {
      showToast('입력되지 않은 배송지 정보가 있습니다');
      return false;
    }

    if (isAddressRequired && !deliveryRequestMessage) {
      showToast('배송 요청사항을 확인해주세요');
      return false;
    }

    if (paymentType === PAYMENT_TYPE.POINT && orderPrice > 0) {
      showToast('결제 금액을 확인해주세요');
      return false;
    }

    if (paymentType === PAYMENT_TYPE.PRIZM_PAY) {
      if (!prizmPayId) {
        showToast('다른 카드로 결제해주세요');
        return false;
      }

      const card = prizmPayList?.find((item) => item.id === prizmPayId);
      if (!card?.isPossibleInstallment && cardInstallmentPlan && cardInstallmentPlan > 1) {
        showToast('일시불로 선택해주세요');
        return false;
      }

      if (
        orderPrice < (card?.minimumPaymentAmount ?? DEFAULT_MINIMUM_INSTALLMENT_AMOUNT) &&
        cardInstallmentPlan &&
        cardInstallmentPlan > 1
      ) {
        showToast('결제 금액이 할부 가능 최저 금액보다 낮습니다');
        return false;
      }
    }

    if (paymentType !== PAYMENT_TYPE.POINT && paymentType !== PAYMENT_TYPE.FREE && orderPrice < 100) {
      showToast('결제 금액이 100원 이상일 때 결제됩니다');
      return false;
    }

    return true;
  }

  const getGoodsIdList = () => Array.from(new Set(checkoutData?.orderInfo.goodsInfos.map((goods) => goods.goodsId)));
  const getGoodsCode = () => Array.from(new Set(checkoutData?.orderInfo.goodsInfos.map((goods) => goods.goodsCode)));
  const getGoodsKind = () => `${checkoutData?.orderInfo.goodsInfos[0].goodsList[0].kind}`;

  function executePay(orderInfo: CheckoutOrderSchema, options: { seatExpiredDate: CheckoutModel['seatExpiredDate'] }) {
    const { orderId, shopId, paymentGatewayParameter } = orderInfo;
    const { seatExpiredDate } = options;
    const goodsIdList = getGoodsIdList();
    const goodsKind = getGoodsKind();
    const goodsCodeList = getGoodsCode();
    !isApp && setOrderLoggingMark(orderId);

    open(
      {
        url: getAppLink(AppLinkTypes.PAY, { checkoutId }),
        initialData: {
          orderId,
          shopId,
          paymentGatewayParameter: replaceSingleQuote(paymentGatewayParameter),
          seatExpiredDate,
          goodsIdList,
          goodsKind,
        },
      },
      {
        doWeb: async () => {
          if (!paymentGatewayParameter) {
            const queryParams = {
              type: CHECKOUT_TYPE.DEFAULT,
              checkout_id: checkoutId,
              pg_type: PG_TYPE.PRIZM,
              ...(expiredDate && { expired_date: expiredDate }),
              ...(goodsCodeList.length === 1 && { goods_code: goodsCodeList[0] }),
            };
            const url = `${ORDER_COMPLETE_PATH}/${orderId}?${qs.stringify(queryParams)}`;
            history.push(url);
            return;
          }

          logViewCheckoutOnPG({
            orderId,
            paymentGatewayParameter,
          });

          if (await initPayment(paymentGatewayParameter.pgType, shopId ?? '')) {
            pay({
              orderId,
              paymentGatewayParameter,
              checkoutId: checkoutId.toString(),
              ...(goodsCodeList.length === 1 && { goodsCode: goodsCodeList[0] }),
              expiredDate,
            });
          }
        },
      },
    );
  }

  const refreshCheckout = useCallback(async () => {
    await refetch();

    if (selectedDeliveryId.current) {
      const deliveryItem = deliveryList?.find((delivery) => delivery.id === selectedDeliveryId.current);

      if (deliveryItem) {
        await executeCalculateShippingCost(deliveryItem);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, deliveryList]);

  const handleRetry = useCallback(() => {
    refreshCheckout();
    refetchShippingList();
    refetchPrizmPayList();
  }, [refreshCheckout, refetchShippingList, refetchPrizmPayList]);

  const handleClose = useCallback(() => {
    close(
      {},
      {
        doWeb: () => {
          history.push('/bag/cart');
        },
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayAdd = useCallback(() => {
    refetchPrizmPayList();
    logAddPrizmPay();
  }, [refetchPrizmPayList, logAddPrizmPay]);

  const handleShippingAdd = useCallback(() => {
    refetchShippingList();
    logAddShippingAddress();
  }, [refetchShippingList, logAddShippingAddress]);

  const handlePaymentTypeChange = useCallback((paymentType: PGType) => {
    logTabPaymentType(paymentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExpired = async () => {
    const goodsCode = Array.from(new Set(checkoutData?.orderInfo.goodsInfos.map((goods) => goods.goodsCode)))[0];
    const params = {
      type: CALL_WEB_EVENT.ON_EXPIRED,
      data: {},
    };

    (await alert({ title: '좌석 선점 시간이 종료되었습니다', message: '다시 선택해주세요' })) &&
      close(params, { doWeb: () => navigateGoodsOrBag(goodsCode, params) });

    const goodsId = getGoodsIdList()[0];
    goodsId && logImpressionTimeout(goodsId.toString());
  };

  function getOrderParam() {
    const values = getValues();
    const orderer = getOrderOrdererInfo(values);
    const payment = getOrderPaymentInfo(values);
    const recipient = getOrderRecipientInfo(values, checkoutData);

    return {
      isSavePaymentMethod: true,
      payment,
      recipient,
      orderer,
      isAddressRequired: checkoutData?.recipient.isAddressRequired ?? true,
    };
  }

  function getOrderOrdererInfo({ name, phone }: FormFields) {
    return {
      name,
      phone,
    };
  }

  function getOrderRecipientInfo(
    {
      recipientName,
      recipientPhone,
      recipientPostCode,
      recipientAddress,
      recipientAddressDetail,
      message,
      etcMessage,
      pcc,
    }: FormFields,
    data?: CheckoutModel,
  ) {
    // 주문자 이름, 핸드폰번호 기본값
    const { name: defaultRecipientName, phone: defaultRecipientPhone } = checkoutData?.orderer ?? {
      ordererName: '',
      ordererPhone: '',
    };

    const deliveryRequestMessage = getDeliveryMessage({
      message,
      etcMessage,
      isAddressRequired: data?.recipient.isAddressRequired ?? false,
    });

    return {
      ...(pcc && { pcccNumber: pcc }),
      name: recipientName || defaultRecipientName || '',
      phone: recipientPhone || defaultRecipientPhone || '',
      ...(data?.recipient.isAddressRequired && {
        postCode: recipientPostCode ?? '',
        address: recipientAddress ?? '',
        addressDetail: recipientAddressDetail ?? '',
        isSaveShippingAddress: !checkoutData?.recipient.address,
      }),
      ...(deliveryRequestMessage && { deliveryRequestMessage }),
    };
  }

  function getDeliveryMessage({
    message,
    etcMessage,
    isAddressRequired,
  }: Pick<FormFields, 'message' | 'etcMessage'> & {
    isAddressRequired: CheckoutModel['recipient']['isAddressRequired'];
  }) {
    if (message === 'etc') {
      return etcMessage;
    }

    if (!isAddressRequired) {
      if (!message || message === TICKET_MESSAGE_LIST[0].value) {
        return '';
      }
    }

    return message;
  }

  function toNumber(val: string | number) {
    if (typeof val === 'number') {
      return Number(val);
    }

    return Number(val.replace(/[,]/g, ''));
  }

  function getOrderPaymentInfo({
    orderPrice,
    payType,
    useGoodsCoupons,
    useCartCoupon,
    usePoint,
    prizmPayId,
    cardInstallmentPlan,
  }: FormFields) {
    const useCouponList = useGoodsCoupons.map(({ couponDownloadId, couponSale, goodsId }) => ({
      couponDownloadId,
      couponSale,
      goodsId,
    }));
    const point = toNumber(usePoint ?? 0);
    const paymentType = getPaymentType(payType, orderPrice, point);
    const totalShippingCost = checkoutData?.summaryInfo.totalShippingCost ?? 0;

    return {
      ...(useCartCoupon && {
        cartCouponSale: useCartCoupon.couponSale,
        useCartCouponDownloadId: useCartCoupon.couponDownloadId,
      }),
      ...(point > 0 && { usePoint: point }),
      ...(useCouponList.length > 0 && { useCouponList }),
      ...(paymentType === PAYMENT_TYPE.PRIZM_PAY && prizmPayId && { prizmPayId }),
      orderPrice,
      paymentType,
      totalShippingCost,
      cardInstallmentPlan: cardInstallmentPlan ?? null,
    };
  }

  function getPaymentType(payType: FormFields['payType'], orderPrice: number, point: number) {
    if (orderPrice === 0 && point === 0) {
      return PAYMENT_TYPE.FREE;
    }

    if (orderPrice === 0) {
      return PAYMENT_TYPE.POINT;
    }

    return payType;
  }

  const showToast = useCallback(
    (message: string) => {
      showToastMessage(
        { message },
        {
          autoDismiss: 2000,
          direction: 'bottom',
        },
      );
    },
    [showToastMessage],
  );

  const showAlert = useCallback(async (message: string) => alert({ message }), [alert]);

  const openAuthModal = async () => {
    if (isApp) {
      toAppLink(AppLinkTypes.AUTH_SMS, { modalStyle: 'medium' });
    } else {
      setTimeout(() => {
        openModal({
          nonModalWrapper: true,
          render: (props) => React.createElement(DrawerOrdererAuthContainer, { ...props }),
        });
      }, 300);
    }
  };

  const openPrizmPayRegisterEntry = () => {
    if (isApp) {
      toAppLink(AppLinkTypes.WEB, { landingType: 'modal', url: PRIZM_PAY_REGISTER_ENTRY_URL, topBarHidden: 'true' });
      return;
    }

    openModal({
      nonModalWrapper: true,
      render: (props) => createElement(DrawerPrizmPayRegisterEntryContainer, { ...props }),
    });
  };

  const navigateGoodsOrBag = (goodsCode?: string, params = {}) => {
    const args: Parameters<typeof getWebLink> = goodsCode ? [WebLinkTypes.GOODS, { goodsCode }] : [WebLinkTypes.CART];
    const url = getWebLink(...args);
    history.replace(url, params);
  };

  useEffect(() => {
    const init = async () => {
      switch (checkoutError?.data?.code) {
        case 'E500403': {
          (await showAlert(checkoutError?.data?.message ?? '주문서를 불러올 수 없습니다')) &&
            close({}, { doWeb: () => navigateGoodsOrBag(queryString.goodsCode) });
          setPageLoad(PAGE_LOAD_TYPE.UNUSABLE_CHECKOUT_ERROR);
          break;
        }
        case 'E409602': {
          const params = {
            type: CALL_WEB_EVENT.ON_EXPIRED,
            data: {},
          };

          (await showAlert(checkoutError?.data?.message ?? '')) &&
            close(params, { doWeb: () => navigateGoodsOrBag(queryString.goodsCode, params) });

          const goodsId = checkoutError?.data?.errors.find((error) => error.field === 'goodsId')?.value;
          goodsId && logImpressionTimeout(goodsId);
          setPageLoad(PAGE_LOAD_TYPE.UNUSABLE_CHECKOUT_ERROR);
          break;
        }
        case 'E500405':
          setPageLoad(PAGE_LOAD_TYPE.INVALID_CHECKOUT_ERROR);
          break;
        default:
          setPageLoad(PAGE_LOAD_TYPE.NORMAL_ERROR);
      }
    };

    const isPrizmPaySuccess = () => {
      if (enable()) {
        return isPrizmPayListSuccess;
      }

      return true;
    };

    const isValidPay = () => {
      if (enable() && checkoutData?.paymentInfo.selectedType === PGType.PRIZM_PAY) {
        if (!prizmPayList) {
          return false;
        }

        if (prizmPayList.length === 0) {
          return false;
        }

        const [first] = prizmPayList;

        if (first.disabled) {
          return false;
        }

        return true;
      }

      return true;
    };

    const isValidDelivery = () => {
      if (checkoutData?.recipient.isAddressRequired) {
        return (deliveryList ?? []).length > 0;
      }

      return true;
    };

    if (isCheckoutLoading || isDeliveryListLoading || isPrizmPayListLoading) {
      setPageLoad(PAGE_LOAD_TYPE.LOADING);
      return;
    }

    if (isCheckoutError || isDeliveryListError || isPrizmPayListError) {
      setTopBar({ title: '주문' });
      init();
      return;
    }

    if (isCheckoutSuccess && isDeliveryListSuccess && isPrizmPaySuccess()) {
      initialValidRef.current = [checkoutData?.orderer.isIdentify ?? false, isValidDelivery(), isValidPay()];

      checkoutData?.paymentInfo.selectedType && setValue('payType', checkoutData?.paymentInfo.selectedType);
      prizmPayList?.[0] && setValue('prizmPayId', prizmPayList[0].id);

      setTopBar({ title: !checkoutData?.recipient.isAddressRequired ? '예약' : '주문' });
      !checkoutData?.recipient.isAddressRequired &&
        setDismissConfirm({
          isConfirmable: true,
          title: '예약하지 않고 나갈까요?',
          message: '내용은 저장되지 않습니다',
        });
      setPageLoad(PAGE_LOAD_TYPE.SUCCESS);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isCheckoutSuccess,
    isDeliveryListSuccess,
    isPrizmPayListSuccess,
    isCheckoutError,
    isDeliveryListError,
    isPrizmPayListError,
    isCheckoutLoading,
    isDeliveryListLoading,
    isPrizmPayListLoading,
  ]);

  /**
   * 만료시간이 존재하는 주문서의 경우 앱에 주문서 정보를 전달 (좌석 점유 해제)
   */
  const callAppOrderInfo = (seatExpiredDate: CheckoutModel['seatExpiredDate']) => {
    const goodsIds = getGoodsIdList();
    const goodsKind = getGoodsKind();
    goodsIds &&
      goodsKind &&
      webInfOrderInfo({
        checkoutId,
        ...(seatExpiredDate && { expiredDate: seatExpiredDate }),
        goodsIds,
        goodsKind,
      });
  };

  useEffect(() => {
    if (isCheckoutFetched && isDeliveryListFetched) {
      if (checkoutData) {
        logViewCheckout(checkoutData);

        if (!checkoutData.orderer.isIdentify) {
          openAuthModal();
        }

        callAppOrderInfo(checkoutData.seatExpiredDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckoutFetched, isDeliveryListFetched]);

  useEffect(() => {
    if (!checkoutData?.seatExpiredDate) {
      return undefined;
    }

    const handleVisible = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      refetchExpiredDate();
    };
    // visibilitychange 이벤트 세팅
    // 타이머 데이터 갱신
    window.addEventListener('visibilitychange', handleVisible);

    return () => {
      window.removeEventListener('visibilitychange', handleVisible);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData?.seatExpiredDate]);

  useEffect(() => {
    if (pageLoad !== PAGE_LOAD_TYPE.SUCCESS) {
      return;
    }

    if (isApp || !expiredDate) {
      return;
    }

    setSeatLockId(checkoutId, expiredDate);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad, expiredDate]);

  useEffect(() => {
    setDismissConfirm({ isConfirmable: true, title: '주문하지 않고 나갈까요?', message: '내용은 저장되지 않습니다' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    checkoutData,
    prizmPayList: prizmPayList ?? [],
    deliveryList: deliveryList ?? [],
    cartCouponList: cartCouponList ?? [],
    bannerList: bannerList ?? [],
    pageLoad,
    isCreateOrderLoading,
    method,
    isCheckoutAuthCollapsed: isCheckoutAuthCollapsed ?? false,
    checkoutError,
    initialValid: initialValidRef.current,
    expiredDate: (expiredDate || checkoutData?.seatExpiredDate) ?? undefined,
    handleShippingSelect,
    handleGoodsCouponChange,
    handleBuy,
    refreshCheckout,
    handlePayAdd,
    handleShippingAdd,
    handleRetry,
    handleClose,
    logCompleteIdentify,
    openPrizmPayRegisterEntry,
    handlePaymentTypeChange,
    handleExpired,
  };
};
