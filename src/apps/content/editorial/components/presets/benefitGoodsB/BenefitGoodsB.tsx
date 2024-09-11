import { forwardRef, useRef, useImperativeHandle, useState, Fragment, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import type { BenefitGoodsBComponentRefModel, BenefitGoodsBProps, TypoItemModel } from '../../../models';
import { useLogService } from '../../../services';
import { MediaType, TypoItemSizeType } from '../../../constants';
import { BenefitGoodsBLabel } from './BenefitGoodsBLabel';

const BenefitGoodsBComponent = forwardRef<BenefitGoodsBComponentRefModel, BenefitGoodsBProps>(
  (
    {
      className,
      contentInfo,
      visible,
      backgroundMedia,
      labelPrizmOnly,
      labelLiveOnly,
      title,
      subTitle,
      description,
      useGoodsPrice,
      priceList,
    },
    ref,
  ) => {
    const { logPresetBenefitGoodsInit } = useLogService();
    const containerRef = useRef<HTMLDivElement>(null);
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const sectionElRef = useRef<HTMLDivElement | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [inView, setInView] = useState(false);

    const handleIntersectionObserver = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.current && observer.current.disconnect();
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sectionRef = useCallback((el) => {
      if (!el || sectionElRef.current) return;

      observer.current = new IntersectionObserver(handleIntersectionObserver, {
        threshold: 0,
      });
      observer.current.observe(el);
      sectionElRef.current = el;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const descLength = description.reduce((accumulator: number, item: TypoItemModel) => {
      return accumulator + item.text.length;
    }, 0);
    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    useEffect(() => {
      if (inView) {
        logPresetBenefitGoodsInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div className="content-wrapper" ref={sectionRef}>
            <div className="bg">
              {!errorMedia && (
                <>
                  {backgroundMedia.type === MediaType.IMAGE && (
                    <Image
                      src={getImageLink(backgroundMedia.path)}
                      blurHash={backgroundMedia.blurHash}
                      onError={() => setErrorMedia(true)}
                      lazy
                    />
                  )}
                </>
              )}
              {errorMedia && <div className="overlay-error" />}
            </div>
            <div className="contents">
              {(labelPrizmOnly || labelLiveOnly) && (
                <BenefitGoodsBLabel prizmOnly={labelPrizmOnly} liveOnly={labelLiveOnly} />
              )}
              {(title.text || subTitle.text) && (
                <div className="ly-box detail-box">
                  <p
                    className={classNames('title', {
                      'is-title': title.sizeType === TypoItemSizeType.TITLE2,
                      'is-large': title.sizeType === TypoItemSizeType.LARGE,
                    })}
                  >
                    {nl2br(title.text)}
                  </p>
                  {subTitle.text && <p className="sub">{nl2br(subTitle.text)}</p>}
                </div>
              )}
              {!!descLength && (
                <ul className="ly-box desc-box">
                  {description.map((desc, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <li className="desc" key={index}>
                        {nl2br(desc.text)}
                      </li>
                    );
                  })}
                </ul>
              )}

              {useGoodsPrice && priceList.length && (
                <ul className="ly-box price-list">
                  {priceList.map((price, index) => {
                    const isEmpty =
                      !price.subTitle.text &&
                      !price.description.text &&
                      !price.benefit.text &&
                      !price.priceValue.text &&
                      !price.priceBenefitValue.text;

                    // eslint-disable-next-line react/no-array-index-key
                    if (isEmpty) return <Fragment key={index} />;

                    const {
                      subTitle: priceSubTitle,
                      description: priceDesc,
                      benefit,
                      priceBenefitValue,
                      priceValue,
                    } = price;
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <li className="price-box" key={index}>
                        <div className="price">
                          {(priceSubTitle.text || priceDesc.text) && (
                            <div className="price-text">
                              {priceSubTitle.text && <p className="price-sub">{priceSubTitle.text}</p>}
                              {priceDesc.text && <p className="price-desc">{priceDesc.text}</p>}
                            </div>
                          )}
                          <div className="benefit-box">
                            {benefit.text && (
                              <span
                                className={classNames('benefit-text', {
                                  'is-bold': benefit.bold,
                                })}
                              >
                                {benefit.text}
                              </span>
                            )}
                            {priceBenefitValue.text && (
                              <span
                                className={classNames('benefit-value', {
                                  'is-bold': priceBenefitValue.bold,
                                })}
                              >
                                {priceBenefitValue.text}
                              </span>
                            )}
                            {priceValue.text && <span className="benefit-origin-value">{priceValue.text}</span>}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 혜택 상품 B 컴포넌트
 */
export const BenefitGoodsB = styled(BenefitGoodsBComponent)`
  & .content-wrapper {
    position: relative;
    padding-top: ${({ layoutMarginTop }) => `${layoutMarginTop ? 4.8 : 0}rem`};
    padding-bottom: ${({ layoutMarginBottom }) => `${layoutMarginBottom ? 4.8 : 0}rem`};
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
    color: ${({ textColor, theme }) => textColor || theme.color.text.textPrimary};
  }
  & .bg {
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
  & .contents {
    position: relative;
    ${BenefitGoodsBLabel} {
      & + .ly-box {
        padding-top: 0.4rem;
      }
    }

    & > .detail-box {
      padding: 0 2.4rem;
      & .title {
        &.is-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title2B};
        }

        &.is-large {
          font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
        }
      }

      & .sub {
        margin-top: 0.4rem;
        font: ${({ theme }) => theme.content.contentStyle.fontType.smallB};
      }

      & + .ly-box {
        padding-top: 0.8rem;
      }
    }

    & > .desc-box {
      padding: 0 2.4rem;
      & .desc {
        position: relative;
        padding: 0.4rem 0rem 0.4rem 0rem;
        font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
      }

      & + .ly-box {
        padding-top: 0.8rem;
      }
    }

    & > .price-list {
      & .price-box {
        position: relative;

        &::before {
          display: block;
          width: calc(100% - 4.8rem);
          height: 1px;
          margin: 0 auto;
          background-color: ${({ theme, textColor }) => textColor || theme.color.backgroundLayout.line};
          opacity: ${({ textColor }) => (textColor ? 0.08 : 1)};
          content: '';
        }

        &:first-child {
          &::before {
            display: none;
          }
        }
      }

      & .price {
        display: flex;
        align-items: center;
        padding: 1.6rem 2.4rem;
        word-wrap: break-word;
        word-break: keep-all;

        & .price-text {
          flex-shrink: 0;
          width: 15.6rem;
        }

        & .benefit-box {
          overflow: hidden;
          flex-grow: 1;
          text-align: right;
        }

        & .price-text + .benefit-box {
          margin-left: 0.8rem;
        }

        & .price-sub {
          font: ${({ theme }) => theme.content.contentStyle.fontType.small};
        }

        & .price-desc {
          opacity: 0.5;
          font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
        }

        & .price-sub + .price-desc {
          margin-top: 0.4rem;
        }

        & .benefit-text {
          display: inline-block;
          color: ${({ theme }) => theme.color.red};
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};

          &.is-bold {
            font-weight: ${({ theme }) => theme.fontWeight.bold};
          }
        }

        & .benefit-value {
          display: inline-block;
          margin-left: 0.4rem;
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};

          &.is-bold {
            font-weight: ${({ theme }) => theme.fontWeight.bold};
          }
        }

        & .benefit-origin-value {
          display: block;
          margin-top: 0.4rem;
          opacity: 0.5;
          font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
          text-decoration: line-through;
        }
      }
    }
  }
`;
