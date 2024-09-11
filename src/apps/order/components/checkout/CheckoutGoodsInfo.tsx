import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { CheckoutGoodsGroup } from './CheckoutGoodsGroup';
import { CheckoutGoodsInfoModel } from '../../models';
import { SelectedCoupon } from '../../types';

interface Props {
  orderCount: number;
  item: CheckoutGoodsInfoModel;
  className?: string;
  onCouponChange: (selectedCoupon: SelectedCoupon) => void;
}
export const CheckoutGoodsInfo = ({ orderCount, item, className, onCouponChange: handleCouponChange }: Props) => {
  return (
    <ContainerStyled className={className}>
      <TitleSection title={<>상품 {orderCount > 1 && <em className="order-count">{orderCount}</em>}</>} />
      <div className="goods-info-list">
        {item.goodsInfos.map(({ goodsId, goodsList, couponList }, index) => {
          return (
            <React.Fragment key={goodsId}>
              <CheckoutGoodsGroup
                goodsId={goodsId}
                goodsList={goodsList}
                couponList={couponList}
                onCouponChange={handleCouponChange}
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
    padding: 1.2rem 0;

    &:first-child {
      padding-top: 0;
    }
  }
`;
