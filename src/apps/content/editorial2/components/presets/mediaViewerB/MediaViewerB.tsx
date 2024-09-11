import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import Swiper from 'swiper';
import { Image } from '@pui/image';
import { SwiperContainerProps, SwiperSlide, SwiperContainer } from '@pui/swiper';
import { getImageLink } from '@utils/link';
import { LandingActionType, MediaType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  DisplayMediaModel,
  LandingActionModel,
  MediaViewerBDisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { Title } from '../Title';
import type { TitleProps } from '../Title';
import { MediaBox } from './MediaBox';

const MediaViewerBComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as MediaViewerBDisplayModel;
  const {
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

  const { logPresetMediaViewerInit, logPresetMediaViewerSlide, logPresetMediaViewerTab } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const swp = useRef<Swiper | null>(null);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

  const handleSlideView = (swiper: Swiper) => {
    logPresetMediaViewerSlide(contentLogInfo, swiper.activeIndex);
  };

  const titleSectionValue: TitleProps = {
    mainTitle: title,
    subTitle,
    description,
    align,
    textEffect,
  };

  const carouselOption = useRef<SwiperContainerProps>({
    loop: false,
    slidesPerView: 'auto',
    onSlideChange: handleSlideView,
    onSwiper: (s: Swiper) => {
      swp.current = s;
    },
  });

  const handleAction = (actions: LandingActionModel, index: number) => {
    logPresetMediaViewerTab(contentLogInfo, actions, index);
  };

  useEffect(() => {
    if (inView) {
      logPresetMediaViewerInit(contentLogInfo);
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
    <div ref={ref} {...props}>
      {visible && (
        <MediaViewerBContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
        </MediaViewerBContent>
      )}
    </div>
  );
});
const MediaViewerB = styled(MediaViewerBComponent)``;
export default MediaViewerB;

const MediaViewerBContent = styled('div').attrs((props: MediaViewerBDisplayModel) => props)`
  position: relative;
  background-color: ${({ backgroundInfo }) => backgroundInfo?.color};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};

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
    padding: 4.8rem 0;
  }

  .title-wrapper {
    padding: 0 2.4rem;
  }

  .title-wrapper + .media-wrapper {
    margin-top: 3.2rem;
  }
`;

const CarouselStyled = styled(SwiperContainer)<SwiperContainerProps>`
  &.carousel {
    & .swiper {
      padding-right: 3.2rem;
      padding-left: 0.8rem;
    }

    & .swiper-slide {
      width: 27.2rem;

      & > .inner {
        padding-left: 1.6rem;
      }
    }

    &.is-only {
      /** 1개인 경우 센터 정렬 */
      & .swiper {
        padding-right: 0rem;
        padding-left: 0rem;
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
