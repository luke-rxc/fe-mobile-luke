import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@hooks/useQuery';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@hooks/useMutation';
import { AppLinkTypes } from '@constants/link';
import { getAppLink, toAppLink } from '@utils/link';
import { useWebInterface } from '@hooks/useWebInterface';
import { getPayReRegistrationBannerList, getUserPrizmPayList } from '@features/prizmPay/apis';
import { getDeliveryList } from '@features/delivery/apis';
import { toDeliveryListModel } from '@features/delivery/models';
import { PRIZM_PAY_REGISTER_ENTRY_URL } from '@features/prizmPay/constants';
import { toBannerModel } from '@features/prizmPay/models';
import { useAuth } from '@hooks/useAuth';
import { PGType } from '@constants/order';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import {
  CheckoutShippingModel,
  BidCheckoutFormFields,
  toBidCheckoutModel,
  BidCheckoutModel,
  toCheckoutPrizmPayModel,
} from '../models';
import { BidOrderParam, createBidOrder, getBidCheckout, getInterestFreeCardList } from '../apis';
import { BidCheckoutOrderSchema, BidCheckoutSchema } from '../schemas';
import { usePayments } from '../hooks';
import {
  defaultFormValues,
  DEFAULT_MINIMUM_INSTALLMENT_AMOUNT,
  ORDER_COMPLETE_PATH,
  PageLoadType,
  PAGE_LOAD_TYPE,
  PAYMENT_TYPE,
} from '../constants';
import { CHECKOUT_TYPE, CREATE_ORDER_ERROR } from '../types';
import { useOrderLogService } from './useLogService';
import { replaceSingleQuote, setOrderLoggingMark } from '../utils';

