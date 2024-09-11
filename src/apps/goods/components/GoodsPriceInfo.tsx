import type { VFC } from 'react';
import styled from 'styled-components';
import { formatToAmount } from '@utils/string';
import { Button } from '@pui/button';
import { GoodsPageName } from '../constants';

type GoodsPriceInfoProps = {
  className?: string;
  statusText?: string; // 상태 텍스트, 할인율 영역에 들어감 (경매상태일때 사용)
  discountRate?: number; // 할인율
  price: number; // 판매가
  consumerPrice: number; // 정상가
  unit?: string; // 단위
  isVisiblePrice?: boolean; // 할인율이 있을때 정가 표시 여부
  isVisibleConsumerInfo?: boolean; // 할인율 & 상태 텍스트, 판매가 표시 여부
  isGoodsAuction: boolean; // 경매 상품 여부
  hasPriceList: boolean; // 요금표 존재 여부
  onPriceListOpen?: () => void; // 요금표 모달 오픈
};

const getRateAreaText = (statusText: string, discountRate: number) => {
  // statusText(경매상태)가 있는 경우에는 해당 경우에 맞는 Text를 할인율 대신 보여줌
  if (statusText) {
    return statusText;
  }

  // 할인율이 0이상이면 노출
  if (discountRate > 0) {
    return `${discountRate}%`;
  }

  return null;
};

export const GoodsPriceInfo: VFC<GoodsPriceInfoProps> = (props) => {
  const {
    className = '',
    statusText = '',
    discountRate = 0,
    price = 0,
    consumerPrice = 0,
    unit = '원',
    isVisiblePrice = true,
    isVisibleConsumerInfo = true,
    isGoodsAuction = false,
    hasPriceList = false,
    onPriceListOpen: handlePriceListOpen,
  } = props;

  const rateAreaClassName = `rate ${statusText ? 'status' : ''}`;
  const rateAreaText = getRateAreaText(statusText, discountRate);

  return (
    <PriceStyled className={`${className} ${isGoodsAuction ? 'goods-auction-type' : ''}`}>
      {isVisiblePrice && (
        <div className="price-wrapper">
          <div>
            {/* 할인율 & 경매상품인 경우에는 경매상태 노출 */}
            {rateAreaText && <span className={rateAreaClassName}>{rateAreaText}</span>}

            {/* 판매가 노출 */}
            <span className="price">
              {formatToAmount(price)}
              <span className="unit">{unit}</span>
            </span>

            {/* 정상가 노출 */}
            {isVisibleConsumerInfo && (
              <p className="consumer">
                {formatToAmount(consumerPrice)}
                <span className="unit">{unit}</span>
              </p>
            )}
          </div>

          {hasPriceList && (
            <Button size="medium" variant="tertiaryline" onClick={handlePriceListOpen}>
              {GoodsPageName.PRICE_LIST}
            </Button>
          )}
        </div>
      )}
    </PriceStyled>
  );
};

const PriceStyled = styled.div`
  color: ${({ theme }) => theme.color.text.textPrimary};
  text-align: 'left';

  .price-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.s16};
  }

  .rate {
    display: inline-block;
    margin-right: 0.4rem;
    color: ${({ theme }) => theme.color.semantic.sale};
    font: ${({ theme }) => theme.fontType.largeB};
    line-height: 2.1rem;

    &.status {
      font: ${({ theme }) => theme.fontType.mediumB};
    }
  }

  .price {
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.largeB};
    line-height: 2.1rem;
  }

  ${Button} {
    &.is-press:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }

  .consumer {
    font: ${({ theme }) => theme.fontType.mini};
    line-height: 1.4rem;
    text-decoration: line-through;
    color: ${({ theme }) => theme.color.text.textTertiary};
    margin-top: ${({ theme }) => theme.spacing.s4};
  }

  .benefit-label {
    display: block;
    margin-top: 2.4rem;
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.text.textTertiary};
    line-height: 1.432rem;
  }

  /* 경매상태일때 */
  &.goods-auction-type {
    & .rate {
      margin-right: 0.8rem;
    }
  }
`;
