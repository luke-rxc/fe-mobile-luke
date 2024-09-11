import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import classnames from 'classnames';
import { UniversalLinkTypes } from '@constants/link';
import { useTheme, ThemeMode } from '@hooks/useTheme';
import { getAppLink, getWebLink } from '@utils/link';
import { formatToAmount } from '@utils/string';
import { userAgent } from '@utils/ua';
import { Action } from '@pui/action';
import { SVG } from '@pui/svg';
import { Image, ImageProps } from '@pui/image';
import { Conditional } from '@pui/conditional';
import { PrizmOnlyTag, PrizmOnlyTagProps } from '@pui/prizmOnlyTag';
import type { TagType } from '@pui/prizmOnlyTag';
import { GoodsCardWish, GoodsCardWishUpdateProps, GoodsCardWishChangeParams } from './GoodsCardWish';

export type GoodsCardProps = HTMLAttributes<HTMLDivElement> & {
  /** 상품 번호 */
  goodsId: number;
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
  /** 브랜드id */
  brandId?: number;
  /** 브랜드명 */
  brandName?: string;
  /** 브랜드 로고 이미지 */
  brandImageUrl?: string | null;
  /** 라벨 */
  label?: string;
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
  /** 브랜드 로고 svg로 렌더 */
  enableBrandSvg?: boolean;
  /** svg 다크모드 미적용 옵션 */
  noDarkMode?: boolean;
  /** 위시리스트 Props */
  wish?: GoodsCardWishUpdateProps | null;
  /** 품절유무 */
  runOut?: boolean;
  /** Wish 클릭에 대한 이벤트 핸들러 */
  onChangeWish?: (wish: GoodsCardWishChangeParams) => void;
};

const GoodsCardComponent = forwardRef<HTMLDivElement, GoodsCardProps>(
  (
    {
      className,
      goodsId,
      goodsCode,
      image,
      goodsName,
      price,
      discountRate,
      brandId,
      brandName,
      brandImageUrl,
      label,
      prizmOnly,
      prizmOnlyTagOption = {},
      hasCoupon = false,
      tagType = 'none',
      benefitLabel,
      enableBrandSvg = false,
      noDarkMode = false,
      wish,
      runOut,
      onChangeWish: handleChangeWish,
      ...props
    },
    ref,
  ) => {
    const { isApp } = userAgent();
    const { theme } = useTheme();
    const getLink = isApp ? getAppLink : getWebLink;
    const goodsLink = getLink(UniversalLinkTypes.GOODS, { goodsCode });
    const prizmOnlyMotionTrigger = useRef<HTMLDivElement>(null);

    // brandImageUrl나 brandName이 존재하고 label 값이 있는 케이스에서 Slide Transition을 진행
    const isSlide = !!label && (brandImageUrl || brandName);

    // 상품 혜택 라벨 영역 노출여부
    const isBenefitLabel = hasCoupon || benefitLabel;

    const [inView, setInView] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const brandElRef = useRef<HTMLUListElement | null>(null);

    const brandRef = useCallback(
      (element) => {
        if (element && isSlide) {
          /**
           * - 기기 해상도에 따라 소수점으로 렌더시, 슬라이드 애니메이션 포지션을 %로 처리 할경우, 올림된 수치로 렌더하여 정확한 위치로 노출 하지 못하는 이슈
           * - 무한슬라이드 반복시 뷰에 렌더되는 수치로 직접 계산하여 애니메이션 포지션 할당
           */
          const el = element as HTMLUListElement;
          brandElRef.current = el;
          const elWidth = el.getBoundingClientRect().width;
          el.style.setProperty('--slide-end', `${(elWidth * 2 * -1) / 10}rem`);
          el.style.animationName = 'slide';

          observer.current = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
              entries.forEach((entry: IntersectionObserverEntry) => setInView(entry.isIntersecting));
            },
            { rootMargin: `0px 0px 0px 0px`, threshold: 0 },
          );
          observer.current.observe(el);
        }
      },
      [isSlide],
    );

    useEffect(() => {
      if (inView && brandElRef.current && observer.current) {
        // page view에 visible 되었을때 브랜드 로고 모션 재생
        brandElRef.current.style.animationPlayState = 'running';
        observer.current.disconnect();
      }
    }, [inView]);

    return (
      <div ref={ref} className={className} {...props}>
        {wish && <GoodsCardWish {...wish} goodsId={goodsId} goodsCode={goodsCode} onChangeWish={handleChangeWish} />}
        <Action is="a" link={goodsLink}>
          <div ref={prizmOnlyMotionTrigger} className="goods-image">
            <div className="img-box">
              <div className="img-in">
                <Image lazy radius={theme.radius.s8} {...image} />
              </div>
            </div>
            {tagType !== 'none' && (
              <PrizmOnlyTag tagType={tagType} trigger={prizmOnlyMotionTrigger} {...prizmOnlyTagOption} />
            )}
          </div>
          <div
            className={classnames('info', {
              'is-slide': isSlide,
            })}
          >
            <div className="goods-brand">
              <ul className={`brand-container ${isSlide && 'brand-slide'}`} ref={brandRef}>
                <li className="brand-slide-list">
                  <Conditional
                    condition={!!(brandImageUrl || brandName)}
                    trueExp={
                      <GoodsCardBrand
                        brandImageUrl={brandImageUrl}
                        brandName={brandName}
                        enableBrandSvg={enableBrandSvg}
                        noDarkMode={noDarkMode}
                      />
                    }
                    falseExp={<>{!!label && <p className="brand-label">{label}</p>}</>}
                  />
                </li>
                {isSlide && (
                  <>
                    <li className="brand-slide-list">
                      <p className="brand-label">{label}</p>
                    </li>
                    <li className="brand-slide-list">
                      <GoodsCardBrand
                        brandImageUrl={brandImageUrl}
                        brandName={brandName}
                        enableBrandSvg={enableBrandSvg}
                        noDarkMode={noDarkMode}
                      />
                    </li>
                  </>
                )}
              </ul>
            </div>

            <p className="name">{goodsName}</p>
            <div className="goods-price">
              {discountRate > 0 && <span className="rate">{discountRate}%</span>}

              <span className="price">
                {formatToAmount(price)}
                <span className="unit">원</span>
              </span>

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
          </div>
        </Action>
      </div>
    );
  },
);

