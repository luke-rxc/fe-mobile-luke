import styled, { keyframes } from 'styled-components';
import { LiveContentsType } from '@constants/live';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { PrizmOnlyTag } from '@pui/prizmOnlyTag';
import { LiveAuctionItemModel, LiveDealGoodsItems } from '../models';
import { LiveGoodsImages } from './LiveGoodsImages';
import { LiveGoodsSlideImages } from './LiveGoodsSlideImages';
import { DealGoodsDescription } from './DealGoodsDescription';
import { CouponIndicator } from './CouponIndicator';

interface Props {
  children: ReactNode;
  items: LiveDealGoodsItems;
  openningAuctionItem?: LiveAuctionItemModel;
  isLiveViewMode: boolean;
}

/**
 * DealMultiGoods
 *
 * 일반상품/경매상품 혼합형태
 */
export const DealMultiGoods = ({ children, items, openningAuctionItem, isLiveViewMode }: Props) => {
  if (!items.STANDARD || !items.AUCTION) {
    return null;
  }

  const standardDealGoods = items.STANDARD;
  const auctionDealGoods = items.AUCTION;

  const className = classNames({
    'view-standard': !openningAuctionItem,
    'view-auction': openningAuctionItem,
  });

  return (
    <GoodsCardStyled className={className} $liveMode={isLiveViewMode}>
      <GoodsCouponWrapperStyled>
        <CouponIndicator className={className}>
          <GoodsImageWrapperStyled className="thumbnail">
            <LiveGoodsImagesStyled
              className="standard"
              images={standardDealGoods.images}
              stopSlide={!!openningAuctionItem || standardDealGoods.images.length <= 1}
            />
            <LiveGoodsAuctionImagesStyled className="auction" images={auctionDealGoods.images} />
            {!openningAuctionItem && standardDealGoods.benefits?.isPrizmOnly && (
              <PrizmOnlyTag size="small" tagType="prizmOnly" />
            )}
            {!openningAuctionItem && standardDealGoods.benefits?.isLiveOnly && (
              <PrizmOnlyTag size="small" tagType="liveOnly" />
            )}
          </GoodsImageWrapperStyled>
        </CouponIndicator>
      </GoodsCouponWrapperStyled>
      <InfoWrapperStyled>
        <InfoWrapperItemStyled className="description">
          <DealGoodsDescription item={standardDealGoods} contentsType={LiveContentsType.STANDARD} />
          <DealGoodsDescription item={auctionDealGoods} contentsType={LiveContentsType.AUCTION}>
            {children}
          </DealGoodsDescription>
        </InfoWrapperItemStyled>
      </InfoWrapperStyled>
    </GoodsCardStyled>
  );
};

const showStandard = keyframes`
  from { margin-top: -6.4rem }
  to { margin-top: 0 }
`;

const showAuction = keyframes`
  from { margin-top: 0 }
  to { margin-top: -6.4rem }
`;

const slidingStandardTransition = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(15deg); z-index: 8;} // 0.5초
  50% { transform: translate3d(4.8rem, 0, 0) rotate(0) scale(0.85); z-index: 8;} // 0.3초
  51% { z-index: 10;} // 0.3초
  100% { transform: translate3d(0, 0, 0) rotate(0); z-index: 10;} // 0.4초
`;

const slidingAuctionTransition = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0); z-index: 10;} // 0.5초
  50% { transform: translate3d(4.8rem, 0, 0) rotate(0) scale(0.85); z-index: 10;} // 0.3초
  51% { z-index: 8; } // 0.3초
  100% { transform: translate3d(0, 0, 0) rotate(15deg) scale(1); z-index: 8;} // 0.4초
`;

export const GoodsCardStyled = styled.div<{ $liveMode: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  user-select: none;

  &.view-standard {
    .description {
      animation: ${({ $liveMode }) => ($liveMode ? '500ms' : '0ms')} linear
        ${({ $liveMode }) => ($liveMode ? '300ms' : '0ms')} normal both ${showStandard};
    }

    .thumbnail {
      > .standard {
        animation: ${({ $liveMode }) => ($liveMode ? '500ms' : '0ms')} linear
          ${({ $liveMode }) => ($liveMode ? '300ms' : '0ms')} normal both ${slidingStandardTransition};
      }
    }
  }

  &.view-auction {
    .description {
      animation: ${({ $liveMode }) => ($liveMode ? '500ms' : '0ms')} linear
        ${({ $liveMode }) => ($liveMode ? '300ms' : '0ms')} normal both ${showAuction};
    }

    .thumbnail {
      > .standard {
        animation: ${({ $liveMode }) => ($liveMode ? '500ms' : '0ms')} linear
          ${({ $liveMode }) => ($liveMode ? '300ms' : '0ms')} normal both ${slidingAuctionTransition};
      }
    }
  }
`;

const GoodsCouponWrapperStyled = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 6.4rem;
  height: 6.4rem;
  margin-right: 1.6rem;
`;

const GoodsImageWrapperStyled = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 6.4rem;
  height: 6.4rem;
  /* margin-right: 1.6rem; */
  border-radius: 0.8rem;
  -webkit-touch-callout: none;

  ${PrizmOnlyTag} {
    ${({ theme }) => theme.mixin.absolute({ t: 6, l: 6 })};
    z-index: 15;
  }
`;

const LiveGoodsImagesStyled = styled(LiveGoodsSlideImages)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transform: translate3d(0, 0, 0) rotate(0);
  will-change: transform, opacity;
`;

const LiveGoodsAuctionImagesStyled = styled(LiveGoodsImages)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
`;

const InfoWrapperStyled = styled.div`
  width: 100%;
  height: 6.4rem;
  overflow: hidden;
`;

const InfoWrapperItemStyled = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  text-align: left;
  word-break: break-all;
  color: ${({ theme }) => theme.light.color.white};
  position: relative;
  flex-direction: column;
`;
