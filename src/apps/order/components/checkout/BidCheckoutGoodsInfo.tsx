import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { CheckoutGoodsGroup } from './CheckoutGoodsGroup';
import { BidCheckoutGoodsInfoModel } from '../../models';

interface Props {
  orderCount: number;
  item: BidCheckoutGoodsInfoModel;
  className?: string;
}
export const BidCheckoutGoodsInfo = ({ orderCount, item, className }: Props) => {
  return (
    <ContainerStyled className={className}>
      <TitleSection title={<>상품 {orderCount > 1 && <em className="order-count">{orderCount}</em>}</>} />
      <div className="goods-info-list">
        {item.goodsInfos.map(({ goodsId, goodsList }, index) => {
          return (
            <React.Fragment key={goodsId}>
              <CheckoutGoodsGroup
                key={goodsId}
                goodsId={goodsId}
                goodsList={goodsList}
                couponList={[]}
                onCouponChange={() => {}}
                className="goods-group"
              />
              {item.goodsInfos.length > 1 && item.goodsInfos.length - 1 !== index && <Divider />}
            </React.Fragment>
          );
        })}
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  width: 100%;
  margin-bottom: 1.2rem;

  .goods-group {
    margin: 1.2rem 0;

    &:first-child {
      margin-top: 0;
    }
  }
`;
