import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { GoodsCard, GoodsCardProps, GoodsCardWishChangeParams } from '@pui/goodsCard';
import { InfiniteScroller, InfiniteScrollerProps } from '@pui/InfiniteScroller';

export type GoodsListProps = HTMLAttributes<HTMLDivElement> &
  InfiniteScrollerProps & {
    /** 상품 리스트 */
    goodsList: GoodsCardProps[];
    /** 상품 클릭에 대한 이벤트 핸들러 */
    onListClick?: (goods: GoodsCardProps, index: number) => void;
    /** Wish 클릭에 대한 이벤트 핸들러 */
    onChangeWish?: (wish: GoodsCardWishChangeParams) => void;
  };

const GoodsListComponent = forwardRef<HTMLDivElement, GoodsListProps>(
  (
    {
      className,
      goodsList = [],
      disabled = false,
      infiniteOptions,
      loading,
      onScrolled,
      onListClick,
      onChangeWish: handleChangeWish,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={className} {...props}>
        <InfiniteScroller
          disabled={disabled}
          infiniteOptions={infiniteOptions}
          loading={loading}
          onScrolled={onScrolled}
        >
          {goodsList.length > 0 && (
            <ul className="goods-list">
              {goodsList.map((goods, index) => (
                <li key={goods.goodsCode} className="goods-item">
                  <div className="inner">
                    <GoodsCard {...goods} onClick={() => onListClick?.(goods, index)} onChangeWish={handleChangeWish} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </InfiniteScroller>
      </div>
    );
  },
);

/**
 * 상품 2단 모듈을 처리 하기 위한 디자인 및 기능(infinite scroll) 공통 컴포넌트
 */
export const GoodsList = styled(GoodsListComponent)`
  .goods-list {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - ${({ theme }) => theme.spacing.s8}));
    gap: ${({ theme }) => theme.spacing.s16};
    padding: 0 ${({ theme }) => theme.spacing.s24};
  }
`;
