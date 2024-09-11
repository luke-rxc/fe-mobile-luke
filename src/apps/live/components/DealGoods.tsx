import styled from 'styled-components';
import { ReactNode } from 'react';
import { LiveContentsType } from '@constants/live';
import { PrizmOnlyTag } from '@pui/prizmOnlyTag';
import { LiveDealGoods } from '../models';
import { LiveGoodsSlideImages } from './LiveGoodsSlideImages';
import { LiveGoodsImages } from './LiveGoodsImages';
import { DealGoodsDescription } from './DealGoodsDescription';
import { CouponIndicator } from './CouponIndicator';

interface Props {
  children?: ReactNode;
  item: LiveDealGoods;
  contentsType?: LiveContentsType;
}

export const DealGoods = ({ item, children, contentsType }: Props) => {
  const { status, images } = item;

  return (
    <GoodsCardStyled className={status ? 'auction' : ''}>
      <GoodsCouponWrapperStyled>
        <CouponIndicator>
          <GoodsImageWrapperStyled>
            {contentsType === LiveContentsType.STANDARD ? (
              <LiveGoodsSlideImages images={images} stopSlide={images.length <= 1} />
            ) : (
              <LiveGoodsImages images={images} />
            )}
            {item.benefits.isPrizmOnly && <PrizmOnlyTag size="small" tagType="prizmOnly" />}
            {item.benefits.isLiveOnly && <PrizmOnlyTag size="small" tagType="liveOnly" />}
          </GoodsImageWrapperStyled>
        </CouponIndicator>
      </GoodsCouponWrapperStyled>
      <DealGoodsDescription item={item} contentsType={contentsType} children={children} />
    </GoodsCardStyled>
  );
};

export const GoodsCardStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  user-select: none;

  &.auction {
    align-items: flex-start;
  }
`;

const GoodsCouponWrapperStyled = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 6.4rem;
  margin-right: 1.6rem;
`;

const GoodsImageWrapperStyled = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 6.4rem;
  /* margin-right: 1.6rem; */
  border-radius: 0.8rem;
  -webkit-touch-callout: none;

  ${PrizmOnlyTag} {
    ${({ theme }) => theme.mixin.absolute({ t: 6, l: 6 })};
  }
`;
