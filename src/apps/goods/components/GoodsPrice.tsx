import React from 'react';
import styled from 'styled-components';
import {
  GoodsType,
  GoodsNormalStatusType,
  GoodsAuctionStatusType /* GoodsPreOrderStatusType */,
} from '@constants/goods';
import { GoodsAuctionBidder } from './GoodsAuctionBidder';
import { OptionModel, GoodsModel } from '../models';
import { GoodsPriceInfo } from './GoodsPriceInfo';

interface Props {
  defaultOption: OptionModel['defaultOption'];
  status: GoodsModel['status'];
  type: GoodsType;
  auction: GoodsModel['auction'] | null;
  hasPriceList: boolean;
  onPriceListOpen: () => void;
  /** PDP 개선 브랜치와 코드 머지 시 제거 */
  isPrizmOnly?: boolean;
  benefitLabel?: string;
}

interface PriceDisplayParams {
  type: Props['type'];
  status: Props['status'];
  discountRate: number;
}

interface PriceDisplayProps {
  statusText: string;
  // 판매가 노출 여부
  isVisiblePrice: boolean;
  // 정상가 노출 여부
  isVisibleConsumerInfo: boolean;
}

/**
 * 경매 상태에 따른 Status Text 설정
 */
const getAuctionPriceStatusText = (status: GoodsAuctionStatusType) => {
  if (status === GoodsAuctionStatusType.BID_RUNOUT) {
    return '최종 낙찰가';
  }

  if (status === GoodsAuctionStatusType.BID_WAIT || status === GoodsAuctionStatusType.BID) {
    return '경매 시작가';
  }

  return '';
};

/**
 * 금액에 대한 Display 설정
 */
const getPriceDisplay = ({ type, status, discountRate }: PriceDisplayParams): PriceDisplayProps => {
  const defaultDisplay = {
    statusText: '',
    isVisiblePrice: true,
    isVisibleConsumerInfo: true,
  };

  const isGoodsActive = !(status === GoodsNormalStatusType.UNSOLD || status === GoodsNormalStatusType.CLOSE);
  const isExistDiscountRate = discountRate > 0;

  // 일반 상품
  if (type === GoodsType.NORMAL) {
    return {
      isVisiblePrice: isGoodsActive,
      isVisibleConsumerInfo: isGoodsActive && isExistDiscountRate,
      statusText: '',
    };
  }

  // 프리오더 상품
  if (type === GoodsType.PREORDER) {
    return {
      isVisiblePrice: isGoodsActive,
      isVisibleConsumerInfo: isGoodsActive && isExistDiscountRate,
      statusText: '',
    };
  }

  // 경매 상품
  if (type === GoodsType.AUCTION) {
    return {
      isVisiblePrice: isGoodsActive,
      isVisibleConsumerInfo: false,
      statusText: getAuctionPriceStatusText(status as GoodsAuctionStatusType),
    };
  }

  return defaultDisplay;
};

export const GoodsPrice: React.FC<Props> = ({
  defaultOption,
  type,
  status,
  auction,
  hasPriceList,
  onPriceListOpen: handlePriceListOpen,
}) => {
  const { discountRate: discountOriginalRate, consumerPrice: consumerOriginalPrice } = defaultOption;
  const discountRate = discountOriginalRate ?? 0;
  const consumerPrice = consumerOriginalPrice ?? 0;
  const { statusText, isVisiblePrice, isVisibleConsumerInfo } = getPriceDisplay({
    type,
    status,
    discountRate,
  });

  // 경매 상품인지 여부
  const isGoodsAuction = type === GoodsType.AUCTION;

  // 경매 상품 > 종료(낙찰) 일 경우
  const isGoodsAuctionRunout = isGoodsAuction && status === GoodsAuctionStatusType.BID_RUNOUT;
  const priceText = isGoodsAuctionRunout ? auction?.finalPrice : defaultOption.price;
  const wrapperClassName = isGoodsAuctionRunout ? 'wrapper-auction-bidder-type' : '';

  return (
    <Wrapper className={wrapperClassName}>
      {/* 가격정보, 각 상태에 따라 달리 보여짐 */}
      <GoodsPriceInfo
        discountRate={discountRate}
        consumerPrice={consumerPrice}
        price={priceText ?? 0}
        statusText={statusText}
        isVisiblePrice={isVisiblePrice}
        isVisibleConsumerInfo={isVisibleConsumerInfo}
        isGoodsAuction={isGoodsAuction}
        hasPriceList={hasPriceList}
        onPriceListOpen={handlePriceListOpen}
      />

      {/* 경매 낙찰자 정보 */}
      {isGoodsAuctionRunout && <GoodsAuctionBidder className="goods-auction-bidder" auction={auction} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.s24};

  &.wrapper-auction-bidder-type {
    margin-bottom: ${({ theme }) => theme.spacing.s12};
  }
  & .goods-auction-bidder {
    margin-top: ${({ theme }) => theme.spacing.s12};
  }
`;
