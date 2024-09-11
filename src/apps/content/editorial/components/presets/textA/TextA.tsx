import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useVideo } from '@features/videoPlayer/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIntersection } from '@hooks/useIntersection';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import nl2br from '@utils/nl2br';
import { getImageLink } from '@utils/link';
import classNames from 'classnames';
import { MediaType, TypoItemSizeType } from '../../../constants';
import type { TextAComponentRefModel, TextAProps, TextAStyledProps, TypoItemModel } from '../../../models';
import { useLogService } from '../../../services';
import { AppearTransition } from '../AppearTransition';
import { ImageBox } from './ImageBox';
import { VideoBox } from './VideoBox';
import { TextAStyled, TextStyled } from './Styled';

export const TextA = forwardRef<TextAComponentRefModel, TextAProps>(
  (
    {
      className,
      align,
      textEffect = true,
      title1,
      title2,
      subTitle1,
      subTitle2,
      subTitle3,
      description,
      useMedia,
      mediaViewRatio,
      isMediaRound,
      media,
      visibleMediaMute,
      backgroundInfo,
      backgroundMedia,
      parallaxMode,
      useBackground,
      isOverlay,
      layoutMarginBottom = true,
      layoutMarginTop = true,
      contentInfo,
      visible,
    },
    ref,
  ) => {
    const { isIOS } = useDeviceDetect();
    const { logPresetTextInit, logPresetTextTabMute } = useLogService();
    const { inView, subscribe } = useIntersection();
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el
    const contentRef = useRef<HTMLDivElement>(null); // 컨텐츠 el
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const [styledOptions, setStyledOptions] = useState<TextAStyledProps>({
      background: {
        color: `${backgroundInfo?.color}`,
        type: backgroundInfo?.type,
      },
      align,
      contentHeight: 0,
      media: media
        ? {
            width: media?.width,
            height: media?.height,
          }
        : null,
      parallaxMode,
      isOverlay,
      layoutMarginBottom,
      layoutMarginTop,
      isMediaRound,
      useBackground,
    });
    const [isAvailableBgVideo, setIsAvailableBgVideo] = useState(false); // 비디오 play 가능 체크
    const [isShowPoster, setIsShowPoster] = useState(true); // 비디오 포스터 노출

    const {
      videoRef: videoBackgroundRef,
      handleVideoPlay,
      handleVideoReset,
    } = useVideo({
      videoEvents: {
        canplay: () => {
          if (isAvailableBgVideo) {
            return;
          }
          setIsAvailableBgVideo(true);
          // 비디오 재생가능 시점에서 1프레임 렌더링 될때 흰 여백을 보간하기 위한 타이밍 조절
          setTimeout(() => setIsShowPoster(false), 500);
        },
        error: () => {
          setErrorMedia(true);
        },
      },
    });

    const [mediaHeight, setMediaHeight] = useState<number>(0);
    const mediaRef = useCallback((el) => {
      if (!el) return;
      const element = el as HTMLDivElement;
      const width = element.offsetWidth;
      setMediaHeight(Math.floor((width * mediaViewRatio.height) / mediaViewRatio.width));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const handleTabedMuteState = useCallback(
      (state: boolean) => {
        logPresetTextTabMute(contentInfo, state);
      },
      [contentInfo, logPresetTextTabMute],
    );

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    useEffect(() => {
      window.requestAnimationFrame(() => {
        setStyledOptions((prev) => ({
          ...prev,
          contentHeight: contentRef.current?.offsetHeight ?? 0,
        }));
      });
    }, [contentRef]);

    /** 백그라운드 비디오 제어 */
    useEffect(() => {
      if (!visible) return;
      if (backgroundMedia.type !== MediaType.VIDEO) return;

      if (inView) {
        handleVideoPlay(true);
      } else {
        handleVideoReset(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

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
        logPresetTextInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <TextAStyled {...styledOptions}>
            <div ref={sectionRef}>
              {backgroundMedia.path && (
                <div className="sticky-wrap">
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
                              ref={videoBackgroundRef}
                              className={`video ${isAvailableBgVideo ? 'done' : ''}`}
                              poster={isIOS ? '' : getImageLink(backgroundMedia.posterImage)}
                              src={getImageLink(backgroundMedia.path)}
                              blurHash={backgroundMedia.blurHash}
                              lazy
                              playsInline
                              loop
                              muted
                              autoPlay
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
                </div>
              )}
              <div className="contents" ref={contentRef}>
                {(subTitle1.text || title1.text) && (
                  <div className="top-wrapper">
                    {subTitle1.text && (
                      <AppearTransition
                        transition={textEffect}
                        className={classNames('title-wrapper', 'subtitle1', {
                          'size-medium': !subTitle1?.sizeType || subTitle1.sizeType === TypoItemSizeType.MEDIUM,
                        })}
                      >
                        <TextStyled bold={subTitle1.bold} color={subTitle1.color}>
                          {nl2br(subTitle1.text)}
                        </TextStyled>
                      </AppearTransition>
                    )}

                    {title1.text && (
                      <AppearTransition
                        transition={textEffect}
                        className={classNames('title-wrapper', 'title1', {
                          'size-title': title1.sizeType === TypoItemSizeType.TITLE,
                          'size-headline': title1.sizeType === TypoItemSizeType.HEADLINE,
                        })}
                      >
                        <TextStyled bold={title1.bold} color={title1.color}>
                          {nl2br(title1.text)}
                        </TextStyled>
                      </AppearTransition>
                    )}
                  </div>
                )}
                {useMedia && (
                  <div className="middle-wrapper">
                    <AppearTransition transition className="media-wrapper">
                      <div className="media-view" ref={mediaRef} style={{ paddingTop: `${mediaHeight / 10}rem` }}>
                        {media.type === MediaType.IMAGE && <ImageBox media={media} />}
                        {media.type === MediaType.VIDEO && (
                          <VideoBox
                            media={media}
                            visibleMediaMute={visibleMediaMute}
                            onClickMuteState={handleTabedMuteState}
                          />
                        )}
                      </div>
                    </AppearTransition>
                  </div>
                )}

                {(subTitle2.text || title2.text || subTitle3.text) && (
                  <div className="bottom-wrapper">
                    {subTitle2.text && (
                      <AppearTransition
                        transition={textEffect}
                        className={classNames('title-wrapper', 'subtitle2', {
                          'size-medium': !subTitle2?.sizeType || subTitle2.sizeType === TypoItemSizeType.MEDIUM,
                        })}
                      >
                        <TextStyled bold={subTitle2.bold} color={subTitle2.color}>
                          {nl2br(subTitle2.text)}
                        </TextStyled>
                      </AppearTransition>
                    )}
                    {title2.text && (
                      <AppearTransition
                        transition={textEffect}
                        className={classNames('title-wrapper', 'title2', {
                          'size-title': title2.sizeType === TypoItemSizeType.TITLE,
                          'size-headline': title2.sizeType === TypoItemSizeType.HEADLINE,
                        })}
                      >
                        <TextStyled bold={title2.bold} color={title2.color}>
                          {nl2br(title2.text)}
                        </TextStyled>
                      </AppearTransition>
                    )}
                    {subTitle3.text && (
                      <AppearTransition
                        transition={textEffect}
                        className={classNames('title-wrapper', 'subtitle3', {
                          'size-medium': subTitle3.sizeType === TypoItemSizeType.MEDIUM,
                          'size-large': subTitle3.sizeType === TypoItemSizeType.LARGE,
                        })}
                      >
                        <TextStyled bold={subTitle3.bold} color={subTitle3.color}>
                          {nl2br(subTitle3.text)}
                        </TextStyled>
                      </AppearTransition>
                    )}
                  </div>
                )}
                {description.length > 0 && (
                  <div className="description-wrapper">
                    <>
                      {description.map((desc: TypoItemModel, idx: number) => (
                        <AppearTransition
                          className={classNames('desc-wrapper', {
                            'size-small': !desc?.sizeType || desc.sizeType === TypoItemSizeType.SMALL,
                            'size-mini': desc.sizeType === TypoItemSizeType.MINI,
                          })}
                          // eslint-disable-next-line react/no-array-index-key
                          key={`prg-${idx}`}
                          transition={textEffect}
                        >
                          <TextStyled className="desc" bold={desc.bold} color={desc.color}>
                            {nl2br(desc.text)}
                          </TextStyled>
                        </AppearTransition>
                      ))}
                    </>
                  </div>
                )}
              </div>
            </div>
          </TextAStyled>
        )}
      </div>
    );
  },
);
