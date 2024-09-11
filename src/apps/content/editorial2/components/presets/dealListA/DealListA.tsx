import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { GoodsCard, GoodsCardProps } from '@pui/goodsCard';
import { GoodsList } from '@pui/goodsList';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { DealAColumnType, MediaType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  DealListADisplayModel,
  GoodsModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService, usePresetGoodsService } from '../../../services';
import { useContentStore } from '../../../stores';
import { Title, TitleProps } from '../Title';

const DealListAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, goodsList } = preset;
  const displayValues = JSON.parse(contents) as DealListADisplayModel;
  const {
    align,
    textEffect = true,
    title,
    subTitle,
    description,
    goodsColumnType,
    fillColumn,
    backgroundMedia,
    goodsColor,
  } = displayValues;
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
  const winWd = useRef<number>(0);
  const [goodsViewWidth, setGoodsViewWidth] = useState(0);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const titleSectionValue: TitleProps = {
    mainTitle: title,
    subTitle,
    description,
    align,
    textEffect,
  };
  const timeId = useRef<NodeJS.Timeout | null>(null);

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

  const handleSetViewWidth = () => {
    if (winWd.current === window.innerWidth) return;
    const padding = 24;
    const gap = 16;
    setGoodsViewWidth(Math.floor((window.innerWidth - padding * 2 - gap) / 2) / 10); // rem 단위
    winWd.current = window.innerWidth;
  };

  const handleResize = () => {
    setGoodsViewWidth(0);
    if (timeId.current) clearTimeout(timeId.current);
    timeId.current = setTimeout(() => {
      handleSetViewWidth();
    }, 100);
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

  useEffect(() => {
    handleSetViewWidth();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <DealListAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
                    goodsList={goodsCardItems}
                    onListClick={handleGoodsTab}
                    $goodsSize={goodsViewWidth}
                  />
                )}
                {goodsColumnType === DealAColumnType.ONE_COLUMN && (
                  <>
                    {goodsCardItems.length > 0 && (
                      <ul className="goods-list-one">
                        {goodsCardItems.map((goods, index) => (
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
        </DealListAContent>
      )}
    </div>
  );
});
const DealListA = styled(DealListAComponent)``;
export default DealListA;

const DealListAContent = styled('div').attrs((props: DealListADisplayModel) => props)`
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
      /** 1단 모듈 */
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
            grid-row-gap: 1.6rem;
            grid-column-gap: 0rem;
            grid-template-columns: repeat(2, 50%);
            padding: 0;
          }

          & .goods-image {
            border-radius: 0;
            & ${Image} {
              border-radius: 0;
            }
          }
        }

        /** 1단 모듈 */
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

    .title-wrapper {
      padding: 0 2.4rem;
    }

    .title-wrapper + .goods-wrapper {
      margin-top: 4.8rem;
    }
  }
`;
const GoodsListStyled = styled(GoodsList).attrs(({ $goodsSize }: { $goodsSize: number }) => {
  return {
    $goodsSize,
  };
})`
  & .goods-list {
    grid-template-columns: ${({ $goodsSize, theme }) =>
      $goodsSize ? `repeat(2, ${$goodsSize}rem)` : `repeat(2, calc(50% - ${theme.spacing.s8}))`};
  }
`;
