import styled from 'styled-components';
import { PGType } from '@constants/order';
import { AuthenticationFormFields } from '@features/authentication/types';
import { DeliveryModel } from '@features/delivery/models';
import { Divider } from '@pui/divider';
import { PrizmPayEventBannerProps } from '@features/prizmPay/components';
import { BannerModel } from '@features/prizmPay/models';
import { CheckoutAuth } from './CheckoutAuth';
import { BidCheckoutGoodsInfo } from './BidCheckoutGoodsInfo';
import { CheckoutPayment } from './CheckoutPayment';
import { CheckoutShipping } from './CheckoutShipping';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutReceiver } from './CheckoutReceiver';
import { CollapseSection } from './CollapseSection';
import { BidCheckoutModel, CheckoutPrizmPayModel, CheckoutShippingModel } from '../../models';

interface Props {
  item: BidCheckoutModel;
  prizmPayList: CheckoutPrizmPayModel[];
  deliveryList: DeliveryModel[];
  onShippingSelect: (shipping: CheckoutShippingModel) => Promise<void>;
  isSendAuthNumber: boolean;
  isDisabledAuthNumber: boolean;
  handleSendSMS: (formValues: AuthenticationFormFields) => Promise<void>;
  handleAuth: (formValues: AuthenticationFormFields) => Promise<void>;
  onPayAdd?: () => void;
  onShippingAdd: () => void;
  isCheckoutAuthCollapsed: boolean;
  onEventBannerClick: PrizmPayEventBannerProps['onClick'];
  bannerList: BannerModel[];
  onPaymentMethodChange?: (paymentType: PGType) => void;
}

export const BidCheckoutContent = ({
  item,
  prizmPayList,
  deliveryList,
  onShippingSelect: handleShippingSelect,
  isSendAuthNumber,
  isDisabledAuthNumber,
  handleSendSMS,
  handleAuth,
  onPayAdd: handlePayAdd,
  onShippingAdd: handleShippingAdd,
  isCheckoutAuthCollapsed,
  onEventBannerClick,
  bannerList,
  onPaymentMethodChange: handlePaymentMethodChange,
}: Props) => {
  return (
    <ContainerStyled>
      <BidCheckoutGoodsInfo orderCount={item.orderCount} item={item.orderInfo} className="section" />
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
      <CheckoutPayment
        paymentTypeList={item.paymentInfo.paymentTypeList}
        selectedType={item.paymentInfo.selectedType}
        prizmPayList={prizmPayList}
        isShowInstallmentDropdown={item.paymentInfo.isShowInstallmentDropdown}
        bannerList={bannerList}
        onEventBannerClick={onEventBannerClick}
        onPayAdd={handlePayAdd}
        className="section"
        onPaymentMethodChange={handlePaymentMethodChange}
      />
      <CheckoutSummary summaryInfo={item.summaryInfo} />
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.bg};

  .section {
    margin-bottom: 1.2rem;
  }

  .section-title {
    padding: 1.75rem 0;

    .order-count {
      color: ${({ theme }) => theme.color.tint};
      font: ${({ theme }) => theme.fontType.t18B};
    }
  }

  .accordion-content {
    padding: 0;
    width: 100%;
  }
`;

const DividerStyled = styled(Divider)`
  background: ${({ theme }) => theme.color.surface};
`;
