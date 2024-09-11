import styled from 'styled-components';
import { Divider } from '@pui/divider';
import { OrderGoodsListItem } from '@pui/orderGoodsListItem/v2';
import { UniversalLinkTypes } from '@constants/link';
import { OrderModel } from '../../models';
import { OrderPaymentInfo } from './OrderPaymentInfo';
import { OrderRecipientInfo } from './OrderRecipientInfo';
import { OrderAction } from './OrderAction';
import { uniq } from '../../utils';

interface Props {
  item: OrderModel;
  isShowBottomControl: boolean;
  onNavigate: (link: UniversalLinkTypes) => void;
}

export const OrderContent = ({ item, isShowBottomControl, onNavigate }: Props) => {
  const optionIds = item.itemOptionList.map((itemOption) => itemOption.goods.option.id);
  const hasDuplicatedKey = uniq(optionIds).length !== optionIds.length;

  return (
    <ContainerStyled>
      <div>
        {item.itemOptionList.map((itemOption, index) => {
          const { goods } = itemOption;
          const {
            primaryImage: { path: src, blurHash },
          } = goods;
          const key = hasDuplicatedKey ? [goods.option.id, index + 1].join('-') : goods.option.id;

          return (
            <OrderGoodsListItem
              className="goods-item"
              key={key}
              goodsImage={{ src, blurHash }}
              brandName={itemOption.brand?.name}
              goodsName={itemOption.goods.name}
              consumerPrice={itemOption.goods.consumerPrice}
              price={itemOption.priceWithEa}
              quantity={itemOption.ea}
              options={itemOption.options}
            />
          );
        })}
      </div>
      <Divider />
      <div className="section">
        <OrderRecipientInfo item={item.recipient} />
      </div>
      <div className="section">
        <OrderPaymentInfo item={item.payment} />
      </div>
      {isShowBottomControl && <OrderAction action={item.action} onNavigate={onNavigate} />}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  & > .section {
    padding-top: ${({ theme }) => theme.spacing.s12};
    padding-bottom: ${({ theme }) => theme.spacing.s12};
  }

  .goods-item {
    margin-bottom: ${({ theme }) => theme.spacing.s12};
  }
`;
