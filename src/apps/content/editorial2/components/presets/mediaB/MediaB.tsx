import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { useVideo } from '@features/videoPlayer/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { MediaType, TextItemSizeType } from '../../../constants';
import { useAnimationFrame, useIntersection } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  ContentLogInfoModel,
  MediaBDisplayModel,
  MediaBParallaxStyledModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getEasingValue } from '../../../utils';

const AnimationKey = {
  FRONT_IMAGE_TRANSLATE_Y: 'frontImageTranslateY', // 컨텐츠 Y위치 정보
  TITLE_TRANSLATE_Y: 'titleTranslateY', // 타이틀 Y위치 정보
  TITLE_OPACITY: 'titleOpacity', // 타이틀 투명도
  SUB_TITLE_TRANSLATE_Y: 'subTitleTranslateY', // 서브타이틀 Y위치 정보
  SUB_TITLE_OPACITY: 'subTitleOpacity', // 서브타이틀 투명도
  DESC_TRANSLATE_Y: 'descTranslateY', // description Y위치 정보
  DESC_OPACITY: 'descOpacity', // description 투명도
} as const;

/**
 * 패럴럭스 애니메이션 데이터
 */
const mediaBAnimation: AnimationSet[] = [
  {
    id: AnimationKey.FRONT_IMAGE_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.25,
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
        startRange: 0.15,
        endRange: 0.2,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.TITLE_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.15,
        endRange: 0.2,
        startValue: 80,
        endValue: 0,
      },
    ],
  },
  {
    id: AnimationKey.SUB_TITLE_OPACITY,
    animations: [
      {
        startRange: 0.18,
        endRange: 0.23,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.SUB_TITLE_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.18,
        endRange: 0.23,
        startValue: 80,
        endValue: 0,
      },
    ],
  },
  {
    id: AnimationKey.DESC_OPACITY,
    animations: [
      {
        startRange: 0.21,
        endRange: 0.28,
        startValue: 0,
        endValue: 1,
      },
    ],
  },
  {
    id: AnimationKey.DESC_TRANSLATE_Y,
    animations: [
      {
        startRange: 0.21,
        endRange: 0.28,
        startValue: 80,
        endValue: 0,
      },
    ],
  },
];

const MediaBComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as MediaBDisplayModel;
  const {
    backgroundInfo,
    backgroundMedia,
    isOverlay,
    frontImage,
    middleImage,
    align,
    textEffect = true,
    title,
    subTitle,
    description,
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
  const { isIOS, isApp } = useDeviceDetect();
  const { logPresetMediaInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const {
    sectionRef: contentRef,
    sectionElRef: contentElRef,
    inView: contentInView,
  } = useIntersection({ once: false });

  const [isAvailableVideo, setIsAvailableVideo] = useState(false); // 비디오 play 가능 체크
  const [isShowPoster, setIsShowPoster] = useState(true); // 비디오 포스터 노출
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

  // video player 처리
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

  const [styledOptions, setStyledOptions] = useState<MediaBParallaxStyledModel>({
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
    frontImageTranslateY: 100,
    titleOpacity: 0,
    titleTranslateY: 80,
    subTitleOpacity: 0,
    subTitleTranslateY: 80,
    descOpacity: 0,
    descTranslateY: 80,
    isOverlay,
  });

  const delayFrontImageYOffset = useRef<number>(0);
  const delayTitleOpacityOffset = useRef<number>(0);
  const delayTitleYOffset = useRef<number>(0);
  const delaySubTitleOpacityOffset = useRef<number>(0);
  const delaySubTitleYOffset = useRef<number>(0);
  const delayDescOpacityOffset = useRef<number>(0);
  const delayDescYOffset = useRef<number>(0);
  const loop = (animResultValue: AnimationSetForScroll[]) => {
    // front이미지 Y 포지션
    delayFrontImageYOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.FRONT_IMAGE_TRANSLATE_Y,
      delayFrontImageYOffset.current,
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
    // desc 투명도
    delayDescOpacityOffset.current = getEasingValue(
      animResultValue,
      AnimationKey.DESC_OPACITY,
      delayDescOpacityOffset.current,
    );
    // desc Y 포지션
    delayDescYOffset.current = getEasingValue(animResultValue, AnimationKey.DESC_TRANSLATE_Y, delayDescYOffset.current);

    setStyledOptions((prop: MediaBParallaxStyledModel) => {
      let option = {
        ...prop,
        frontImageTranslateY: delayFrontImageYOffset.current,
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

  // 애니메이션 실행
  useAnimationFrame({
    sectionRef: contentElRef,
    onRequestFrame: loop,
    animationData: mediaBAnimation,
  });

  useEffect(() => {
    if (backgroundMedia.type !== MediaType.VIDEO) return;
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

  return (
    <div ref={ref} {...props}>
      {visible && (
        <MediaBContent className="content-wrapper" ref={sectionRef} {...displayValues} isApp={isApp} isIOS={isIOS}>
          <div ref={contentRef} className="contents">
            <div
              className={classNames('sticky-wrapper', {
                'is-full-video': backgroundMedia.type === MediaType.VIDEO,
              })}
            >
              <div className="full-view sticky">
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
                  {middleImage.path && (
                    <div className="middle-wrapper">
                      <Image className="middle-image" src={getImageLink(middleImage.path)} lazy height="initial" />
                    </div>
                  )}
                  {frontImage.path && (
                    <FrontImageStyled {...styledOptions}>
                      <Image className="front-image" src={getImageLink(frontImage.path)} height="initial" lazy />
                    </FrontImageStyled>
                  )}
                  <div className="text-wrapper">
                    {title.text && (
                      <TitleStyled {...styledOptions} className="title">
                        {nl2br(title.text)}
                      </TitleStyled>
                    )}
                    {subTitle.text && (
                      <SubTitleStyled {...styledOptions} className="sub">
                        {nl2br(subTitle.text)}
                      </SubTitleStyled>
                    )}
                    {description.text && (
                      <DescStyled {...styledOptions} className="desc">
                        {nl2br(description.text)}
                      </DescStyled>
                    )}
                  </div>
                </ContentStyled>
              </div>
            </div>
          </div>
        </MediaBContent>
      )}
    </div>
  );
});
const MediaB = styled(MediaBComponent)``;
export default MediaB;

const MediaBContent = styled('div').attrs((props: MediaBDisplayModel & { isIOS: boolean; isApp: boolean }) => props)`
  ${Image} {
    background: none;
  }
  position: relative;
  background: ${({ backgroundInfo }) => backgroundInfo?.color};

  .sticky-wrapper {
    position: relative;
    ${({ isApp, isIOS }) => {
      if (isApp && isIOS) return `height: ${window.innerHeight * 2}px;`;
      const defaultHt = 200; // 기본 화면 뷰 2배
      return `
        height: ${defaultHt}vh;
      `;
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

    .video {
      visibility: hidden;
      width: 100% !important;

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
`;
const ContentStyled = styled.div<MediaBParallaxStyledModel>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 4.8rem 2.4rem 3.2rem;
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};

  img {
    vertical-align: middle;
  }

  .middle-wrapper {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: center;

    & .middle-image {
      line-height: initial;
    }

    img {
      width: auto;
    }
  }

  .text-wrapper {
    position: relative;
    z-index: 1;
    padding-top: 5.6rem;
  }

  .title + .sub {
    margin-top: 1.2rem;
  }

  .title + .desc {
    margin-top: 3.2rem;
  }

  .sub + .desc {
    margin-top: 3.2rem;
  }
`;

const FrontImageStyled = styled.div.attrs((props: MediaBParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0, ${props.frontImageTranslateY}%, 0)`,
  },
}))<MediaBParallaxStyledModel>`
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;

  & .front-image {
    line-height: initial;
  }

  img {
    width: auto;
  }
`;

const TitleStyled = styled.div.attrs((props: MediaBParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0, ${props.textEffect ? props.titleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.titleOpacity : 1}`,
  },
}))<MediaBParallaxStyledModel>`
  color: ${({ titleColor }) => titleColor};
  font: ${({ theme, titleSize }) =>
    titleSize === TextItemSizeType.LARGE
      ? theme.content.contentStyle.fontType.headlineB
      : theme.content.contentStyle.fontType.titleB};
  font-weight: ${({ theme, titleBold }) => (titleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

const SubTitleStyled = styled.div.attrs((props: MediaBParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0, ${props.textEffect ? props.subTitleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.subTitleOpacity : 1}`,
  },
}))<MediaBParallaxStyledModel>`
  color: ${({ subTitleColor }) => subTitleColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
  font-weight: ${({ theme, subTitleBold }) => (subTitleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

const DescStyled = styled.div.attrs((props: MediaBParallaxStyledModel) => ({
  style: {
    transform: `translate3d(0, ${props.textEffect ? props.descTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.descOpacity : 1}`,
  },
}))<MediaBParallaxStyledModel>`
  color: ${({ descColor }) => descColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.small};
  font-weight: ${({ theme, descBold }) => (descBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;
