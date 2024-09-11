import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ChevronRight } from '@pui/icon';
import { Action } from '@pui/action';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { CartGoods } from './CartGoods';
import { CartBrandGroupModel } from '../../models';

interface Props {
  brand: CartBrandGroupModel['brand'];
  cartDataList: CartBrandGroupModel['cartDataList'];
  onChange: (cartId: number, quantity: number) => Promise<void>;
  onDelete: (cartId: number, skipConfirmation?: boolean) => Promise<string>;
}

export const CartBrand = ({ brand, cartDataList = [], onChange: handleChange, onDelete }: Props) => {
  const { isApp } = useDeviceDetect();
  const getShowRoomUrl = useCallback(() => {
    if (!brand?.brandShowRoomCode) {
      return '';
    }

    return isApp
      ? getAppLink(AppLinkTypes.SHOWROOM, { showroomCode: brand?.brandShowRoomCode })
      : `/showroom/${brand?.brandShowRoomCode}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const link = getShowRoomUrl();
  const title = (
    <BrandNameStyled className="brand-name-title">
      {brand.name}
      {link && <ChevronRight size="2.4rem" color="gray50" />}
    </BrandNameStyled>
  );

  return (
    <>
      <TitleStyled className="brand-name" children={title} {...(link && { link })} />
      <CartGoodsList cartDataList={cartDataList} onDelete={onDelete} onChange={handleChange} />
    </>
  );
};

const TitleStyled = styled(Action).attrs({ is: 'a' })`
  display: block;
  padding: 1.5rem 2.4rem;
  pointer-events: ${({ link }) => (!link ? 'none' : 'auto')};
  touch-action: ${({ link }) => (!link ? 'none' : 'auto')};
  transition: opacity 200ms;

  &:active {
    opacity: 0.5;
  }
`;

const BrandNameStyled = styled.span`
  display: flex;
  align-items: center;
  font: ${({ theme }) => theme.fontType.t15B};
  color: ${({ theme }) => theme.color.gray50};
`;

interface CartGoodsListProps {
  cartDataList: CartBrandGroupModel['cartDataList'];
  onChange: (cartId: number, quantity: number) => Promise<void>;
  onDelete: (cartId: number, skipConfirmation?: boolean) => Promise<string>;
}

const CartGoodsList = ({ cartDataList, onChange: handleChange, onDelete }: CartGoodsListProps) => {
  const isOnlyOne = cartDataList.length === 1;

  const handleDelete = useCallback(async (cartId: number, skipConfirmation?: boolean) => {
    return onDelete(cartId, skipConfirmation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul>
      {cartDataList.map((goodsData) => {
        const {
          cartId,
          goods: {
            code: goodsCode,
            primaryImage: { path: src, blurHash },
            name: goodsName,
            discountRate,
            options,
            goodsStatusText,
          },
          isBuyable,
          quantity,
          purchasableStock,
          priceWithQuantity,
          consumerPriceWithQuantity,
        } = goodsData;

        return (
          <React.Fragment key={cartId}>
            <li>
              <CartGoods
                cartId={cartId}
                goodsImage={{ src, blurHash }}
                goodsName={goodsName}
                discountRate={discountRate}
                options={options}
                quantity={quantity}
                goodsCode={goodsCode}
                isBuyable={isBuyable}
                disableDeleteAnimation={isOnlyOne}
                purchasableStock={purchasableStock}
                goodsStatusText={goodsStatusText}
                priceWithQuantity={priceWithQuantity}
                consumerPriceWithQuantity={consumerPriceWithQuantity}
                onChange={handleChange}
                onDelete={handleDelete}
              />
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};
