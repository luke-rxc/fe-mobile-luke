import { useEffect, forwardRef, useState, useRef, useImperativeHandle, useCallback } from 'react';
import styled, { css } from 'styled-components';
import omit from 'lodash/omit';
import classNames from 'classnames';
import { GoodsType } from '@constants/goods';
import { GoodsList } from '@pui/goodsList';
import { GoodsCard, GoodsCardProps } from '@pui/goodsCard';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { useIntersection } from '@hooks/useIntersection';
import { MediaType, AppearType, DealAColumnType } from '../../../constants';
import type { DealListAProps, DealListAComponentRefModel, DealListAGoodsModel } from '../../../models';
import { useLogService } from '../../../services';
import { ImageStyled as ImageComponent } from '../Image';
import { Title, TitleProps } from '../Title';

const DealListAComponent = forwardRef<DealListAComponentRefModel, DealListAProps>(
  (
    {
      className,
      contentInfo,
      align,
      textEffect = true,
      title,
      subTitle,
      description,
      goodsColumnType,
      fillColumn,
      backgroundMedia,
      goodsList,
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
      goodsList.map((item: DealListAGoodsModel): GoodsCardProps => {
        return omit(item, ['type', 'status']);
      }),
    );

    const { logPresetDealInit, logPresetDealGoodsTab, logPresetDealGoodsInit } = useLogService();
    const { contentId, contentName, contentType, contentIndex } = contentInfo;
    const handleGoodsTab = useCallback(
      (goods: GoodsCardProps, index: number) => {
        const originGoods = goodsList.find((deal: DealListAGoodsModel) => deal.goodsId === goods.goodsId);

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
    const winWd = useRef<number>(0);
    const [goodsViewWidth, setGoodsViewWidth] = useState(0);
    const timeId = useRef<NodeJS.Timeout | null>(null);
    const handleSetViewWidth = useCallback(() => {
      if (winWd.current === window.innerWidth) return;
      const padding = 24;
      const gap = 16;
      setGoodsViewWidth(Math.floor((window.innerWidth - padding * 2 - gap) / 2) / 10); // rem 단위
      winWd.current = window.innerWidth;
    }, []);

    const handleResize = () => {
      setGoodsViewWidth(0);
      if (timeId.current) clearTimeout(timeId.current);
      timeId.current = setTimeout(() => {
        handleSetViewWidth();
      }, 100);
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

    useEffect(() => {
      handleSetViewWidth();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div className="inner">
            <div className="sticky-wrap">
              <div className="bg">
                {!errorMedia && (
                  <>
                    {backgroundMedia.type === MediaType.IMAGE && (
                      <ImageComponent
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
            </div>
            <div className="contents">
              {(title?.text || subTitle?.text || description?.text) && (
                <Title className="title-wrapper" {...titleInfo} />
              )}
              <div
                className={classNames('goods-wrapper', {
                  'is-fill': fillColumn,
                  'is-white': goodsColor === '#ffffff',
                  // 화이트/블랙외 기존에 텍스트 컬러값 설정된 케이스
                  'is-color': goodsColor !== '#ffffff' && goodsColor !== '#000000',
                })}
              >
                {goodsColumnType === DealAColumnType.TWO_COLUMN && (
                  <GoodsListStyled
                    disabled
                    goodsList={dealList}
                    onListClick={handleGoodsTab}
                    goodsSize={goodsViewWidth}
                  />
                )}
                {goodsColumnType === DealAColumnType.ONE_COLUMN && (
                  <>
                    {dealList.length > 0 && (
                      <ul className="goods-list-one">
                        {dealList.map((goods, index) => (
                          <li key={goods.goodsCode} className="goods-item">
                            <div className="inner">
                              <GoodsCard {...goods} onClick={() => handleGoodsTab(goods, index)} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 상품전시 A 컴포넌트
 */
export const DealListA = styled(DealListAComponent)`
  > .inner {
    position: relative;
    padding: 4.8rem 0 1.6rem;
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      img,
      video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
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
      // 1단 모듈
      & .goods-list-one {
        & .goods-item {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 1.6rem;
          &:nth-child(1) {
            margin-top: 0;
          }
          & > .inner {
            width: 26.4rem;
          }
        }
      }

      &.is-fill {
        & ${GoodsList} {
          & .goods-list {
            padding: 0;
            grid-template-columns: repeat(2, 50%);
            grid-column-gap: 0rem;
            grid-row-gap: 1.6rem;
          }
          & .goods-image {
            border-radius: 0;
            & ${Image} {
              border-radius: 0;
            }
          }
        }

        // 1단 모듈
        & .goods-list-one {
          & .goods-item {
            & > .inner {
              width: 100%;

              & .goods-image {
                border-radius: 0;

                & ${Image} {
                  border-radius: 0;
                }
              }
            }
          }
        }
      }

      &.is-white {
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
      &.is-color {
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

const GoodsListStyled = styled(GoodsList).attrs(({ goodsSize }: { goodsSize: number }) => {
  return {
    goodsSize,
  };
})`
  & .goods-list {
    grid-template-columns: ${({ goodsSize, theme }) =>
      goodsSize ? `repeat(2, ${goodsSize}rem)` : `repeat(2, calc(50% - ${theme.spacing.s8}))`};
  }
`;
