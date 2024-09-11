/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import classnames from 'classnames';
import { useUpdateEffect } from 'react-use';
import { useWebInterface } from '@hooks/useWebInterface';
import { Action } from '@pui/action';
import { Close } from '@pui/icon';
import { Collapse } from '@pui/collapse';
import { Stepper, StepperEvent } from '@pui/stepper';
import { OrderGoodsListItem, OrderGoodsListItemProps } from '@pui/orderGoodsListItem';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { QuantityType, QUANTITY_TYPE, USER_PURCHASABLE_STOCK } from '../../constants';
import { useCartStock } from '../../hooks/useCartStock';

/**
 * debounce time
 */
const debounceTime = 300;

/**
 * 사용가능한 최대 stock 수치 설정
 * USER_PURCHASABLE_STOCK: 장바구니 수량 입력시 99개를 넘길수 없음
 */
const setValidStock = (stock: number, limit = USER_PURCHASABLE_STOCK) => {
  return Math.min(stock, limit);
};

interface CartGoodsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  cartId: number;
  /** imageUrl과 imageProps을 대체할 props */
  goodsImage?: OrderGoodsListItemProps['goodsImage'];
  /** 상품명 */
  goodsName: string;
  /** 할인율 */
  discountRate: number;
  /** (권장소비자가 * 수량) 가격 */
  consumerPriceWithQuantity: number;
  /** (판매가 * 수량) 가격 */
  priceWithQuantity: number;
  /** 주문상품옵션 */
  options: string[];
  /** 구매수량 */
  quantity: number;
  /** 상품 코드 */
  goodsCode: string;
  /** 구매가능여부 */
  isBuyable: boolean;
  /** 구매 가능 재고수량 */
  purchasableStock: number;
  /** 상품 상태 텍스트 */
  goodsStatusText: string;
  /** 상품 그룹의 유일한 상품인가? */
  disableDeleteAnimation?: boolean;
  /** change이벤트 콜백함수 */
  onChange: (cartId: number, quantity: number) => Promise<void>;
  /** delete이벤트 콜밸함수 */
  onDelete: (cartId: number, skipConfirmation: boolean) => Promise<string>;
}

