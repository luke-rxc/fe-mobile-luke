import styled from 'styled-components';
import { Divider } from '@pui/divider';
import { CheckoutCartCouponSelector } from './CheckoutCartCouponSelector';
import { CheckoutMileage } from './CheckoutMileage';
import { CheckoutCouponModel, CheckoutSummaryModel } from '../../models';

interface Props {
  summaryInfo: CheckoutSummaryModel;
  cartCouponList: CheckoutCouponModel[];
  isShowMileage: boolean;
  className?: string;
}

export const CheckoutDiscount = ({ summaryInfo, cartCouponList, className, isShowMileage }: Props) => {
  return (
    <ContainerStyled className={className}>
      {isShowMileage && (
        <CheckoutMileageStyled
          pointBalance={summaryInfo.pointBalance}
          pointWeight={summaryInfo.pointWeight}
          usablePoint={summaryInfo.usablePoint}
          orderPrice={summaryInfo.orderPrice}
        />
      )}
      {cartCouponList.length > 0 && (
        <>
          <Divider />
          <CheckoutCartCouponSelectorStyled couponList={cartCouponList} />
        </>
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.surface};
`;

const CheckoutMileageStyled = styled(CheckoutMileage)``;

const CheckoutCartCouponSelectorStyled = styled(CheckoutCartCouponSelector)`
  margin-bottom: 2rem;
`;
