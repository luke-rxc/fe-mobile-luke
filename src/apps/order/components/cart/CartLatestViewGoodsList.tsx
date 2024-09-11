import styled from 'styled-components';
import { useCallback } from 'react';
import { TitleSection } from '@pui/titleSection';
import { GoodsList } from '@pui/goodsList';
import { GoodsCardProps } from '@pui/goodsCard';
import { LatestViewGoodsModel } from '../../models/LatestViewGoodsModel';

export interface CartLatestViewGoodsListProps {
  latestViewGoodsList: LatestViewGoodsModel[];
  className?: string;
  onGoodsClick: (goodsId: number, goodsName: string) => void;
}

export const CartLatestViewGoodsList = styled(
  ({ latestViewGoodsList, className = '', onGoodsClick }: CartLatestViewGoodsListProps) => {
    const handleGoodsClick = useCallback(
      (goods: GoodsCardProps) => {
        const { goodsId, goodsName } = goods;
        onGoodsClick(goodsId, goodsName);
      },
      [onGoodsClick],
    );

    if (latestViewGoodsList.length === 0) {
      return null;
    }

    return (
      <div className={className}>
        <TitleSection className="latest-goods-list-title" title="최근 본 상품" />
        <GoodsList className="latest-goods-list" goodsList={latestViewGoodsList} onListClick={handleGoodsClick} />
      </div>
    );
  },
)`
  padding-bottom: 0.8rem;
  background: ${({ theme }) => theme.color.surface};

  .latest-goods-list-title {
    .side {
      font-size: 0;
      line-height: 0;
    }
  }

  .latest-goods-list {
    .imgbx {
      background-color: ${({ theme }) => theme.color.bg};
      border: ${({ theme }) => `1px solid ${theme.color.gray3}`};
    }

    .brand img {
      width: auto;
    }
  }
`;
