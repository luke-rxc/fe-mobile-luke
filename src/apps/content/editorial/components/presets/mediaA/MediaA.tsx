import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import classnames from 'classnames';
import { useVideo } from '@features/videoPlayer/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIntersection } from '@hooks/useIntersection';
import { Video } from '@pui/video';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { MediaType } from '../../../constants';
import { useAnimationFrame } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  MediaAComponentRefModel,
  MediaAProps,
  MediaAStyledProps,
} from '../../../models';
import { useLogService } from '../../../services';
import { getEasingValue, getViewHeightForRatio } from '../../../utils';
import { ImageStyled as ImageComponent } from '../Image';
import { ContentStyled, DescStyled, SubTitleStyled, TitleStyled, MediaAStyled, ObjectStyled } from './Styled';

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

export const MediaA = forwardRef<MediaAComponentRefModel, MediaAProps>(
  (
    {
      className,
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

    const [styledOptions, setStyledOptions] = useState<MediaAStyledProps>({
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
      isApp,
      isIOS,
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
      delayDescYOffset.current = getEasingValue(
        animResultValue,
        AnimationKey.DESC_TRANSLATE_Y,
        delayDescYOffset.current,
      );

      setStyledOptions((prop: MediaAStyledProps) => {
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

    const { logPresetMediaInit } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    const [viewHeight, setViewHeight] = useState(0);
    // 고정 비율시 높이 설정
    const handleSetViewHeight = useCallback(() => {
      if (parallaxMode) return;

      const targetViewHeight = getViewHeightForRatio(390, 520);
      setViewHeight(targetViewHeight);
    }, [parallaxMode]);

    useEffect(() => {
      handleSetViewHeight();
      window.addEventListener('resize', handleSetViewHeight);
      return () => {
        window.removeEventListener('resize', handleSetViewHeight);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
      animationData: mediaAAnimation,
    });

    useEffect(() => {
      if (backgroundMedia.type !== MediaType.VIDEO || !visible) return;
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
          <MediaAStyled {...styledOptions}>
            <div ref={sectionRef}>
              <div
                className={classnames('sticky-wrapper', {
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
                    className={classnames('bg', {
                      'video-bg': backgroundMedia.type === MediaType.VIDEO,
                    })}
                  >
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
                    {mainImage.path && (
                      <ObjectStyled {...styledOptions}>
                        <ImageComponent src={getImageLink(mainImage.path)} height="initial" lazy />
                      </ObjectStyled>
                    )}
                    {title.text && <TitleStyled {...styledOptions}>{nl2br(title.text)}</TitleStyled>}
                    {subTitle.text && <SubTitleStyled {...styledOptions}>{nl2br(subTitle.text)}</SubTitleStyled>}
                    {description.text && <DescStyled {...styledOptions}>{nl2br(description.text)}</DescStyled>}
                  </ContentStyled>
                </div>
              </div>
            </div>
          </MediaAStyled>
        )}
      </div>
    );
  },
);