export const useBidCheckoutService = (auctionId: number) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [isCheckoutAuthCollapsed, setIsCheckoutAuthCollapsed] = useState<boolean | null>(null);
  const isAlreadyRequest = useRef(false);
  const { pay, init: initPayment } = usePayments();
  const {
    logViewAuctionCheckout,
    logCompleteIdentify,
    logAddPrizmPay,
    logAddShippingAddress,
    logTabPaymentType,
    logTabCheckout,
  } = useOrderLogService();
  const method = useForm<BidCheckoutFormFields>({
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });
  const { getValues, trigger, reset, setValue } = method;
  const { isApp } = useDeviceDetect();
  const { alert, showToastMessage, close, open, setTopBar, setDismissConfirm } = useWebInterface();
  const [pageLoad, setPageLoad] = useState<PageLoadType>(PAGE_LOAD_TYPE.LOADING);
  const initialValidRef = useRef<boolean[]>([false, false, false]);
  const { userInfo } = useAuth();

  const {
    data: bidCheckoutData,
    refetch,
    isLoading: isBidCheckoutLoading,
    isError: isBidCheckoutError,
    error: bidCheckoutError,
    isFetched: isBidCheckoutFetched,
    isSuccess: isBidCheckoutSuccess,
  } = useQuery(['bid', 'checkout', auctionId], () => getBidCheckout({ auctionId }), {
    select: toBidCheckoutModel,
    cacheTime: 0,
    onSuccess: (model) => {
      isCheckoutAuthCollapsed === null && setIsCheckoutAuthCollapsed(!model.orderer.isIdentify);
    },
  });

  const getPrizmPayList = () => {
    return Promise.all([getUserPrizmPayList({}), getInterestFreeCardList()]);
  };

  const enable = useCallback(() => {
    return (
      bidCheckoutData?.paymentInfo.paymentTypeList.map((item) => item.pgType).includes(PAYMENT_TYPE.PRIZM_PAY) ?? false
    );
  }, [bidCheckoutData]);

  const isEnablePrizmPay = enable();

  const {
    data: prizmPayList,
    refetch: refetchPrizmPayList,
    isLoading: isPrizmPayListLoading,
    isError: isPrizmPayListError,
    isSuccess: isPrizmPayListSuccess,
  } = useQuery(['bid', 'checkout', 'pay'], () => getPrizmPayList(), {
    select: (res) => {
      const [prizmPayResponse, interestResponse] = res;
      return prizmPayResponse.content.map((card) => {
        const interestFreeCard = interestResponse.find((interest) => interest.cardCode === card.cardCode);
        return toCheckoutPrizmPayModel(card, interestFreeCard);
      });
    },
    enabled: isEnablePrizmPay,
  });

  const { data: bannerList } = useQuery(['bid', 'checkout', 'pay-banner'], () => getPayReRegistrationBannerList(), {
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

  const { mutateAsync: createOrderInfo, isLoading: isCreateOrderLoading } = useMutation((param: BidOrderParam) => {
    return createBidOrder({ auctionId, param });
  });

  async function handleShippingSelect(shipping: Omit<CheckoutShippingModel, 'isDefault' | 'addressName' | 'id'>) {
    const param = {
      name: shipping.name ?? '',
      phone: shipping.phone ?? '',
      postCode: shipping.postCode ?? '',
      address: shipping.address ?? '',
      addressDetail: shipping.addressDetail ?? '',
    };
    await executeCalculateShippingCost(param);
  }

  async function executeCalculateShippingCost(param: {
    name?: string;
    phone?: string;
    postCode: string;
    address: string;
    addressDetail?: string;
  }) {
    const { name, phone, postCode, address, addressDetail } = param;
    const data = queryClient.getQueryData<BidCheckoutSchema>(['bid', 'checkout', auctionId]);

    if (data) {
      const recipient = {
        ...(name && { name }),
        ...(phone && { phone }),
        postCode,
        address,
        ...(addressDetail && { addressDetail }),
        isAddressRequired: data.recipient.isAddressRequired,
      };

      queryClient.setQueryData(['bid', 'checkout', auctionId], { ...data, ...{ recipient } });
    }
  }

  async function handleBuy() {
    if (!bidCheckoutData) {
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
        executePay(orderInfo);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        showToast(err?.data?.message ?? '주문 오류가 발생하였습니다');

        if (err?.data?.code === CREATE_ORDER_ERROR.NOT_IDENTIFIED) {
          setIsCheckoutAuthCollapsed(true);

          const schema = queryClient.getQueryData(['bid', 'checkout', auctionId]) as BidCheckoutSchema;

          if (schema) {
            queryClient.setQueryData(['bid', 'checkout', auctionId], {
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
        }, 200);
        logTabCheckout();
      }
    }
  }

  function isValid(param: BidOrderParam & { isAddressRequired: boolean }): boolean {
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

    return true;
  }

  function executePay(orderInfo: BidCheckoutOrderSchema) {
    const { orderId, shopId, paymentGatewayParameter } = orderInfo;
    !isApp && setOrderLoggingMark(orderId);

    open(
      {
        url: getAppLink(AppLinkTypes.PAY, { checkoutId: auctionId }),
        initialData: {
          orderId,
          shopId,
          paymentGatewayParameter: replaceSingleQuote(paymentGatewayParameter),
          type: CHECKOUT_TYPE.LIVE,
          auctionId,
        },
      },
      {
        doWeb: async () => {
          if (!shopId || !paymentGatewayParameter) {
            const url = `${ORDER_COMPLETE_PATH}/${orderId}?type=${CHECKOUT_TYPE.LIVE}&auction_id=${auctionId}`;
            history.push(url);
            return;
          }

          if (await initPayment(paymentGatewayParameter.pgType, shopId)) {
            pay({ orderId, paymentGatewayParameter });
          }
        },
      },
    );
  }

  const refreshCheckout = useCallback(() => {
    refetch();
  }, [refetch]);

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

  const handleRetry = useCallback(() => {
    refreshCheckout();
    refetchShippingList();
    refetchPrizmPayList();
  }, [refreshCheckout, refetchShippingList, refetchPrizmPayList]);

  function getOrderParam() {
    const values = getValues();
    const orderer = getOrderOrdererInfo(values);
    const payment = getOrderPaymentInfo(values);
    const recipient = getOrderRecipientInfo(values, bidCheckoutData);

    return {
      isSavePaymentMethod: true,
      payment,
      recipient,
      orderer,
      isAddressRequired: bidCheckoutData?.recipient.isAddressRequired ?? true,
    };
  }

  function getOrderOrdererInfo({ name, phone }: BidCheckoutFormFields) {
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
    }: BidCheckoutFormFields,
    data?: BidCheckoutModel,
  ) {
    // 주문자 이름, 핸드폰번호 기본값
    const { name: defaultRecipientName, phone: defaultRecipientPhone } = bidCheckoutData?.orderer ?? {
      ordererName: '',
      ordererPhone: '',
    };

    const deliveryRequestMessage = getDeliveryMessage({ message, etcMessage });

    return {
      ...(pcc && { pcccNumber: pcc }),
      name: recipientName || defaultRecipientName || '',
      phone: recipientPhone || defaultRecipientPhone || '',
      ...(data?.recipient.isAddressRequired && {
        postCode: recipientPostCode ?? '',
        address: recipientAddress ?? '',
        addressDetail: recipientAddressDetail ?? '',
        isSaveShippingAddress: !bidCheckoutData?.recipient.address,
        ...(deliveryRequestMessage && { deliveryRequestMessage }),
      }),
    };
  }

  function getDeliveryMessage({ message, etcMessage }: Pick<BidCheckoutFormFields, 'message' | 'etcMessage'>) {
    if (message === 'etc') {
      return etcMessage;
    }

    return message;
  }

  function getOrderPaymentInfo({ orderPrice, payType, prizmPayId, cardInstallmentPlan }: BidCheckoutFormFields) {
    const paymentType = orderPrice === 0 ? PAYMENT_TYPE.POINT : getPaymentType(payType);

    return {
      ...(paymentType === PAYMENT_TYPE.PRIZM_PAY && prizmPayId && { prizmPayId }),
      orderPrice,
      paymentType,
      totalShippingCost: 0,
      cardInstallmentPlan: cardInstallmentPlan ?? null,
    };
  }

  function getPaymentType(payType: BidCheckoutFormFields['payType']) {
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

  const openAuthModal = () => {
    toAppLink(AppLinkTypes.AUTH_SMS, { modalStyle: 'medium' });
  };

  useEffect(() => {
    const init = async () => {
      if (bidCheckoutError?.data?.code === 'E500403') {
        if (await showAlert(bidCheckoutError?.data?.message ?? '주문서를 불러올 수 없습니다')) {
          close(
            {},
            // @todo 추후 웹에서도 지원한다면...
            // {
            //   doWeb: () => {
            //     history.replace('/bag/cart');
            //   },
            // },
          );
        }

        setPageLoad(PAGE_LOAD_TYPE.UNUSABLE_CHECKOUT_ERROR);
      } else {
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
      if (enable() && bidCheckoutData?.paymentInfo.selectedType === PGType.PRIZM_PAY) {
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

    if (isBidCheckoutLoading || isDeliveryListLoading || isPrizmPayListLoading) {
      setPageLoad(PAGE_LOAD_TYPE.LOADING);
      return;
    }

    if (isBidCheckoutError || isDeliveryListError || isPrizmPayListError) {
      setTopBar({ title: '주문' });
      init();
      return;
    }

    if (isBidCheckoutSuccess && isDeliveryListSuccess && isPrizmPaySuccess()) {
      initialValidRef.current = [
        bidCheckoutData?.orderer.isIdentify ?? false,
        (deliveryList ?? []).length > 0,
        isValidPay(),
      ];

      bidCheckoutData?.paymentInfo.selectedType && setValue('payType', bidCheckoutData?.paymentInfo.selectedType);
      prizmPayList?.[0] && setValue('prizmPayId', prizmPayList[0].id);

      setTopBar({ title: !bidCheckoutData?.recipient.isAddressRequired ? '예약' : '주문' });
      !bidCheckoutData?.recipient.isAddressRequired &&
        setDismissConfirm({
          isConfirmable: true,
          title: '예약하지 않고 나갈까요?',
          message: '내용은 저장되지 않습니다',
        });
      setPageLoad(PAGE_LOAD_TYPE.SUCCESS);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isBidCheckoutSuccess,
    isDeliveryListSuccess,
    isPrizmPayListSuccess,
    isBidCheckoutError,
    isDeliveryListError,
    isPrizmPayListError,
    isBidCheckoutLoading,
    isDeliveryListLoading,
    isPrizmPayListLoading,
  ]);

  const openPrizmPayRegisterEntry = () => {
    toAppLink(AppLinkTypes.WEB, { landingType: 'modal', url: PRIZM_PAY_REGISTER_ENTRY_URL, topBarHidden: 'true' });
  };

  useEffect(() => {
    if (isBidCheckoutFetched && isDeliveryListFetched) {
      if (bidCheckoutData) {
        logViewAuctionCheckout(bidCheckoutData);

        if (!bidCheckoutData.orderer.isIdentify) {
          openAuthModal();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBidCheckoutFetched, isDeliveryListFetched]);

  useEffect(() => {
    setDismissConfirm({ isConfirmable: true, title: '주문하지 않고 나갈까요?', message: '내용은 저장되지 않습니다' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    bidCheckoutData,
    prizmPayList: prizmPayList ?? [],
    deliveryList: deliveryList ?? [],
    method,
    isCreateOrderLoading,
    pageLoad,
    isCheckoutAuthCollapsed: isCheckoutAuthCollapsed ?? false,
    initialValid: initialValidRef.current,
    bannerList: bannerList ?? [],
    handleShippingAdd,
    handlePayAdd,
    handleShippingSelect,
    handleBuy,
    refreshCheckout,
    handleRetry,
    logCompleteIdentify,
    openPrizmPayRegisterEntry,
    handlePaymentTypeChange,
  };
};
