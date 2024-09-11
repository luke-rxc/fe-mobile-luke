import { forwardRef, useRef, useImperativeHandle, useState, Fragment, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import type Swiper from 'swiper';
import { Image } from '@pui/image';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { BenefitListAOverlayColorTypes, MediaType, TypoItemSizeType } from '../../../constants';
import type { BenefitListAComponentRefModel, BenefitListAProps, DisplayMediaModel } from '../../../models';
import { useLogService } from '../../../services';
import { ImageBox } from './ImageBox';

const BenefitListAComponent = forwardRef<BenefitListAComponentRefModel, BenefitListAProps>(
  (
    {
      className,
      contentInfo,
      visible,
      backgroundMedia,
      subTitle,
      description,
      detail,
      useMedia,
      mediaList,
      controller,
    },
    ref,
  ) => {
    const { logPresetBenefitListInit } = useLogService();
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionElRef = useRef<HTMLDivElement | null>(null);
    const swp = useRef<Swiper | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [inView, setInView] = useState(false);
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const swiperOption = useRef<SwiperContainerProps>({
      pagination: {
        type: 'bullets',
        clickable: true,
      },
      loop: mediaList.length > 1,
      controlTheme: {
        ...(controller?.bulletColor && { color: controller.bulletColor }),
        paginationOverlay:
          // eslint-disable-next-line no-nested-ternary
          controller?.background === BenefitListAOverlayColorTypes.BLACK
            ? 'black'
            : controller?.background === BenefitListAOverlayColorTypes.WHITE
            ? 'white'
            : '',
      },
      touchReleaseOnEdges: mediaList.length === 1,
      onSwiper: (swiper: Swiper) => {
        swp.current = swiper;
      },
    });
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
        logPresetBenefitListInit(contentInfo);
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
              {(subTitle.text || description.text) && (
                <div className="title-box">
                  {subTitle.text && (
                    <p
                      className={classNames('title', {
                        'is-large': subTitle.sizeType === TypoItemSizeType.LARGE,
                        'is-medium': subTitle.sizeType === TypoItemSizeType.MEDIUM,
                      })}
                    >
                      {nl2br(subTitle.text)}
                    </p>
                  )}
                  {description.text && (
                    <p
                      className={classNames('sub', {
                        'is-small': description.sizeType === TypoItemSizeType.SMALL,
                        'is-mini': description.sizeType === TypoItemSizeType.MINI,
                      })}
                    >
                      {nl2br(description.text)}
                    </p>
                  )}
                </div>
              )}
              {useMedia && (
                <div className="media-list">
                  <SwiperContainer {...swiperOption.current}>
                    {mediaList.map((mediaItem: DisplayMediaModel) => {
                      const { id, type, ...mediaRest } = mediaItem;
                      const media = { ...mediaRest } as DisplayMediaModel;
                      return (
                        <SwiperSlide key={id}>
                          <div className="media-wrapper">{type === MediaType.IMAGE && <ImageBox media={media} />}</div>
                        </SwiperSlide>
                      );
                    })}
                  </SwiperContainer>
                </div>
              )}
              {detail.text && <p className={classNames('detail')}>{nl2br(detail.text)}</p>}
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
export const BenefitListA = styled(BenefitListAComponent)`
  & .content-wrapper {
    position: relative;
    padding-top: ${({ layoutMarginTop }) => `${layoutMarginTop ? 1.6 : 0}rem`};
    padding-bottom: ${({ layoutMarginBottom }) => `${layoutMarginBottom ? 3.2 : 0}rem`};
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
    &::before {
      width: 100%;
      height: 1px;
      display: block;
      margin: 0 auto;
      background-color: ${({ theme, textColor }) => textColor || theme.color.backgroundLayout.line};
      opacity: ${({ textColor }) => (textColor ? 0.08 : 1)};
      content: '';
    }
    & .title-box {
      margin-top: 3.2rem;
      text-align: ${({ align }) => align};
      & .title {
        &.is-large {
          font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
        }
        &.is-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
        }
      }

      & .sub {
        opacity: 0.7;
        &.is-small {
          font: ${({ theme }) => theme.content.contentStyle.fontType.small};
        }
        &.is-mini {
          font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
        }
      }
      & .title + .sub {
        margin-top: 1.6rem;
      }
    }

    & .media-list {
      margin-top: 2.4rem;
      overflow: hidden;
      border-radius: ${({ theme }) => theme.radius.r8};

      & .media-wrapper {
        height: 24rem;
      }
    }
    & .detail {
      margin-top: 1.2rem;
      opacity: 0.7;
      text-align: ${({ align }) => align};
      font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
    }
  }
`;
