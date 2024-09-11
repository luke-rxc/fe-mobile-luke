import { FormProvider } from 'react-hook-form';
import { useAuthService } from '@features/authentication/services';
import { AuthenticationFormFields } from '@features/authentication/types';
import { HTMLAttributes, useEffect } from 'react';
import { useLoading } from '@hooks/useLoading';
import { useWebInterface } from '@hooks/useWebInterface';
import isEmpty from 'lodash/isEmpty';
import { CALL_WEB_EVENT_TYPE } from '@features/authentication/constants';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { useInputBlur } from '@features/authentication/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { DrawerPrizmPayRegisterContainer } from '@features/prizmPay/containers/DrawerPrizmPayRegisterContainer';
import { CALL_WEB_EVENT } from '@features/prizmPay/constants';
import { toAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useModal } from '@hooks/useModal';
import { CheckoutContent } from '../components';
import { CheckoutBuyButton } from '../components/checkout/CheckoutBuyButton';
import { CheckoutInvalidProvider } from '../contexts/CheckoutInvalidContext';
import { PAGE_LOAD_TYPE } from '../constants';
import { useCheckoutService } from '../services';

interface Props {
  checkoutId: number;
}

export const OrderCheckoutContainer = ({ checkoutId }: Props) => {
  const { showToastMessage, receiveValues, emitClearReceiveValues } = useWebInterface();
  const { isApp } = useDeviceDetect();
  const { showLoading, hideLoading } = useLoading();
  const {
    checkoutData,
    prizmPayList,
    deliveryList,
    cartCouponList,
    method,
    expiredDate,
    handleShippingSelect,
    handleBuy,
    refreshCheckout,
    handlePayAdd,
    handleShippingAdd,
    handleGoodsCouponChange,
    handleRetry,
    isCreateOrderLoading,
    pageLoad,
    logCompleteIdentify,
    isCheckoutAuthCollapsed,
    checkoutError,
    handleClose,
    initialValid,
    openPrizmPayRegisterEntry,
    bannerList,
    handlePaymentTypeChange,
    handleExpired,
  } = useCheckoutService(checkoutId);

  const {
    isSend: isSendAuthNumber,
    disabled: isDisabledAuthNumber,
    handleAuth: executeAuth,
    handleSendSMS,
  } = useAuthService();

  const { openModal } = useModal();

  async function handleAuth(param: AuthenticationFormFields): Promise<void> {
    await executeAuth(param);
    showToastMessage(
      { message: '인증되었습니다' },
      {
        autoDismiss: 2000,
        direction: 'bottom',
      },
    );
    refreshCheckout();
    logCompleteIdentify();
  }

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    quickMenus: ['cart', 'menu'],
    title: '주문',
  });

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
        if (isApp) {
          toAppLink(AppLinkTypes.MANAGE_PAY_REGISTER);
        } else {
          openModal({
            nonModalWrapper: true,
            render: (props) => <DrawerPrizmPayRegisterContainer {...props} />,
          });
        }
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
      if (checkoutData && deliveryList.length > 0) {
        const defaultDelivery = deliveryList.find((delivery) => delivery.isDefault);

        if (
          checkoutData.recipient.isAddressRequired &&
          defaultDelivery &&
          defaultDelivery.postCode !== checkoutData.recipient.postCode &&
          defaultDelivery.addressDetail !== checkoutData.recipient.addressDetail &&
          defaultDelivery.phone !== checkoutData.recipient.phone
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

  if (pageLoad === PAGE_LOAD_TYPE.INVALID_CHECKOUT_ERROR) {
    const exceptionProps = {
      isFull: true,
      title: '일시적인 오류가 발생하였습니다',
      description: checkoutError?.data?.message,
      actionLabel: '닫기',
      onAction: handleClose,
    };

    return <PageError {...exceptionProps} />;
  }

  return (
    <CheckoutInvalidProvider initialValid={initialValid}>
      <FormProvider {...method}>
        {checkoutData && (
          <InputBlurEffect>
            <CheckoutContent
              item={checkoutData}
              prizmPayList={prizmPayList}
              deliveryList={deliveryList}
              onShippingSelect={handleShippingSelect}
              isSendAuthNumber={isSendAuthNumber}
              isDisabledAuthNumber={isDisabledAuthNumber}
              handleSendSMS={handleSendSMS}
              handleAuth={handleAuth}
              onPayAdd={handlePayAdd}
              onShippingAdd={handleShippingAdd}
              cartCouponList={cartCouponList}
              onGoodsCouponChange={handleGoodsCouponChange}
              isCheckoutAuthCollapsed={isCheckoutAuthCollapsed}
              onEventBannerClick={openPrizmPayRegisterEntry}
              bannerList={bannerList}
              onPaymentMethodChange={handlePaymentTypeChange}
            />
            <CheckoutBuyButton
              checkoutInfo={checkoutData}
              isLoading={isCreateOrderLoading}
              initialValid={initialValid}
              expiredDate={expiredDate}
              onBuy={handleBuy}
              onExpired={handleExpired}
            />
          </InputBlurEffect>
        )}
      </FormProvider>
    </CheckoutInvalidProvider>
  );
};

type InputBlurEffectProps = HTMLAttributes<HTMLDivElement>;

const InputBlurEffect = ({ children, ...props }: InputBlurEffectProps) => {
  const elRef = useInputBlur<HTMLDivElement>();

  return (
    <div {...props} ref={elRef}>
      {children}
    </div>
  );
};
