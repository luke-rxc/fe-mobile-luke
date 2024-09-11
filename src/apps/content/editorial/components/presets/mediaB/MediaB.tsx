import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import classnames from 'classnames';
import nl2br from '@utils/nl2br';
import { useVideo } from '@features/videoPlayer/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Video } from '@pui/video';
import { getImageLink } from '@utils/link';
import { useIntersection } from '@hooks/useIntersection';
import { MediaType } from '../../../constants';
import { useAnimationFrame } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  MediaBComponentRefModel,
  MediaBProps,
  MediaBStyledProps,
} from '../../../models';
import { useLogService } from '../../../services';
import { getEasingValue } from '../../../utils';
import { ImageStyled as ImageComponent } from '../Image';
import { MediaBStyled, ContentStyled, FrontImageStyled, TitleStyled, SubTitleStyled, DescStyled } from './Styled';

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

export const MediaB = forwardRef<MediaBComponentRefModel, MediaBProps>(
  (
    {
      className,
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
      contentInfo,
      visible,
    },
    ref,
  ) => {
    const { isIOS, isApp } = useDeviceDetect();
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el
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
          setTimeout(() => setIsShowPoster(false), 500);
        },
        error: () => setErrorMedia(true),
      },
    });
    const [styledOptions, setStyledOptions] = useState<MediaBStyledProps>({
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
      isApp,
      isIOS,
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
      delayDescYOffset.current = getEasingValue(
        animResultValue,
        AnimationKey.DESC_TRANSLATE_Y,
        delayDescYOffset.current,
      );

      setStyledOptions((prop: MediaBStyledProps) => {
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

    const { logPresetMediaInit } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));
    // 뷰포트 교차
    useEffect(() => {
      if (containerRef.current) {
        subscribe(containerRef.current, { threshold: 0.1 });
      }
    }, [containerRef, subscribe]);
    useEffect(() => {
      if (!visible) return;
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetMediaInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    // 애니메이션 실행
    useAnimationFrame({
      sectionRef,
      onRequestFrame: loop,
      animationData: mediaBAnimation,
    });

    useEffect(() => {
      if (backgroundMedia.type !== MediaType.VIDEO) return;
      if (inView) {
        handleVideoPlay(true);
      } else {
        handleVideoReset(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <MediaBStyled {...styledOptions}>
            <div ref={sectionRef}>
              <div
                className={classnames('sticky-wrapper', {
                  'is-full-video': backgroundMedia.type === MediaType.VIDEO,
                })}
              >
                <div className="full-view sticky">
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
                                <ImageComponent
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
                        <ImageComponent src={getImageLink(middleImage.path)} lazy height="initial" />
                      </div>
                    )}
                    {frontImage.path && (
                      <FrontImageStyled {...styledOptions}>
                        <ImageComponent
                          className="front-image"
                          src={getImageLink(frontImage.path)}
                          height="initial"
                          lazy
                        />
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
          </MediaBStyled>
        )}
      </div>
    );
  },
);