export const CartGoodsComponent: React.FC<CartGoodsProps> = ({
  cartId,
  goodsImage,
  goodsName,
  discountRate,
  priceWithQuantity,
  consumerPriceWithQuantity,
  options,
  goodsCode,
  isBuyable,
  disableDeleteAnimation,
  goodsStatusText,
  quantity,
  purchasableStock: purchasableStockProps,
  onChange,
  onDelete,
  ...rest
}) => {
  const { push, remove } = useCartStock();
  const { confirm, showToastMessage, generateHapticFeedback } = useWebInterface();

  const timer = useRef<number>();
  const [isDelete, setDelete] = useState<boolean>(false);

  const [status, setStatus] = useState<QuantityType>(QUANTITY_TYPE.SUCCESS);
  const [purchasableStock, setPurchasableStock] = useState<number>(setValidStock(purchasableStockProps));

  const getErrorMessage = (value: number) => {
    // https://rxc.atlassian.net/browse/FE-3019
    return value >= USER_PURCHASABLE_STOCK && purchasableStockProps >= USER_PURCHASABLE_STOCK
      ? `한 번에 최대 ${USER_PURCHASABLE_STOCK}개까지 구매할 수 있습니다`
      : `최대 ${purchasableStock}개까지 구매할 수 있습니다`;
  };

  /**
   * stepper change 모션이 실행되기전 == onClick
   */
  const handleChangeBefore = ({ type, action, value }: StepperEvent) => {
    if (type === 'error' && action === 'increase') {
      showToastMessage({ message: getErrorMessage(value) });
      return;
    }

    if (type === 'change') {
      timer.current && window.clearTimeout(timer.current);
      timer.current = undefined;
    }
  };

  /**
   * stepper change 모션이 끝나고 실제 api 요청
   */
  const handleChange = ({ value }: StepperEvent) => {
    timer.current = window.setTimeout(async () => {
      if (value > purchasableStock) {
        setStatus(QUANTITY_TYPE.LACK_STOCK_ERROR);
        timer.current = undefined;
        return;
      }

      try {
        await onChange(cartId, value);
      } catch (error) {
        const message = get(error, 'data.message', '');
        const [stockError] = get(error, 'data.errors', []);

        if (stockError?.field === 'purchasableStock') {
          setPurchasableStock(setValidStock(Number(stockError.value)));
        } else {
          showToastMessage({ message });
        }
      } finally {
        timer.current = undefined;
      }
    }, debounceTime);
  };

  /**
   * 삭제 이벤트 핸들러 == 삭제 모션 실행
   */
  const handleDelete = async () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });
    if (await confirm({ title: '상품을 삭제할까요?' })) {
      disableDeleteAnimation ? deleteGoods() : setDelete(true); // 삭제 모션을 위한 state 변경 // 상품 그룹의 마지막 상품인 경우 모션 없이 바로 삭제
      timer.current && window.clearTimeout(timer.current);
    }
  };

  /**
   * 실제 삭제 요청
   */
  const deleteGoods = async () => {
    try {
      await onDelete(cartId, true);
      remove(cartId);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  useEffect(() => {
    const quantityStatus =
      isBuyable && quantity > purchasableStock ? QUANTITY_TYPE.LACK_STOCK_ERROR : QUANTITY_TYPE.SUCCESS;

    setStatus(quantityStatus);
  }, [isBuyable, quantity, purchasableStock]);

  useEffect(() => {
    (status !== QUANTITY_TYPE.SUCCESS ? push : remove)(cartId);
  }, [status, cartId, push, remove]);

  useEffect(() => {
    return () => remove(cartId);
  }, [remove, cartId]);

  useUpdateEffect(() => {
    setPurchasableStock(setValidStock(purchasableStockProps));
  }, [purchasableStockProps]);

  return (
    <Collapse
      expanded={!isDelete}
      collapseOptions={{ duration: 400, delay: 100, onCollapseEnd: deleteGoods }}
      {...rest}
    >
      <div className={classnames('cart-item-inner', { 'is-delete': isDelete })}>
        <OrderGoodsListItem
          buyable={isBuyable}
          goodsName={goodsName}
          goodsImage={goodsImage}
          discountRate={discountRate}
          consumerPrice={consumerPriceWithQuantity}
          price={priceWithQuantity}
          options={options}
          goodsStatusText={goodsStatusText}
          goodsCode={goodsCode}
          action={
            <div className="cart-action">
              {isBuyable && (
                <Stepper
                  label="수량"
                  className="quantity"
                  value={quantity}
                  max={purchasableStock}
                  onChange={handleChange}
                  onBefore={handleChangeBefore}
                />
              )}

              <Action className="delete" aria-label="삭제" onClick={handleDelete}>
                <Close />
              </Action>

              {status === QUANTITY_TYPE.LACK_STOCK_ERROR && (
                <p className="message">{getErrorMessage(purchasableStock)}</p>
              )}
            </div>
          }
        />
      </div>
    </Collapse>
  );
};

export const CartGoods = styled(CartGoodsComponent)`
  .cart-item-inner {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: transform 300ms, opacity 300ms;

    &.is-delete {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
  }

  .cart-action {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;

    ${Stepper}.quantity {
      flex-shrink: 0;
    }

    ${Action}.delete {
      ${({ theme }) => theme.mixin.centerItem(true)};
      position: relative;
      flex-shrink: 0;
      width: 3.6rem;
      height: 3.6rem;
      border-radius: ${({ theme }) => theme.radius.s8};
      background: ${({ theme }) => theme.color.gray3};
      color: ${({ theme }) => theme.color.gray50};
      transition: background 0.2s;

      &:active {
        background: ${({ theme }) => theme.color.dimmed};
      }

      ${Close} {
        width: 2rem;
        height: 2rem;
      }
    }

    .message {
      flex-shrink: 0;
      width: 100%;
      font: ${({ theme }) => theme.fontType.t12};
      color: ${({ theme }) => theme.color.red};
    }
  }
`;
