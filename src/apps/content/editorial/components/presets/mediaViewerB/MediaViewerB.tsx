import { useEffect, useState, forwardRef, useRef, useImperativeHandle, useCallback } from 'react';
import type Swiper from 'swiper';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { SwiperContainerProps, SwiperSlide, SwiperContainer } from '@pui/swiper';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { useIntersection } from '@hooks/useIntersection';
import { AppearType, LandingActionType, MediaType } from '../../../constants';
import type {
  DisplayMediaModel,
  LandingActionModel,
  MediaViewerBComponentRefModel,
  MediaViewerBProps,
} from '../../../models';
import { useLogService } from '../../../services';
import { Title, TitleProps } from '../Title';
import { MediaBox } from './MediaBox';

const MediaViewerBComponent = forwardRef<MediaViewerBComponentRefModel, MediaViewerBProps>(
  (
    {
      className,
      align,
      textEffect = true,
      title,
      subTitle,
      description,
      backgroundMedia,
      mediaViewRatio,
      isMediaRound,
      mediaLists,
      mediaTextColor,
      useMediaText,
      contentInfo,
      visible,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const titleSectionValue: TitleProps = {
      title,
      subTitle,
      description,
      align,
      transform: textEffect ? AppearType.FROM_BOTTOM : AppearType.NONE,
    };
    const { logPresetMediaViewerInit, logPresetMediaViewerSlide, logPresetMediaViewerTab } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const isFirstVisibleSection = useRef<boolean>(false);
    const swp = useRef<Swiper | null>(null);
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const handleSlideView = useCallback(
      (s: Swiper) => {
        logPresetMediaViewerSlide(contentInfo, s.activeIndex);
      },
      [contentInfo, logPresetMediaViewerSlide],
    );
    const carouselOption = useRef<SwiperContainerProps>({
      loop: false,
      slidesPerView: 'auto',
      onSlideChange: handleSlideView,
      onSwiper: (s: Swiper) => {
        swp.current = s;
      },
    });

    const handleAction = useCallback(
      (actions: LandingActionModel, index: number) => {
        logPresetMediaViewerTab(contentInfo, actions, index);
      },
      [contentInfo, logPresetMediaViewerTab],
    );

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
        logPresetMediaViewerInit(contentInfo);
        if (swp.current) {
          handleSlideView(swp.current);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    useEffect(() => {
      return () => {
        if (swp.current) {
          swp.current.destroy();
        }
      };
    }, []);

    return (
      <div className={className} ref={containerRef}>
        {visible && (
          <div className="viewer">
            <div className="bg-wrapper">
              {backgroundMedia.path && (
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
              )}
            </div>
            <div className="contents">
              {(title.text || subTitle.text || description.text) && (
                <Title className="title-wrapper" {...titleSectionValue} />
              )}
              {mediaLists.length > 0 && (
                <div className="media-wrapper">
                  <CarouselStyled
                    {...carouselOption.current}
                    className={classNames('carousel', {
                      'is-only': mediaLists.length === 1,
                    })}
                  >
                    {mediaLists.map((mediaItem, index) => {
                      const {
                        id,
                        title: mediaTitle,
                        subTitle: mediaSubTitle,
                        actions = { actionType: LandingActionType.NONE, value: '' },
                        ...mediaRest
                      } = mediaItem;
                      const media = { ...mediaRest } as DisplayMediaModel;
                      return (
                        <SwiperSlide key={id}>
                          <div className="inner">
                            <MediaBox
                              title={useMediaText ? mediaTitle : ''}
                              subTitle={useMediaText ? mediaSubTitle : ''}
                              actions={actions}
                              media={media}
                              mediaViewRatio={mediaViewRatio}
                              round={isMediaRound}
                              color={mediaTextColor}
                              onActions={() => {
                                handleAction(actions, index);
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      );
                    })}
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
 * 미디어 뷰어 B 컴포넌트
 */
export const MediaViewerB = styled(MediaViewerBComponent)`
  .viewer {
    position: relative;
    color: ${({ color }) => color};
    text-align: ${({ align }) => align};
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
        object-fit: cover;
        vertical-align: middle;
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
      padding: 4.8rem 0;
    }
    .title-wrapper {
      padding: 0 2.4rem;
    }
    .title-wrapper + .media-wrapper {
      margin-top: 3.2rem;
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CarouselStyled: any = styled(SwiperContainer)<SwiperContainerProps>`
  &.carousel {
    & .swiper {
      padding-left: 0.8rem;
      padding-right: 3.2rem;
    }
    & .swiper-slide {
      width: 27.2rem;
      & > .inner {
        padding-left: 1.6rem;
      }
    }
    &.is-only {
      // 1개인 경우 센터 정렬
      & .swiper {
        padding-left: 0rem;
        padding-right: 0rem;
      }
      & .swiper-wrapper {
        display: flex;
        justify-content: center;
      }
      & .swiper-slide {
        width: 25.6rem;
        & > .inner {
          padding-left: 0rem;
        }
      }
    }
  }
`;
