import styled from 'styled-components';
import { CheckoutGoods } from './CheckoutGoods';
import { CheckoutGoodsCouponSelector } from './CheckoutGoodsCouponSelector';
import { CheckoutCouponModel, CheckoutGoodsModel } from '../../models';
import { SelectedCoupon } from '../../types';
import { uniq } from '../../utils';

interface Props {
  goodsId: number;
  goodsList: CheckoutGoodsModel[];
  couponList: CheckoutCouponModel[];
  onCouponChange: (coupon: SelectedCoupon) => void;
  className?: string;
}

export const CheckoutGoodsGroup = ({
  className,
  goodsId,
  goodsList,
  couponList,
  onCouponChange: handleCouponChange,
}: Props) => {
  const optionIds = goodsList.map((goods) => goods.option.id);
  const hasDuplicatedKey = uniq(optionIds).length !== optionIds.length;

  return (
    <ContainerStyled className={className}>
      {goodsList.map((goods, index) => {
        const key = hasDuplicatedKey ? [goods.option.id, index + 1].join('-') : goods.option.id;
        return <CheckoutGoods key={key} item={goods} />;
      })}
      {couponList.length > 0 && (
        <CheckoutGoodsCouponSelector
          className="coupon-selector"
          goodsId={goodsId}
          couponList={couponList}
          onChange={handleCouponChange}
        />
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  .coupon-selector {
    padding: 1.2rem 2.4rem;
  }
`;