/**
 * Figma 상품 카드 컴포넌트
 */
export const GoodsCard = styled(GoodsCardComponent)`
  /**
  * Slide Motion
  * 0% 와 100%는 동일한 디자인의 element
  * - 총 4초의 Transition (1cycle 당 2초)
  * -> 초기 모션 -> 4% Delay 후 진행
  * -> 기본 동작 : 4s 기준에서의 0.3s motion -> 7.5%(8% 로 진행)
  * -> 정지 : 50% - 8% = 42%
  */

  @keyframes slide {
    0% {
      transform: translate3d(0%, 0, 0);
    }

    4% {
      transform: translate3d(0%, 0, 0);
    }

    12% {
      transform: translate3d(-100%, 0, 0);
    }

    54% {
      transform: translate3d(-100%, 0, 0);
    }

    62% {
      transform: translate3d(var(--slide-end), 0, 0);
    }

    100% {
      transform: translate3d(var(--slide-end), 0, 0);
    }
  }
  position: relative;
  ${GoodsCardWish} {
    position: absolute !important;
    right: 0.15rem;
    /* info height 14.4rem + 0.2rem */
    bottom: 14.6rem;
    z-index: 1;
  }

  ${Action} {
    display: block;
    position: relative;

    /** 상품 이미지 영역 */
    & .goods-image {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      border-radius: ${({ theme }) => theme.radius.r8};
      /* overflow: hidden; */
      background: ${({ theme }) => theme.color.background.bg};
      /** 처음 랜더시 상품이미지 라운드 영역 overflow hidden 안되는 이슈 */
      transform: translate3d(0, 0, 0);

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

      & .img-box {
        overflow: hidden;
        position: relative;
        width: 100%;
        padding-top: 100%;

        & .img-in {
          ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
          ${({ theme }) => theme.mixin.centerItem()};
        }
      }

      ${PrizmOnlyTag} {
        ${({ theme }) => theme.mixin.absolute({ t: 8, l: 8 })};
      }
    }

    &:active {
      & .goods-image:after {
        opacity: 1;
      }
    }

    /** 상품 정보 */
    & .info {
      box-sizing: border-box;
      height: 14.4rem;
      text-align: center;

      &.is-slide {
        & .goods-brand {
          mask-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 1) 2.4rem,
            rgba(255, 255, 255, 1) calc(100% - 2.4rem),
            rgba(255, 255, 255, 0) 100%
          );
        }
      }

      /** 브랜드 */
      & .goods-brand {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 3.2rem;
        margin: 0 auto;

        & .brand-container {
          position: relative;
          height: 100%;

          &.brand-slide {
            animation-duration: 4s;
            animation-play-state: paused;
            animation-timing-function: ease-out;
            animation-delay: 2s;
            animation-iteration-count: infinite;
            animation-direction: normal;
            animation-fill-mode: none;
          }
        }

        & .brand-slide-list {
          position: absolute;
          width: 100%;
          height: 100%;
          ${({ theme }) => theme.mixin.centerItem()};

          :nth-child(2) {
            margin-left: 100%;
          }

          :nth-child(3) {
            margin-left: 200%;
          }

          & .brand-label {
            padding: 1rem 0;
            color: ${({ theme }) => theme.color.text.textTertiary};
            font: ${({ theme }) => theme.fontType.microB};
          }
        }
      }

      /** 상품명 */
      & .name {
        display: box;
        overflow: hidden;
        height: 3.6rem;
        margin-bottom: ${({ theme }) => theme.spacing.s8};
        font: ${({ theme }) => theme.fontType.medium};
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 18)};

        &:first-child {
          margin-top: 0;
        }
      }

      /** 가격 */
      & .goods-price {
        font: ${({ theme }) => theme.fontType.mediumB};

        & .rate {
          margin-right: ${({ theme }) => theme.spacing.s4};
          color: ${({ theme }) => theme.color.semantic.sale};
        }

        & .prizm-only-legacy {
          display: block;
          margin-top: 0.8rem;
          color: ${({ theme }) => theme.color.gray50};
          font: ${({ theme }) => theme.fontType.t12};
          line-height: 1.432rem;
        }

        & .benefit-label {
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
    }
  }
`;

