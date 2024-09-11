import { forwardRef, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes } from '@constants/link';
import { getAppLink, getWebLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { useTheme } from '@hooks/useTheme';
import { formatToAmount } from '@utils/string';
import { Action } from '@pui/action';
import { Image, ImageProps } from '@pui/image';
import { PrizmOnlyTag, PrizmOnlyTagProps } from '@pui/prizmOnlyTag';
import type { TagType } from '@pui/prizmOnlyTag';

export type GoodsListItemProps = HTMLAttributes<HTMLDivElement> & {
  /** 상품 코드 */
  goodsCode: string;
  /** 상품 이미지 */
  image: Omit<ImageProps, 'radius' | 'width' | 'height'>;
  /** 상품명  */
  goodsName: string;
  /** 판매가 */
  price: number;
  /** 할인율 */
  discountRate: number;
  /** 브랜드명 */
  brandName: string;
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
  /** */
  runOut?: boolean;
};

const GoodsListItemComponent = forwardRef<HTMLDivElement, GoodsListItemProps>(
  (
    {
      className,
      goodsCode,
      image,
      goodsName,
      price,
      discountRate,
      brandName,
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
    const { theme } = useTheme();
    const { isApp } = userAgent();
    const getLink = isApp ? getAppLink : getWebLink;
    const goodsLink = getLink(UniversalLinkTypes.GOODS, { goodsCode });
    // 상품 혜택 라벨 영역 노출여부
    const isBenefitLabel = hasCoupon || benefitLabel;
    const prizmOnlyMotionTrigger = useRef<HTMLDivElement>(null);

    return (
      <div ref={ref} className={className} {...props}>
        <Action is="a" link={goodsLink}>
          <div ref={prizmOnlyMotionTrigger} className="goods-image">
            <div className="img-box">
              <div className="img-in">
                <Image radius={theme.radius.s8} {...image} />
              </div>
            </div>
            {tagType !== 'none' && (
              <PrizmOnlyTag tagType={tagType} size="small" trigger={prizmOnlyMotionTrigger} {...prizmOnlyTagOption} />
            )}
          </div>
          <div className="info">
            <p className="goods-brand">{brandName}</p>
            <p className="goods-name">{goodsName}</p>
            <p className="goods-price">
              {discountRate > 0 && <span className="rate">{discountRate}%</span>}
              <span className="price">
                {formatToAmount(price)}
                <span className="unit">원</span>
              </span>
            </p>

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
          </div>
        </Action>
      </div>
    );
  },
);

/**
 * Figma Deal 상품 컴포넌트
 */
export const GoodsListItem = styled(GoodsListItemComponent)`
  & ${Action} {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};

    & .goods-image {
      position: relative;
      flex-shrink: 0;
      width: 6.4rem;
      margin-right: ${({ theme }) => theme.spacing.s12};

      & .img-box {
        overflow: hidden;
        position: relative;
        width: 100%;
        padding-top: 100%;

        & .img-in {
          display: flex;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          align-items: center;
          justify-content: center;
        }
      }
      ${PrizmOnlyTag} {
        ${({ theme }) => theme.mixin.absolute({ t: 6, l: 6 })};
      }
    }

    & .info {
      font: ${({ theme }) => theme.fontType.mini};

      /** 브랜드명 */
      & .goods-brand {
        display: box;
        overflow: hidden;
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.miniB};
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      /** 상품명 */
      & .goods-name {
        display: box;
        overflow: hidden;
        margin-top: ${({ theme }) => theme.spacing.s2};
        color: ${({ theme }) => theme.color.text.textPrimary};
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      /** 가격 */
      & .goods-price {
        margin-top: ${({ theme }) => theme.spacing.s4};
        color: ${({ theme }) => theme.color.text.textPrimary};
        font: ${({ theme }) => theme.fontType.miniB};

        & .rate {
          margin-right: ${({ theme }) => theme.spacing.s4};
          color: ${({ theme }) => theme.color.semantic.sale};
        }
      }

      /** 프리즘온리 상품 */
      & .prizm-only-legacy {
        margin-top: ${({ theme }) => theme.spacing.s4};
        color: ${({ theme }) => theme.color.text.textTertiary};
      }

      /** 상품 혜택  */
      & .benefit-label {
        display: block;
        margin-top: ${({ theme }) => theme.spacing.s4};
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.micro};

        .coupon {
          &:not(:first-child) {
            margin-left: ${({ theme }) => theme.spacing.s8};
          }
        }
      }
    }

    &:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }
`;
