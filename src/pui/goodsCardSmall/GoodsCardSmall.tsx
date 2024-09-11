import { forwardRef, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { Image, ImageProps } from '@pui/image';
import { PrizmOnlyTag, PrizmOnlyTagProps } from '@pui/prizmOnlyTag';
import type { TagType } from '@pui/prizmOnlyTag';
import { useLink } from '@hooks/useLink';
import { UniversalLinkTypes } from '@constants/link/universalLink';
import { formatToAmount } from '@utils/string';

export interface GoodsCardSmallProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'is' | 'href'> {
  /** 상품 코드 */
  goodsCode: string;
  /** 브랜드명 */
  brandName: string;
  /** 상품명 */
  goodsName: string;
  /** 판매가 */
  price: number;
  /** 할인율 */
  discountRate?: number;
  /** @deprecated Prizm only 여부 */
  prizmOnly?: boolean;
  /** 프리즘 온리 태그 UI 옵션 */
  prizmOnlyTagOption?: Partial<PrizmOnlyTagProps>;
  /** 상품에 쿠폰 포함 여부 */
  hasCoupon?: boolean;
  /** 혜택 태그 타입 */
  tagType?: TagType;
  /** 혜택 라벨 여부 */
  benefitLabel?: string;
  /** image props */
  image: Omit<ImageProps, 'radius' | 'width' | 'height' | 'lazy' | 'resizeWidth'>;
  /** 품절 여부 */
  runOut?: boolean;
}

/**
 * 상품 카드 - Small
 * @param GoodsCardSmallProps
 * @returns
 */
export const GoodsCardSmallComponent = forwardRef<HTMLAnchorElement, GoodsCardSmallProps>(
  (
    {
      goodsCode,
      brandName,
      goodsName,
      price,
      image,
      discountRate = 0,
      prizmOnly,
      prizmOnlyTagOption = {},
      hasCoupon = false,
      tagType = 'none',
      benefitLabel,
      runOut,
      ...props
    },
    ref,
  ) => {
    const { getLink } = useLink();
    const link = getLink(UniversalLinkTypes.GOODS, { goodsCode });
    const goodsPrice = useMemo(() => formatToAmount(price), [price]);
    const prizmOnlyMotionTrigger = useRef<HTMLSpanElement>(null);
    // 상품 혜택 라벨 영역 노출여부
    const isBenefitLabel = hasCoupon || benefitLabel;

    return (
      <Action is="a" ref={ref} link={link} aria-label={`${goodsName} ${goodsPrice}`} {...props}>
        <span ref={prizmOnlyMotionTrigger} className="goods-thumb">
          <Image lazy resizeWidth={512} {...image} />
          {tagType !== 'none' && (
            <PrizmOnlyTag tagType={tagType} trigger={prizmOnlyMotionTrigger} {...prizmOnlyTagOption} />
          )}
        </span>
        <span className="goods-info">
          <span className="brand">{brandName}</span>
          <span className="goods">{goodsName}</span>
          <span className="price">
            {discountRate > 0 && <span className="rate">{discountRate}%</span>}

            <span className="goods-price">{goodsPrice}원</span>

            {/* 품절인 경우 */}
            {runOut && (
              <span className="benefit-label">
                <span>품절</span>
              </span>
            )}

            {/* 품절이 아니면서 혜택이 있는 경우 */}
            {!runOut && isBenefitLabel && (
              <span className="benefit-label">
                {benefitLabel && <span>{benefitLabel}</span>}
                {hasCoupon && <span className="coupon">쿠폰</span>}
              </span>
            )}
          </span>
        </span>
      </Action>
    );
  },
);

/**
 * Figma 상품 카드 Small 컴포넌트
 */
export const GoodsCardSmall = styled(GoodsCardSmallComponent)`
  display: inline-block;
  width: calc((100vw - 8rem) / 2);
  max-width: 16.7rem;

  .goods-thumb {
    display: block;
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: ${({ theme }) => theme.radius.r8};

    ${PrizmOnlyTag} {
      ${({ theme }) => theme.mixin.absolute({ t: 8, l: 8 })};
    }

    &:after {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: ${({ theme }) => theme.color.states.pressedMedia};
      opacity: 0;
      transition: opacity 0.2s;
      content: '';
    }

    &:active {
      &.goods-thumb:after {
        opacity: 1;
      }
    }

    ${Image} {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0, r: 0, b: 0 })};
      border-radius: inherit;
    }
  }

  .goods-info {
    display: block;
    box-sizing: border-box;
    height: 12.8rem;
    padding: 1.2rem 0 2.6rem 0;
    line-height: 0;

    .brand {
      display: block;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.miniB};
      ${({ theme }) => theme.mixin.ellipsis()};
    }

    .goods {
      display: block;
      height: 3.6rem;
      margin: 0.4rem 0;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.small};
      ${({ theme }) => theme.mixin.multilineEllipsis(2, 18)};
    }

    .price {
      display: block;
      font: ${({ theme }) => theme.fontType.smallB};

      .rate {
        margin-right: ${({ theme }) => theme.spacing.s4};
        color: ${({ theme }) => theme.color.semantic.sale};
      }

      .benefit-label {
        display: block;
        margin-top: ${({ theme }) => theme.spacing.s8};
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.micro};

        .coupon {
          &:not(:first-child) {
            margin-left: ${({ theme }) => theme.spacing.s8};
          }
        }
      }
    }

    .prizm-only-legacy {
      display: block;
      margin-top: 0.4rem;
      color: ${({ theme }) => theme.color.gray50};
      font: ${({ theme }) => theme.fontType.t12};
    }
  }
`;
