import { forwardRef, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GoodsCard, GoodsCardProps } from '@pui/goodsCard';
import { Image } from '@pui/image';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { getImageLink } from '@utils/link';
import { MediaType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  DealListBDisplayModel,
  GoodsModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService, usePresetGoodsService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getSwiperCssModeAble } from '../../../utils';
import { Title, TitleProps } from '../Title';

const DealListBComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, goodsList } = preset;
  const displayValues = JSON.parse(contents) as DealListBDisplayModel;
  const { align, textEffect = true, title, subTitle, description, backgroundMedia, goodsColor } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetDealInit, logPresetDealGoodsTab, logPresetDealGoodsInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const { goodsCardItems } = usePresetGoodsService({ goodsList, goodsColor });
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const titleSectionValue: TitleProps = {
    mainTitle: title,
    subTitle,
    description,
    align,
    textEffect,
  };

  const handleGoodsTab = (goods: GoodsCardProps, index: number) => {
    const originGoods = goodsList.find((item: GoodsModel) => item.goods.id === goods.goodsId);

    if (!originGoods?.goods) return;
    const { id, name, type, status, label } = originGoods.goods;
    logPresetDealGoodsTab(contentLogInfo, {
      goodsId: id,
      goodsName: name,
      goodsType: type,
      goodsStatus: label || status || '',
      index,
    });
  };
  const { isIOS, osVersion } = useDeviceDetect();
  const isSwiperCssModeAble = getSwiperCssModeAble(isIOS, osVersion?.major ?? null);
  const carouselOption: SwiperContainerProps = {
    loop: false,
    slidesPerView: 'auto',
    cssMode: isSwiperCssModeAble,
    centeredSlides: true,
  };

  useEffect(() => {
    if (inView) {
      logPresetDealInit(contentLogInfo);
      goodsList.forEach((item, index) => {
        const { id, name, type, label, status } = item.goods;
        logPresetDealGoodsInit(contentLogInfo, {
          goodsId: id,
          goodsName: name,
          goodsType: type,
          goodsStatus: label || status || '',
          index,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <DealListBContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div className="inner">
            <div className="bg">
              {!errorMedia && (
                <>
                  {backgroundMedia.type === MediaType.IMAGE && (
                    <Image
                      src={getImageLink(backgroundMedia.path)}
                      blurHash={backgroundMedia.blurHash}
                      lazy
                      onError={() => setErrorMedia(true)}
                    />
                  )}
                </>
              )}
              {errorMedia && <div className="overlay-error" />}
            </div>
            <div className="contents">
              {(title?.text || subTitle?.text || description?.text) && (
                <Title className="title-wrapper" {...titleSectionValue} />
              )}
              {goodsCardItems.length > 0 && (
                <div className="goods-wrapper">
                  <CarouselStyled
                    {...carouselOption}
                    className={`${isSwiperCssModeAble ? 'css-mode' : 'swiper-mode'} ${
                      goodsCardItems.length === 1 ? 'center' : ''
                    }`}
                  >
                    {goodsCardItems.map((goods, index: number) => (
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
        </DealListBContent>
      )}
    </div>
  );
});
const DealListB = styled(DealListBComponent)``;
export default DealListB;

const DealListBContent = styled('div').attrs((props: DealListBDisplayModel) => props)`
  > .inner {
    position: relative;
    padding: 4.8rem 0 1.6rem;
    background-color: ${({ backgroundInfo }) => backgroundInfo?.color || ''};
    ${Image} {
      background: none;
    }

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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.gray8};
      }

      &:after {
        ${({ isOverlay }) => {
          if (isOverlay) {
            return css`
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
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
            filter: none !important;
            fill: ${({ theme }) => theme.color.whiteLight}!important;
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

      /** 기존 텍스트 컬러값 설정된 케이스 */
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

    .title-wrapper {
      padding: 0 2.4rem;
    }

    .title-wrapper + .goods-wrapper {
      margin-top: 4.8rem;
    }
  }
`;
const CarouselStyled = styled(SwiperContainer)<SwiperContainerProps>`
  .swiper-slide {
    & > .inner {
      display: block;
      position: relative;
      width: 100%;
    }
  }

  img {
    width: 100%;
    vertical-align: middle;
  }

  & .swiper-slide {
    width: 28rem;

    & > .inner-wrap {
      padding-right: 0.8rem;
      padding-left: 0.8rem;
    }
  }

  &.css-mode {
    & .swiper-slide {
      scroll-snap-stop: always !important;
      scroll-snap-align: center;
      width: 28rem;

      & > .inner-wrap {
        padding-right: 0.8rem;
        padding-left: 0.8rem;
      }
    }

    &.center {
      /** 1개인 경우 센터 정렬 */
      & .swiper-wrapper {
        display: flex;
        justify-content: center;
      }

      & .swiper-slide {
        width: 28rem;

        & > .inner-wrap {
          padding-right: 0.8rem;
          padding-left: 0.8rem;
        }
      }
    }
  }

  &.swiper-mode {
    &.center {
      /** 1개인 경우 센터 정렬 */
      & .swiper-slide {
        width: 26.4rem;

        & > .inner-wrap {
          padding-right: 0rem;
          padding-left: 0rem;
        }
      }
    }
  }
`;
