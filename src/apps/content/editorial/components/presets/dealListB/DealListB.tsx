import { useEffect, forwardRef, useState, useRef, useImperativeHandle, useCallback } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { GoodsType } from '@constants/goods';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIntersection } from '@hooks/useIntersection';
import { SwiperContainerProps, SwiperSlide, SwiperContainer } from '@pui/swiper';
import { GoodsCard, GoodsCardProps } from '@pui/goodsCard';
import { getImageLink } from '@utils/link';
import { MediaType, AppearType } from '../../../constants';
import type { DealListBProps, DealListBComponentRefModel, DealListBGoodsModel } from '../../../models';
import { useLogService } from '../../../services';
import { getSwiperCssModeAble } from '../../../utils';
import { ImageStyled as ImageComponent } from '../Image';
import { Title, TitleProps } from '../Title';

const DealListBComponent = forwardRef<DealListBComponentRefModel, DealListBProps>(
  (
    {
      className,
      contentInfo,
      goodsList,
      align,
      textEffect = true,
      title,
      subTitle,
      description,
      backgroundMedia,
      goodsColor,
      visible,
    },
    ref,
  ) => {
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const [titleInfo] = useState<TitleProps>({
      title,
      subTitle,
      description,
      align,
      transform: textEffect ? AppearType.FROM_BOTTOM : AppearType.NONE,
    });

    const [dealList] = useState<GoodsCardProps[]>(
      goodsList.map((item: DealListBGoodsModel): GoodsCardProps => {
        return omit(item, ['type', 'status']);
      }),
    );

    const { logPresetDealInit, logPresetDealGoodsTab, logPresetDealGoodsInit } = useLogService();
    const { contentId, contentName, contentType, contentIndex } = contentInfo;
    const handleGoodsTab = useCallback(
      (goods: GoodsCardProps, index: number) => {
        const originGoods = goodsList.find((deal: DealListBGoodsModel) => deal.goodsId === goods.goodsId);

        const { goodsId, goodsName } = goods;
        logPresetDealGoodsTab({
          contentId,
          contentName,
          contentType,
          contentIndex,
          goodsId,
          goodsName,
          goodsType: originGoods?.type as GoodsType,
          goodsStatus: goods?.label ?? originGoods?.status ?? '',
          index,
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [contentId, contentName, contentType, goodsList, logPresetDealGoodsTab],
    );

    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);

    const { isIOS, osVersion } = useDeviceDetect();
    const isSwiperCssModeAble = getSwiperCssModeAble(isIOS, osVersion?.major ?? null);

    const carouselOption: SwiperContainerProps = {
      loop: false,
      slidesPerView: 'auto',
      cssMode: isSwiperCssModeAble,
      centeredSlides: true,
    };

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));
    // 뷰포트 교차
    useEffect(() => {
      if (containerRef.current) {
        subscribe(containerRef.current, { threshold: 0 });
      }
    }, [containerRef, subscribe]);
    useEffect(() => {
      if (!visible) return;
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetDealInit(contentInfo);
        goodsList.forEach((goods, index) => {
          logPresetDealGoodsInit({
            contentId,
            contentName,
            contentType,
            goodsId: goods.goodsId,
            goodsName: goods.goodsName,
            goodsType: goods.type as GoodsType,
            goodsStatus: goods?.label ?? goods?.status ?? '',
            index,
          });
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div className="inner">
            <div className="sticky-wrap">
              {backgroundMedia.path && (
                <div className="bg">
                  {!errorMedia && (
                    <>
                      {backgroundMedia.type === MediaType.IMAGE && (
                        <ImageComponent
                          src={getImageLink(backgroundMedia.path)}
                          alt=""
                          blurHash={backgroundMedia.blurHash}
                          lazy
                          onError={() => setErrorMedia(true)}
                        />
                      )}
                    </>
                  )}
                  {errorMedia && <div className="overlay-error" />}
                </div>
              )}
            </div>
            <div className="contents">
              {(title?.text || subTitle?.text || description?.text) && (
                <Title className="title-wrapper" {...titleInfo} />
              )}
              {goodsList.length > 0 && (
                <div className="goods-wrapper">
                  <CarouselStyled
                    {...carouselOption}
                    className={`${isSwiperCssModeAble ? 'css-mode' : 'swiper-mode'} ${
                      dealList.length === 1 ? 'center' : ''
                    }`}
                  >
                    {dealList.map((goods, index: number) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <SwiperSlide key={`carousel-${index}`}>
                        <div className="inner-wrap">
                          <div
                            className={classNames('inner', {
                              'is-white': goodsColor === '#ffffff',
                              // 화이트/블랙외 기존에 텍스트 컬러값 설정된 케이스
                              'is-color': goodsColor !== '#ffffff' && goodsColor !== '#000000',
                            })}
                          >
                            <GoodsCard {...goods} onClick={() => handleGoodsTab(goods, index)} />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </CarouselStyled>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 상품전시 B 컴포넌트
 */
export const DealListB = styled(DealListBComponent)`
  > .inner {
    position: relative;
    padding: 4.8rem 0 1.6rem;
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      .video,
      img {
        width: 100%;
        height: 100%;
      }
      .overlay-error {
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.gray8};
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:after {
        ${({ isOverlay }) => {
          if (isOverlay) {
            return css`
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              display: block;
              background: ${({ theme }) => theme.color.gray50};
              content: '';
            `;
          }
          return null;
        }}
      }
    }
    .contents {
      position: relative;
      text-align: ${({ align }) => align};
    }
    .title-wrapper {
      padding: 0 2.4rem;
    }
    .title-wrapper + .goods-wrapper {
      margin-top: 4.8rem;
    }

    & .goods-wrapper {
      & .inner.is-white {
        color: ${({ theme }) => theme.color.whiteLight};
        & .goods-brand {
          & .brand-name {
            color: ${({ theme }) => theme.color.whiteLight};
          }
          & .brand-label {
            color: ${({ theme }) => theme.color.whiteLight};
          }
          & svg * {
            fill: ${({ theme }) => theme.color.whiteLight}!important;
            filter: none !important;
          }
        }

        & .goods-price {
          & .prizm-only {
            color: ${({ theme }) => theme.color.whiteLight};
          }
          & .benefit-label {
            color: ${({ theme }) => theme.color.gray50Dark};
          }
        }
      }
      // 기존 텍스트 컬러값 설정된 케이스
      & .inner.is-color {
        color: ${({ goodsColor }) => goodsColor};
        & .goods-brand {
          & .brand-name {
            color: ${({ goodsColor }) => goodsColor};
          }
          & .brand-label {
            color: ${({ goodsColor }) => goodsColor};
          }
        }

        & .goods-price {
          & .rate {
            color: ${({ goodsColor }) => goodsColor};
          }
        }
      }
    }
  }
`;

const CarouselStyled = styled(SwiperContainer)<SwiperContainerProps>`
  .swiper-slide {
    & > .inner {
      position: relative;
      display: block;
      width: 100%;
    }
  }

  img {
    width: 100%;
    vertical-align: middle;
  }

  &.css-mode {
    & .swiper-slide {
      scroll-snap-stop: always !important;
      scroll-snap-align: center;
      width: 28rem;
      & > .inner-wrap {
        padding-left: 0.8rem;
        padding-right: 0.8rem;
      }
    }
    &.center {
      // 1개인 경우 센터 정렬
      & .swiper-wrapper {
        display: flex;
        justify-content: center;
      }
      & .swiper-slide {
        width: 28rem;
        & > .inner-wrap {
          padding-left: 0.8rem;
          padding-right: 0.8rem;
        }
      }
    }
  }

  &.swiper-mode {
    & .swiper-slide {
      width: 28rem;
      & > .inner-wrap {
        padding-left: 0.8rem;
        padding-right: 0.8rem;
      }
    }
    &.center {
      // 1개인 경우 센터 정렬
      & .swiper-slide {
        width: 26.4rem;
        & > .inner-wrap {
          padding-left: 0rem;
          padding-right: 0rem;
        }
      }
    }
  }
`;
