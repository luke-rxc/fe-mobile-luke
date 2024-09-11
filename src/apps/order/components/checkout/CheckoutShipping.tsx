import { useCallback, useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { DeliveryModel } from '@features/delivery/models';
import { TitleSection } from '@pui/titleSection';
import { CheckoutShippingMessage } from './CheckoutShippingMessage';
import { CheckoutDeliveryCarousel } from './CheckoutDeliveryCarousel';
import { CheckoutInvalidContext } from '../../contexts/CheckoutInvalidContext';
import { CheckoutOrdererInfoModel, CheckoutRecipientInfoModel, CheckoutShippingModel } from '../../models';
import { SHIPPING_MESSAGE_LIST } from '../../constants';

interface Props {
  className?: string;
  recipientInfo: CheckoutRecipientInfoModel;
  deliveryList: DeliveryModel[];
  orderer: CheckoutOrdererInfoModel;
  onShippingSelect: (shipping: CheckoutShippingModel) => Promise<void>;
  onShippingAdd: () => void;
}

export const CheckoutShipping = ({
  deliveryList: deliveryListProps,
  recipientInfo: recipientInfoProps,
  className,
  orderer,
  onShippingSelect,
  onShippingAdd: handleShippingAdd,
}: Props) => {
  const { setValue, clearErrors } = useFormContext();
  const { updateIsDeliveryValid } = useContext(CheckoutInvalidContext);
  const [deliveryList, setDeliveryList] = useState(deliveryListProps);

  const handleShippingSelect = useCallback(async (delivery: DeliveryModel) => {
    updateIsDeliveryValid(!!delivery);
    if (delivery) {
      await onShippingSelect(delivery);
    }
    // eslint-disable-next-line
  }, []);

  const handleShippingMessageChange = useCallback(() => {
    clearErrors('etcMessage');
  }, [clearErrors]);

  useEffect(() => {
    const { name, phone, postCode, address, addressDetail } = recipientInfoProps;
    setValue('recipientName', name);
    setValue('recipientPhone', phone);
    setValue('recipientPostCode', postCode);
    setValue('recipientAddress', address);
    setValue('recipientAddressDetail', addressDetail);
  }, [recipientInfoProps, setValue]);

  useEffect(() => {
    setDeliveryList(deliveryListProps);
    updateIsDeliveryValid(deliveryListProps.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryListProps]);

  return (
    <ContainerStyled className={className}>
      <TitleSection title="배송지" />
      <div className="delivery-box">
        <CheckoutDeliveryCarousel
          deliveryList={deliveryList}
          onChange={handleShippingSelect}
          onAdd={handleShippingAdd}
          orderer={orderer}
        />
      </div>
      {recipientInfoProps.isShowRequestMessageDropdown && (
        <div className="delivery-box">
          <CheckoutShippingMessage
            defaultSelect={SHIPPING_MESSAGE_LIST[0].value}
            placeholder="배송 요청사항 선택"
            optionList={SHIPPING_MESSAGE_LIST}
            onChange={handleShippingMessageChange}
          />
        </div>
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.surface};

  .delivery-box {
    position: relative;
    padding: 1.2rem 2.4rem 2.4rem 2.4rem;
    overflow: hidden;

    &:last-child {
      padding-top: 0;
    }

    .delivery-switch {
      height: 3.1rem;
    }

    .text-field-box,
    .text-field {
      width: 100%;
    }
  }
`;
