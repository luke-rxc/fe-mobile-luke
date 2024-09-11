import React, { forwardRef } from 'react';
import styled from 'styled-components';
import compact from 'lodash/compact';
import { toKRW } from '@utils/toKRW';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Image, ImageProps } from '@pui/image';

export interface GoodsCardMiniProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'is' | 'href'> {
  /** 상품 번호 */
  goodsId: number;
  /** 상품 코드 */
  goodsCode: string;
  /** 상품명  */
  goodsName: string;
  /** 판매가 */
  price: number;
  /** 할인율 */
  discountRate: number;
  /** image props */
  image: Omit<ImageProps, 'radius' | 'width' | 'height' | 'lazy' | 'resizeWidth'>;
  /** 상품 정보 영역 숨김 */
  hideInfo?: boolean;
}

const GoodsCardMiniComponent = forwardRef<HTMLAnchorElement, GoodsCardMiniProps>(
  ({ goodsId, goodsCode, goodsName, price, discountRate, image, hideInfo, ...props }, ref) => {
    const { getLink } = useLink();
    const link = getLink(UniversalLinkTypes.GOODS, { goodsCode });
    const goodsPrice = compact([discountRate, toKRW(price)]).join('% ');

    return (
      <Action is="a" ref={ref} link={link} aria-label={`${goodsName} ${goodsPrice}`} {...props}>
        <span className="goods-thumb">
          <Image lazy resizeWidth={192} {...image} />
        </span>
        {!hideInfo && (
          <span className="goods-info">
            <span className="name">{goodsName}</span>
            <span className="price">{goodsPrice}</span>
          </span>
        )}
      </Action>
    );
  },
);

/**
 * Figma GoodsCardMini 컴포넌트
 */
export const GoodsCardMini = styled(GoodsCardMiniComponent)`
  display: inline-block;
  width: 8.8rem;

  &:active {
    .goods-thumb:after {
      opacity: 1;
    }
  }

  .goods-thumb {
    display: block;
    position: relative;
    width: 100%;
    height: 8.8rem;
    border-radius: ${({ theme }) => theme.radius.r6};

    &:after {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.states.pressedMedia};
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: inherit;
      content: '';
    }

    ${Image} {
      border-radius: inherit;
    }
  }

  .goods-info {
    display: block;
    height: 4.8rem;
    margin-top: ${({ theme }) => theme.spacing.s8};
    color: ${({ theme }) => theme.color.text.textTertiary};

    .name {
      display: block;
      width: 100%;
      ${({ theme }) => theme.mixin.ellipsis()};
      font: ${({ theme }) => theme.fontType.micro};
    }

    .price {
      display: block;
      margin-top: ${({ theme }) => theme.spacing.s2};
      font-style: normal;
      font: ${({ theme }) => theme.fontType.microB};
    }
  }
`;
