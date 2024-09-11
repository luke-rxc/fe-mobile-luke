import { useRef } from 'react';
import styled from 'styled-components';
import { PGType } from '@constants/order';
import { AuthenticationFormFields } from '@features/authentication/types';
import { DeliveryModel } from '@features/delivery/models';
import { PrizmPayEventBannerProps } from '@features/prizmPay/components';
import { BannerModel } from '@features/prizmPay/models';
import { Divider } from '@pui/divider';
import { CheckoutAuth } from './CheckoutAuth';
import { CheckoutDiscount } from './CheckoutDiscount';
import { CheckoutGoodsInfo } from './CheckoutGoodsInfo';
import { CheckoutPayment } from './CheckoutPayment';
import { CheckoutPCC } from './CheckoutPCC';
import { CheckoutReceiver } from './CheckoutReceiver';
import { CheckoutShipping } from './CheckoutShipping';
import { CheckoutSummary } from './CheckoutSummary';
import { CollapseSection } from './CollapseSection';
import { CheckoutCouponModel, CheckoutModel, CheckoutPrizmPayModel, CheckoutShippingModel } from '../../models';
import { SelectedCoupon } from '../../types';

interface Props {
  item: CheckoutModel;
  prizmPayList: CheckoutPrizmPayModel[];
  deliveryList: DeliveryModel[];
  onShippingSelect: (shipping: CheckoutShippingModel) => Promise<void>;
  isSendAuthNumber: boolean;
  isDisabledAuthNumber: boolean;
  handleSendSMS: (formValues: AuthenticationFormFields) => Promise<void>;
  handleAuth: (formValues: AuthenticationFormFields) => Promise<void>;
  onPayAdd?: () => void;
  onShippingAdd: () => void;
  cartCouponList: CheckoutCouponModel[];
  onGoodsCouponChange: (selectedCoupon: SelectedCoupon) => void;
  isCheckoutAuthCollapsed: boolean;
  onEventBannerClick: PrizmPayEventBannerProps['onClick'];
  bannerList: BannerModel[];
  onPaymentMethodChange?: (paymentType: PGType) => void;
}

export const CheckoutContent = ({
  item,
  cartCouponList,
  prizmPayList,
  deliveryList,
  onShippingSelect: handleShippingSelect,
  isSendAuthNumber,
  isDisabledAuthNumber,
  handleSendSMS,
  handleAuth,
  onPayAdd: handlePayAdd,
  onShippingAdd: handleShippingAdd,
  onGoodsCouponChange: handleGoodsCouponChange,
  isCheckoutAuthCollapsed,
  onEventBannerClick,
  bannerList,
  onPaymentMethodChange: handlePaymentMethodChange,
}: Props) => {
  const summaryElRef = useRef<HTMLDivElement>(null);

  return (
    <ContainerStyled>
      <CheckoutGoodsInfo
        item={item.orderInfo}
        orderCount={item.orderCount}
        className="section"
        onCouponChange={handleGoodsCouponChange}
      />
      <CollapseSection title="주문자" expanded={isCheckoutAuthCollapsed}>
        <CheckoutAuth
          orderer={item.orderer}
          isSendAuthNumber={isSendAuthNumber}
          isDisabledAuthNumber={isDisabledAuthNumber}
          onSendSMS={handleSendSMS}
          handleAuth={handleAuth}
        />
      </CollapseSection>
      <DividerStyled />
      {item.recipient.isAddressRequired ? (
        <CheckoutShipping
          deliveryList={deliveryList}
          recipientInfo={item.recipient}
          orderer={item.orderer}
          onShippingSelect={handleShippingSelect}
          onShippingAdd={handleShippingAdd}
          className="section"
        />
      ) : (
        <CheckoutReceiver className="section" orderer={item.orderer} recipientInfo={item.recipient} />
      )}
      <CheckoutDiscount
        summaryInfo={item.summaryInfo}
        cartCouponList={cartCouponList}
        className="section"
        isShowMileage={item.paymentInfo.isAvailablePoint}
      />
      <CheckoutPayment
        paymentTypeList={item.paymentInfo.paymentTypeList}
        selectedType={item.paymentInfo.selectedType}
        prizmPayList={prizmPayList}
        isShowInstallmentDropdown={item.paymentInfo.isShowInstallmentDropdown}
        bannerList={bannerList}
        onEventBannerClick={onEventBannerClick}
        onPayAdd={handlePayAdd}
        summaryElRef={summaryElRef}
        className="section"
        onPaymentMethodChange={handlePaymentMethodChange}
      />
      <CheckoutSummary summaryInfo={item.summaryInfo} ref={summaryElRef} />
      {item.isPccRequired && <CheckoutPCC />}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.bg};

  .section {
    margin-bottom: 1.2rem;
  }

  & > .content {
    margin-bottom: 5.6rem;
  }

  .section-title {
    padding: 1.75rem 0;

    .order-count {
      color: ${({ theme }) => theme.color.tint};
      font: ${({ theme }) => theme.fontType.t18B};
    }
  }
`;

const DividerStyled = styled(Divider)`
  background: ${({ theme }) => theme.color.surface};
`;
