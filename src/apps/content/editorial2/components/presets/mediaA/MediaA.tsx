import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { useVideo } from '@features/videoPlayer/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { AlignType, MediaType, TextItemSizeType, VerticalAlignType } from '../../../constants';
import { useAnimationFrame, useIntersection } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  ContentLogInfoModel,
  MediaADisplayModel,
  MediaAParallaxStyledModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getEasingValue, getViewHeightForRatio } from '../../../utils';

const AnimationKey = {
  IMAGE_TRANSLATE_Y: 'imageTranslateY', // 이미지 요소 Y위치 정보
  IMAGE_OPACITY: 'imageOpacity', // 이미지 요소 투명도
  TITLE_TRANSLATE_Y: 'titleTranslateY', // 타이틀 Y위치 정보
  TITLE_OPACITY: 'titleOpacity', // 타이틀 투명도
  SUB_TITLE_TRANSLATE_Y: 'subTitleTranslateY', // 서브타이틀 Y위치 정보
  SUB_TITLE_OPACITY: 'subTitleOpacity', // 서브타이틀 투명도
  DESC_TRANSLATE_Y: 'descriptionTranslateY', // description Y위치 정보
  DESC_OPACITY: 'descriptionOpacity', // description 투명도
} as const;

/**
 * 패럴럭스 애니메이션 데이터
 */
const mediaAAnimation: AnimationSet[] = [
  {
    id: AnimationKey.IMAGE_OPACITY,
    animations: [
      {
        startRange: 0.35,
        endRange: 0.4,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.IMAGE_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.35,
        endRange: 0.4,
        startValue: 100,
        endValue: 0,
      },
    ],
  },
  {
    id: AnimationKey.TITLE_OPACITY,
    animations: [
      {
        startRange: 0.38,
        endRange: 0.43,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.TITLE_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.38,
        endRange: 0.43,
        startValue: 100,
        endValue: 0,
      },
    ],
  },
  {
    id: AnimationKey.SUB_TITLE_OPACITY,
    animations: [
      {
        startRange: 0.41,
        endRange: 0.46,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.SUB_TITLE_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.41,
        endRange: 0.46,
        startValue: 100,
        endValue: 0,
      },
    ],
  },
  {
    id: AnimationKey.DESC_OPACITY,
    animations: [
      {
        startRange: 0.44,
        endRange: 0.49,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.DESC_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.44,
        endRange: 0.49,
        startValue: 100,
        endValue: 0,
      },
    ],
  },
];

const MediaAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as MediaADisplayModel;
  const {
    align,
    verticalAlign,
    mainImage,
    textEffect = true,
    title,
    subTitle,
    description,
    backgroundInfo,
    backgroundMedia,
    parallaxMode,
    isOverlay,
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
  const { logPresetMediaInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const {
    sectionRef: contentRef,
    sectionElRef: contentElRef,
    inView: contentInView,
  } = useIntersection({ once: false });

  const { isIOS, isApp } = useDeviceDetect();
  const [styledOptions, setStyledOptions] = useState<MediaAParallaxStyledModel>({
    verticalAlign,
    parallaxMode,
    background: {
      type: backgroundMedia.type,
      autoPlay: true,
      videoDuration: 0,
      color: backgroundInfo.color,
    },
    align,
    textEffect,
    titleBold: title.bold,
    titleColor: title.color,
    titleSize: title.sizeType,
    subTitleBold: subTitle.bold,
    subTitleColor: subTitle.color,
    descBold: description.bold,
    descColor: description.color,
    objectTranslateY: 100,
    objectOpacity: 0,
    titleOpacity: 0,
    titleTranslateY: 100,
    subTitleOpacity: 0,
    subTitleTranslateY: 100,
    descOpacity: 0,
    descTranslateY: 100,
    isOverlay,
  });
  const delayImageYOffset = useRef<number>(0);
  const delayImageOpacityOffset = useRef<number>(0);
  const delayTitleOpacityOffset = useRef<number>(0);
  const delayTitleYOffset = useRef<number>(0);
  const delaySubTitleOpacityOffset = useRef<number>(0);
  const delaySubTitleYOffset = useRef<number>(0);
  const delayDescOpacityOffset = useRef<number>(0);
  const delayDescYOffset = useRef<number>(0);
  const loop = (animResultValue: AnimationSetForScroll[]) => {
    // 오브젝트 Y 포지션
    delayImageYOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.IMAGE_TRANSLATE_Y,
      delayImageYOffset.current,
    );
    // 오브젝트 투명도
    delayImageOpacityOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.IMAGE_OPACITY,
      delayImageOpacityOffset.current,
    );
    // 타이틀 투명도
    delayTitleOpacityOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.TITLE_OPACITY,
      delayTitleOpacityOffset.current,
    );
    // 타이틀 Y 포지션
    delayTitleYOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.TITLE_TRANSLATE_Y,
      delayTitleYOffset.current,
    );
    // 서브타이틀 투명도
    delaySubTitleOpacityOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.SUB_TITLE_OPACITY,
      delaySubTitleOpacityOffset.current,
    );
    // 서브타이틀 Y 포지션
    delaySubTitleYOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.SUB_TITLE_TRANSLATE_Y,
      delaySubTitleYOffset.current,
    );
    // description 투명도
    delayDescOpacityOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.DESC_OPACITY,
      delayDescOpacityOffset.current,
    );
    // description Y 포지션
    delayDescYOffset.current = getEasingValue(animResultValue, AnimationKey.DESC_TRANSLATE_Y, delayDescYOffset.current);

    setStyledOptions((prop: MediaAParallaxStyledModel) => {
      let option = {
        ...prop,
        objectTranslateY: delayImageYOffset.current,
        objectOpacity: delayImageOpacityOffset.current,
      };

      if (textEffect) {
        option = {
          ...option,
          titleOpacity: delayTitleOpacityOffset.current,
          titleTranslateY: delayTitleYOffset.current,
          subTitleOpacity: delaySubTitleOpacityOffset.current,
          subTitleTranslateY: delaySubTitleYOffset.current,
          descOpacity: delayDescOpacityOffset.current,
          descTranslateY: delayDescYOffset.current,
        };
      }
      return option;
    });
  };

  const [isAvailableVideo, setIsAvailableVideo] = useState(false); // 비디오 play 가능 체크
  const [isShowPoster, setIsShowPoster] = useState(true); // 비디오 포스터 노출
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const [viewHeight, setViewHeight] = useState(0);

  const { videoRef, handleVideoPlay, handleVideoReset } = useVideo({
    videoEvents: {
      canplay: () => {
        if (isAvailableVideo) {
          return;
        }

        setIsAvailableVideo(true);
        // 비디오 재생가능 시점에서 1프레임 렌더링 될때 흰 여백을 보간하기 위한 타이밍 조절
        setTimeout(() => setIsShowPoster(false), 100);
      },
      error: () => setErrorMedia(true),
    },
  });

  // 고정 비율시 높이 설정
  const handleSetViewHeight = useCallback(() => {
    if (parallaxMode) return;

    const targetViewHeight = getViewHeightForRatio(390, 520);
    setViewHeight(targetViewHeight);
  }, [parallaxMode]);

  // 애니메이션 실행
  useAnimationFrame({
    sectionRef: contentElRef,
    onRequestFrame: loop,
    animationData: mediaAAnimation,
  });

  useEffect(() => {
    if (backgroundMedia.type !== MediaType.VIDEO || !visible) return;
    if (contentInView) {
      handleVideoPlay(true);
    } else {
      handleVideoReset(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentInView]);

  useEffect(() => {
    if (inView) {
      logPresetMediaInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    handleSetViewHeight();
    window.addEventListener('resize', handleSetViewHeight);
    return () => {
      window.removeEventListener('resize', handleSetViewHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <MediaAContent className="content-wrapper" ref={sectionRef} {...displayValues} isApp={isApp} isIOS={isIOS}>
          <div ref={contentRef} className="contents">
            <div
              className={classNames('sticky-wrapper', {
                'is-full-video': parallaxMode && backgroundMedia.type === MediaType.VIDEO,
              })}
            >
              <div
                className={`${parallaxMode ? 'full-view sticky' : 'view'}`}
                style={{
                  paddingTop: viewHeight,
                }}
              >
                <div
                  className={classNames('bg', {
                    'video-bg': backgroundMedia.type === MediaType.VIDEO,
                  })}
                >
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
                      {backgroundMedia.type === MediaType.VIDEO && (
                        <>
                          <Video
                            className={`video ${isAvailableVideo ? 'done' : ''}`}
                            ref={videoRef}
                            lazy
                            src={getImageLink(backgroundMedia.path)}
                            blurHash={backgroundMedia.blurHash}
                            loop
                            muted
                            playsInline
                            autoPlay
                            poster={isIOS ? '' : getImageLink(backgroundMedia.posterImage)}
                          />
                          {isShowPoster && (
                            <div className="video-poster">
                              <Image
                                src={getImageLink(backgroundMedia.posterImage)}
                                blurHash={backgroundMedia.blurHash}
                                lazy
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {errorMedia && <div className="overlay-error" />}
                </div>
                <ContentStyled {...styledOptions}>
                  {mainImage.path && (
                    <ObjectStyled {...styledOptions}>
                      <Image src={getImageLink(mainImage.path)} height="initial" lazy />
                    </ObjectStyled>
                  )}
                  {title.text && <TitleStyled {...styledOptions}>{nl2br(title.text)}</TitleStyled>}
                  {subTitle.text && <SubTitleStyled {...styledOptions}>{nl2br(subTitle.text)}</SubTitleStyled>}
                  {description.text && <DescStyled {...styledOptions}>{nl2br(description.text)}</DescStyled>}
                </ContentStyled>
              </div>
            </div>
          </div>
        </MediaAContent>
      )}
    </div>
  );
});
const MediaA = styled(MediaAComponent)``;
export default MediaA;

const MediaAContent = styled('div').attrs((props: MediaADisplayModel & { isIOS: boolean; isApp: boolean }) => props)`
  ${Image} {
    background: none;
  }

  & .contents {
    position: relative;

    .sticky-wrapper {
      position: relative;
      ${({ parallaxMode, isApp, isIOS }) => {
        if (parallaxMode) {
          if (isApp && isIOS) return `height: ${window.innerHeight * 2}px;`;
          const defaultHt = 200; // 기본 화면 뷰 2배
          return `
          height: ${defaultHt}vh;
        `;
        }
        return null;
      }}
      &.is-full-video {
        margin-top: -1px;
        margin-bottom: -1px;
      }
    }

    .full-view {
      width: 100%;
      height: 100vh;
    }

    .sticky {
      overflow: hidden;
      position: sticky;
      top: 0;
      left: 0;
    }

    .bg {
      position: relative;
      height: 100%;

      .video,
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: middle;
      }

      &.video-bg {
        width: 100%;
      }

      &.video-bg:after {
        ${({ isOverlay }) => {
          if (isOverlay) {
            return css`
              width: 100%;
            `;
          }
          return null;
        }}
      }

      .video {
        visibility: hidden;
        width: 100% !important;
        clip-path: inset(0px 0px);

        &.done {
          visibility: visible;
        }
      }

      .video-poster {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
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

    .view {
      overflow: hidden;
      position: relative;
      width: 100%;

      .bg {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
  }
`;

const ContentStyled = styled.div<MediaAParallaxStyledModel>`
  position: absolute;
  right: 0;
  left: 0;
  padding: 4.8rem 2.4rem;
  text-align: ${({ align }) => align};
  ${({ verticalAlign, parallaxMode }) => {
    // eslint-disable-next-line no-nested-ternary
    return verticalAlign === VerticalAlignType.CENTER
      ? `
          top: 50%;
          transform: translate(0, -50%);
        `
      : verticalAlign === VerticalAlignType.TOP
      ? `
          top: ${parallaxMode ? '5.6rem' : '0'}
        `
      : `
          bottom: ${parallaxMode ? '5.6rem' : '0'}
        `;
  }}
`;

const ObjectStyled = styled.div.attrs((props: MediaAParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0,${props.objectTranslateY}%, 0)`,
    opacity: `${props.objectOpacity}`,
  },
}))<MediaAParallaxStyledModel>`
  display: flex;
  justify-content: ${({ align }) => {
    switch (align) {
      case AlignType.LEFT:
        return 'flex-start';
      case AlignType.RIGHT:
        return 'flex-end';
      default:
        return 'center';
    }
  }};
  padding: 0 0.8rem;

  img {
    width: auto;
  }
`;

const TitleStyled = styled.div.attrs((props: MediaAParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0,${props.textEffect ? props.titleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.titleOpacity : 1}`,
  },
}))<MediaAParallaxStyledModel>`
  color: ${({ titleColor }) => titleColor};
  font: ${({ theme, titleSize }) =>
    titleSize === TextItemSizeType.LARGE
      ? theme.content.contentStyle.fontType.headlineB
      : theme.content.contentStyle.fontType.titleB};
  font-weight: ${({ theme, titleBold }) => (titleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

const SubTitleStyled = styled.div.attrs((props: MediaAParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0,${props.textEffect ? props.subTitleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.subTitleOpacity : 1}`,
  },
}))<MediaAParallaxStyledModel>`
  margin-top: 1.2rem;
  color: ${({ subTitleColor }) => subTitleColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
  font-weight: ${({ theme, subTitleBold }) => (subTitleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

const DescStyled = styled.div.attrs((props: MediaAParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0,${props.textEffect ? props.descTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.descOpacity : 1}`,
  },
}))<MediaAParallaxStyledModel>`
  margin-top: 3.2rem;
  color: ${({ descColor }) => descColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.small};
  font-weight: ${({ theme, descBold }) => (descBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;