const GoodsCardBrand: React.VFC<
  Pick<GoodsCardProps, 'brandImageUrl' | 'brandName'> & {
    enableBrandSvg: boolean;
    noDarkMode: boolean;
  }
> = ({ brandImageUrl, brandName, enableBrandSvg, noDarkMode = false }) => {
  const { mode } = useTheme();

  if (brandImageUrl) {
    // 브랜드로고 다크모드 여부에 따라 img/svg분기처리
    return (mode === ThemeMode.DARK && !noDarkMode) || enableBrandSvg ? (
      <BrandSvg src={brandImageUrl} className="brand-svg" />
    ) : (
      <BrandImage src={brandImageUrl} noFadeIn className="brand-svg" />
    );
  }

  return (
    <BrandNameWrapper className="brand-name">
      <span className="brand-text">{brandName}</span>
    </BrandNameWrapper>
  );
};

const BrandLogoCss = css`
  width: auto;
  max-width: 6.4rem;
  height: 1.6rem;
  margin: 0.8rem 0;
`;

const BrandSvg = styled(SVG)`
  ${BrandLogoCss}
`;

const BrandImage = styled(Image)`
  ${BrandLogoCss}
  background: none;

  img {
    object-fit: contain;
  }
`;

const BrandNameWrapper = styled.p`
  color: ${({ theme }) => theme.color.text.textTertiary};
  font: ${({ theme }) => theme.fontType.miniB};

  & .brand-text {
    display: block;
    width: 12rem;
    margin: 0 auto;
    ${({ theme }) => theme.mixin.ellipsis()};
  }
`;
