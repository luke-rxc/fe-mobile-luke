import { useAuthService } from '@features/authentication/services';
import { AuthenticationFormFields } from '@features/authentication/types';
import { useLoading } from '@hooks/useLoading';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { useWebInterface } from '@hooks/useWebInterface';
import { CALL_WEB_EVENT_TYPE } from '@features/authentication/constants';
import { PageError } from '@features/exception/components';
import { CALL_WEB_EVENT } from '@features/prizmPay/constants';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { toAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { BidCheckoutContent } from '../components/checkout/BidCheckoutContent';
import { BidCheckoutBuyButton } from '../components/checkout/BidCheckoutBuyButton';
import { PAGE_LOAD_TYPE } from '../constants';
import { CheckoutInvalidProvider } from '../contexts/CheckoutInvalidContext';
import { useBidCheckoutService } from '../services/useBidCheckoutService';

interface Props {
  auctionId: number;
}

export const OrderBidCheckoutContainer = ({ auctionId }: Props) => {
  const { showToastMessage, receiveValues, emitClearReceiveValues } = useWebInterface();
  const { isApp } = useDeviceDetect();
  const { showLoading, hideLoading } = useLoading();
  const {
    bidCheckoutData,
    prizmPayList,
    deliveryList,
    method,
    handleShippingSelect,
    handleBuy,
    refreshCheckout,
    handleShippingAdd,
    handlePayAdd,
    handleRetry,
    logCompleteIdentify,
    isCreateOrderLoading,
    pageLoad,
    isCheckoutAuthCollapsed,
    initialValid,
    openPrizmPayRegisterEntry,
    bannerList,
    handlePaymentTypeChange,
  } = useBidCheckoutService(auctionId);
  const {
    isSend: isSendAuthNumber,
    disabled: isDisabledAuthNumber,
    handleAuth: executeAuth,
    handleSendSMS,
  } = useAuthService();

  async function handleAuth(param: AuthenticationFormFields): Promise<void> {
    await executeAuth(param);
    refreshCheckout();
    logCompleteIdentify();
  }

  useEffect(() => {
    const refresh = async () => {
      await refreshCheckout();
      method.trigger();
    };

    if (!isEmpty(receiveValues)) {
      const { type } = receiveValues;

      if (type === CALL_WEB_EVENT_TYPE.ON_SMS_AUTH_CLOSE) {
        showToastMessage(
          { message: '인증되었습니다' },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );
        refresh();
        logCompleteIdentify();
      }

      if (type === CALL_WEB_EVENT.ON_REGISTER_ENTRY_CLOSE) {
        toAppLink(AppLinkTypes.MANAGE_PAY_REGISTER);
      }

      !isApp && emitClearReceiveValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  useEffect(() => {
    if (pageLoad === PAGE_LOAD_TYPE.LOADING) {
      showLoading();
      return;
    }

    if (pageLoad === PAGE_LOAD_TYPE.SUCCESS) {
      if (bidCheckoutData && deliveryList.length > 0) {
        const defaultDelivery = deliveryList.find((delivery) => delivery.isDefault);

        if (
          bidCheckoutData.recipient.isAddressRequired &&
          defaultDelivery &&
          defaultDelivery.postCode !== bidCheckoutData.recipient.postCode &&
          defaultDelivery.addressDetail !== bidCheckoutData.recipient.addressDetail &&
          defaultDelivery.phone !== bidCheckoutData.recipient.phone
        ) {
          handleShippingSelect(defaultDelivery);
        }
      }
    }

    hideLoading();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad]);

  if (pageLoad === PAGE_LOAD_TYPE.LOADING) {
    return null;
  }

  if (pageLoad === PAGE_LOAD_TYPE.UNUSABLE_CHECKOUT_ERROR) {
    return null;
  }

  if (pageLoad === PAGE_LOAD_TYPE.NORMAL_ERROR) {
    const exceptionProps = {
      isFull: true,
      title: '일시적인 오류가 발생하였습니다',
      description: '잠시 후 다시 시도해주세요',
      actionLabel: '다시 시도',
      onAction: handleRetry,
    };

    return <PageError {...exceptionProps} />;
  }

  return (
    <CheckoutInvalidProvider initialValid={initialValid}>
      <FormProvider {...method}>
        {bidCheckoutData && (
          <>
            <BidCheckoutContent
              item={bidCheckoutData}
              prizmPayList={prizmPayList}
              deliveryList={deliveryList}
              onShippingSelect={handleShippingSelect}
              isSendAuthNumber={isSendAuthNumber}
              isDisabledAuthNumber={isDisabledAuthNumber}
              handleSendSMS={handleSendSMS}
              handleAuth={handleAuth}
              onPayAdd={handlePayAdd}
              onShippingAdd={handleShippingAdd}
              isCheckoutAuthCollapsed={isCheckoutAuthCollapsed}
              onEventBannerClick={openPrizmPayRegisterEntry}
              bannerList={bannerList}
              onPaymentMethodChange={handlePaymentTypeChange}
            />
            <BidCheckoutBuyButton
              initialValid={initialValid}
              checkoutInfo={bidCheckoutData}
              onBuy={handleBuy}
              isLoading={isCreateOrderLoading}
            />
          </>
        )}
      </FormProvider>
    </CheckoutInvalidProvider>
  );
};
