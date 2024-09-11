import styled, { keyframes } from 'styled-components';
import { isUndefined } from '@utils/type';
import { LiveContentsType } from '@constants/live';
import { ReactNode } from 'react';
import { LiveDealGoods } from '../models';

interface Props {
  children?: ReactNode;
  item: LiveDealGoods;
  contentsType?: LiveContentsType;
}

/**
 * DealGoodsDescription
 *
 * DealGoods description component
 */
export const DealGoodsDescription = ({ children, item, contentsType }: Props) => {
  const { discountRateText, goodsName, benefits, hasCoupon, priceText, status, goodsCount, isRunOut } = item;
  const showInfo = !isRunOut && (hasCoupon || benefits?.label);

  return (
    <WrapperStyled className={`${(contentsType || '').toLowerCase()} ${children ? 'last-auction' : ''}`}>
      <div className="info">
        <div className="goodsName">
          <div className="text-wrapper">
            <span className="name">{goodsName}</span>
            {goodsCount && goodsCount > 1 && <span className="more">외 {goodsCount - 1}개</span>}
          </div>
        </div>
        {!isUndefined(priceText) && (
          <PriceStyled className={status ? 'auction' : ''}>
            {!isUndefined(discountRateText) && goodsCount === 1 && (
              <DiscoverRateStyled>{discountRateText}</DiscoverRateStyled>
            )}
            {priceText}
          </PriceStyled>
        )}
        {showInfo && (
          <InformationStyled>
            {benefits?.label && <span>{benefits.label}</span>}
            {hasCoupon && <span className="coupon">쿠폰</span>}
          </InformationStyled>
        )}
        {isRunOut && (
          <InformationStyled>
            <span>품절</span>
          </InformationStyled>
        )}
      </div>
      {children}
    </WrapperStyled>
  );
};

const slideUp = keyframes`
  to { transform: translateY(0); }
`;

const WrapperStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 6.4rem;
  text-align: left;
  word-break: break-all;
  color: ${({ theme }) => theme.light.color.white};
  position: relative;

  &.auction {
    > div.info {
      top: 0;
      transform: translateY(1.5rem);
    }

    &.last-auction {
      > .info {
        animation: 300ms linear 300ms normal forwards ${slideUp};
      }
    }
  }

  > .info {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
  }

  .goodsName {
    display: flex;
    align-items: center;
  }

  .text-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    font: ${({ theme }) => theme.fontType.small};
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .more {
    margin-left: 5px;
    flex: 0 0 auto;
  }
`;

const PriceStyled = styled.div`
  font: ${({ theme }) => theme.fontType.smallB};
  text-align: left;
  margin-top: 0.4rem;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &.auction {
    font: ${({ theme }) => theme.fontType.mini};
    line-height: 1.4rem;
  }
`;

const DiscoverRateStyled = styled.span`
  color: ${({ theme }) => theme.light.color.white};
  margin-right: 0.4rem;
`;

const InformationStyled = styled.div`
  margin-top: 0.4rem;
  font: ${({ theme }) => theme.fontType.micro};
  color: ${({ theme }) => theme.dark.color.gray50};

  .coupon {
    &:not(:first-child) {
      margin-left: 0.8rem;
    }
  }
`;
