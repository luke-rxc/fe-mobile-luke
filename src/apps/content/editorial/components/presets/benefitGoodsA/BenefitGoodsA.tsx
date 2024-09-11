import { forwardRef, useRef, useImperativeHandle, useState, Fragment, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { AlignType, MediaType, TypoItemSizeType } from '../../../constants';
import type { BenefitGoodsAComponentRefModel, BenefitGoodsAProps } from '../../../models';
import { useLogService } from '../../../services';

const BenefitGoodsAComponent = forwardRef<BenefitGoodsAComponentRefModel, BenefitGoodsAProps>(
  (
    {
      className,
      contentInfo,
      visible,
      align,
      backgroundMedia,
      headerTitle,
      headerSubText = [],
      headerDetail,
      useDetailBox,
      detailBoxTitle,
      detailBoxDescription = [],
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
              <div className="header">
                <p
                  className={classNames('title', {
                    'is-title2': headerTitle.sizeType === TypoItemSizeType.TITLE2,
                    'is-title': headerTitle.sizeType === TypoItemSizeType.TITLE,
                  })}
                >
                  {nl2br(headerTitle.text)}
                </p>
                {headerSubText.length && (
                  <ul className="sub-text-box">
                    {headerSubText.map((value, index) => {
                      const { subTitle, description } = value;
                      return (
                        <li
                          className={classNames('sub-text', {
                            'is-left': align === AlignType.LEFT,
                            'is-center': align === AlignType.CENTER,
                          })}
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                        >
                          <span className="sub-title">{subTitle.text}</span>
                          <span className="desc">{description.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {headerDetail.text && <p className="detail">{nl2br(headerDetail.text)}</p>}
              </div>
              {useDetailBox && (
                <div className="detail-box">
                  <div className="detail-header">{detailBoxTitle.text}</div>
                  {detailBoxDescription.length && (
                    <ul className="detail-desc-box">
                      {detailBoxDescription.map((desc) => {
                        if (!desc.text) return <></>;
                        // eslint-disable-next-line react/jsx-key
                        return <li className="desc">{desc.text}</li>;
                      })}
                    </ul>
                  )}
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
 * 혜택 상품 B 컴포넌트
 */
export const BenefitGoodsA = styled(BenefitGoodsAComponent)`
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
    padding: 0 2.4rem;

    & .header {
      & .title {
        text-align: ${({ align }) => align};
        &.is-title2 {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title2B};
        }
        &.is-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
        }
      }
      & .sub-text-box {
        margin-top: 1.6rem;
        & .sub-text {
          margin-top: 0.8rem;
          word-break: keep-all;
          word-wrap: break-word;
          &:first-child {
            margin-top: 0;
          }

          & .sub-title {
            display: inline-block;
            width: 8rem;
            font: ${({ theme }) => theme.content.contentStyle.fontType.miniB};
          }
          & .desc {
            margin-left: 0.8rem;
            font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
          }

          &.is-left {
            display: flex;
            & .sub-title {
              flex-shrink: 0;
            }
            & .desc {
              flex-grow: 1;
              overflow: hidden;
            }
          }
          &.is-center {
            display: flex;
            justify-content: center;
            & .sub-title {
              width: initial;
              max-width: 8rem;
              vertical-align: top;
            }
            & .desc {
              display: inline-block;
              max-width: 18.4rem;
              vertical-align: top;
            }
          }
        }
      }
      & .detail {
        margin-top: 0.8rem;
        text-align: ${({ align }) => align};
        font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
      }
    }

    & .detail-box {
      margin-top: 2.4rem;

      & .detail-header {
        position: relative;
        padding: 0.8rem;
        text-align: center;
        font: ${({ theme }) => theme.content.contentStyle.fontType.miniB};
        word-break: keep-all;
        word-wrap: break-word;
        &::before {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: ${({ textColor, theme }) => textColor || theme.color.blackLight};
          display: block;
          top: 0;
          left: 0;
          opacity: 0.1;
          border-top-left-radius: ${({ theme }) => theme.radius.r6};
          border-top-right-radius: ${({ theme }) => theme.radius.r6};
          content: '';
        }
      }
      & .detail-desc-box {
        position: relative;
        padding: 1.2rem 1.6rem;
        &::before {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: ${({ textColor, theme }) => textColor || theme.color.blackLight};
          display: block;
          top: 0;
          left: 0;
          opacity: 0.03;
          border-bottom-left-radius: ${({ theme }) => theme.radius.r6};
          border-bottom-right-radius: ${({ theme }) => theme.radius.r6};
          content: '';
        }
        & .desc {
          position: relative;
          padding: 0.4rem 0rem 0.4rem 0.9rem;
          word-break: keep-all;
          word-wrap: break-word;
          font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
          &::before {
            display: block;
            position: absolute;
            top: 0.3rem;
            left: 0.2rem;
            content: '∙';
          }
        }
      }
    }
  }
`;
