import { Button } from '@pui/button';
import { CouponCard } from '@pui/couponCard';
import styled from 'styled-components';
import { useEffect } from 'react';
import classnames from 'classnames';
import { LiveShowroomModel } from '../models';
import { ReturnTypeUseLiveCouponService } from '../services';

interface Props extends ReturnTypeUseLiveCouponService {
  showroom: LiveShowroomModel | undefined;
  viewType?: 'live' | 'liveEnd';
}

export const LiveCouponList = ({
  couponLabel,
  couponList,
  showroom,
  downloadableCouponCount,
  isOpen,
  isFetching,
  viewType = 'live',
  handleClickDownloadCoupon,
  handleImpressionCoupon,
  ...props
}: Props) => {
  const { tintColor: bgColor, textColor } = showroom || {};

  useEffect(() => {
    const opened = viewType === 'live' ? isOpen : true;
    if (!isFetching && couponList.length > 0 && opened) {
      handleImpressionCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType, isOpen, isFetching, couponList]);

  if (couponList.length === 0) {
    return null;
  }

  return (
    <WrapperStyled {...props} className={classnames({ live: viewType === 'live', 'live-end': viewType === 'liveEnd' })}>
      <CouponWrapperStyled>
        {couponList.map(({ couponId, display: { name, title: discount }, status }) => {
          return (
            <CouponCard
              key={couponId}
              name={name}
              discount={discount}
              status={status}
              bgColor={bgColor}
              textColor={textColor}
            />
          );
        })}
      </CouponWrapperStyled>
      <ButtonWrapperStyled>
        <Button
          block
          variant="tertiaryline"
          size="medium"
          disabled={downloadableCouponCount === 0}
          onClick={handleClickDownloadCoupon}
        >
          {couponLabel}
        </Button>
      </ButtonWrapperStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: 100%;

  &.live {
    padding: 1.2rem 0 2.4rem;
    height: 18.8rem;
  }

  &.live-end {
    padding: 0 0 2.4rem;
  }
`;

const CouponWrapperStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  box-sizing: border-box;
  padding: 0 2.4rem;
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */

  ${CouponCard} {
    flex: 0 0 auto;
    margin-left: 1.2rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const ButtonWrapperStyled = styled.div`
  margin-top: 1.6rem;
  padding: 0 2.4rem;
`;
