import styled from 'styled-components';
import { Card, Location } from '@pui/icon';
import { ReturnTypeUseLiveAuthAuctionEditService } from '../services';
import { CardInfo } from './CardInfo';

type Props = Pick<ReturnTypeUseLiveAuthAuctionEditService, 'liveAutoPaymentInfo' | 'isExtraMarginDevice' | 'actions'>;

/**
 * 필수정보 view component
 */
export const AuthInfoView = ({
  liveAutoPaymentInfo,
  isExtraMarginDevice,
  actions: { onClickPayment: handleClickPayment, onClickDelivery: handleClickDelivery },
}: Props) => {
  if (!liveAutoPaymentInfo) {
    return null;
  }

  const {
    payment: { name, code, alias },
    shippingAddressInfo,
  } = liveAutoPaymentInfo;

  return (
    <WrapperStyled $isExtraMarginDevice={isExtraMarginDevice}>
      <ItemStyled onClick={handleClickPayment}>
        <IconWrapperStyled>
          <Card size="1.8rem" />
        </IconWrapperStyled>
        <InfoStyled>
          <TitleStyled>결제수단</TitleStyled>
          <ContentStyled>
            <CardInfo cardName={alias || name} cardNumber={code} />
          </ContentStyled>
        </InfoStyled>
      </ItemStyled>
      <ItemStyled onClick={handleClickDelivery}>
        <IconWrapperStyled>
          <Location size="1.8rem" />
        </IconWrapperStyled>
        <InfoStyled>
          <TitleStyled>배송지 정보</TitleStyled>
          <ContentStyled>
            <DescriptionStyled>{shippingAddressInfo}</DescriptionStyled>
          </ContentStyled>
        </InfoStyled>
      </ItemStyled>
    </WrapperStyled>
  );
};

const InfoStyled = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

const TitleStyled = styled.div`
  display: inline-block;
  width: 100%;

  font: ${({ theme }) => theme.fontType.t15B};
`;

const ContentStyled = styled.div`
  display: inline-block;
  width: 100%;
  font: ${({ theme }) => theme.fontType.t12};
  color: ${({ theme }) => theme.color.gray50};
  margin-top: 0.2rem;
`;

const IconWrapperStyled = styled.div`
  flex-shrink: 0;
  width: 1.8rem;
  margin-right: 1.6rem;
  -webkit-touch-callout: none;
`;

const ItemStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  height: 5.6rem;
  background-color: ${({ theme }) => theme.color.gray3};
  border-radius: 0.8rem;
  padding: 0 1.6rem;
  margin-bottom: 1.2rem;
`;

const WrapperStyled = styled.div<{ $isExtraMarginDevice: Props['isExtraMarginDevice'] }>`
  padding: 1.2rem 0;
  ${({ $isExtraMarginDevice }) =>
    $isExtraMarginDevice &&
    `
    margin-top: 1.2rem;
  `}

  ${ItemStyled}:last-child {
    margin-bottom: 0;
  }
`;

const DescriptionStyled = styled.div`
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-align: left;
`;
