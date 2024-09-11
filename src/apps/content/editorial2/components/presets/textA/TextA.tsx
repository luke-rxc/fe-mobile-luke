import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { useVideo } from '@features/videoPlayer/hooks';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { ContentsBackgroundType, MediaType, TypoItemSizeType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  PresetComponentModel,
  PresetRefModel,
  TextADisplayModel,
  TypoItemModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { AppearTransition } from '../AppearTransition';
import { ImageBox } from './ImageBox';
import { VideoBox } from './VideoBox';

const TextAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as TextADisplayModel;

  const {
    textEffect = true,
    title1,
    title2,
    subTitle1,
    subTitle2,
    subTitle3,
    description,
    useMedia,
    mediaViewRatio,
    media,
    visibleMediaMute,
    backgroundInfo,
    backgroundMedia,
    parallaxMode,
    useBackground,
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
  const { logPresetTextInit, logPresetTextTabMute } = useLogService();
  const { sectionRef, sectionElRef, inView } = useIntersection({ once: false });
  const { isIOS } = useDeviceDetect();
  const isSticky = useBackground && parallaxMode && backgroundInfo.type === ContentsBackgroundType.MEDIA;
  const contentElRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const [isAvailableBgVideo, setIsAvailableBgVideo] = useState(false); // 비디오 play 가능 체크
  const [isShowPoster, setIsShowPoster] = useState(true); // 비디오 포스터 노출
  const [mediaHeight, setMediaHeight] = useState<number>(0);
  const isFirstVisibleSection = useRef<boolean>(false);

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
        setTimeout(() => setIsShowPoster(false), 200);
      },
      error: () => {
        setErrorMedia(true);
      },
    },
  });
  const handleTapMute = (state: boolean) => {
    logPresetTextTabMute(contentLogInfo, state);
  };

  // 고정 비율시 높이 설정
  const handleSetViewHeight = () => {
    if (!contentElRef.current) return;
    setContentHeight(contentElRef.current.offsetHeight);
  };

  const mediaRef = useCallback((el) => {
    if (!el) return;
    const width = el.offsetWidth;
    setMediaHeight(Math.floor((width * mediaViewRatio.height) / mediaViewRatio.width));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleSetViewHeight();
    window.addEventListener('resize', handleSetViewHeight);
    return () => {
      window.removeEventListener('resize', handleSetViewHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (inView && isFirstVisibleSection.current === false) {
      isFirstVisibleSection.current = true;
      logPresetTextInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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

  useEffect(() => {
    if (sectionElRef.current) {
      const el = sectionElRef.current as HTMLDivElement;
      setContentHeight(el.offsetHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionElRef.current]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <TextAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div ref={sectionRef}>
            {backgroundMedia.path && (
              <div
                className={classNames('sticky-wrap', {
                  'is-sticky': isSticky,
                })}
                style={{
                  ...(isSticky && { height: contentHeight > window.innerHeight ? '100vh' : `${contentHeight}px` }),
                }}
              >
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
            <div
              className={classNames('contents', {
                'is-sticky': isSticky,
              })}
              style={{
                ...(isSticky && { marginTop: contentHeight > window.innerHeight ? '-100vh' : `-${contentHeight}px` }),
              }}
            >
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
                        <VideoBox media={media} visibleMediaMute={visibleMediaMute} onClickMuteState={handleTapMute} />
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
        </TextAContent>
      )}
    </div>
  );
});
const TextA = styled(TextAComponent)``;
export default TextA;

const TextAContent = styled('div').attrs((props: TextADisplayModel) => props)`
  position: relative;
  background-color: ${({ backgroundInfo }) => backgroundInfo.color};

  .sticky-wrap {
    &.is-sticky {
      overflow: hidden;
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
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

  .bg {
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
      vertical-align: middle;
      object-fit: cover;
    }

    .overlay-error {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
    }
  }

  .contents {
    overflow: hidden;
    position: relative;
    padding-top: ${({ layoutMarginTop }) => `${layoutMarginTop ? 4.8 : 0}rem`};
    padding-right: 2.4rem;
    padding-bottom: ${({ layoutMarginBottom }) => `${layoutMarginBottom ? 4.8 : 0}rem`};
    padding-left: 2.4rem;
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
    text-align: ${({ align }) => align};
    word-break: break-all;

    img {
      vertical-align: middle;
    }

    .title-wrapper {
      margin-top: 1.6rem;
      word-break: keep-all;

      &:first-child {
        margin-top: 0;
      }

      &.title1 {
        &.size-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title};
        }

        &.size-headline {
          font: ${({ theme }) => theme.content.contentStyle.fontType.headline};
        }
      }

      &.title2 {
        &.size-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title};
        }

        &.size-headline {
          font: ${({ theme }) => theme.content.contentStyle.fontType.headline};
        }
      }

      &.subtitle1 {
        &.size-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
        }
      }

      &.subtitle2 {
        &.size-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
        }
      }

      &.subtitle3 {
        &.size-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
        }

        &.size-large {
          font: ${({ theme }) => theme.content.contentStyle.fontType.large};
        }
      }
    }

    .top-wrapper + .middle-wrapper {
      margin-top: 2.4rem;
    }

    .top-wrapper + .bottom-wrapper {
      margin-top: 2.4rem;
    }

    .middle-wrapper + .bottom-wrapper {
      margin-top: 2.4rem;
    }

    .description-wrapper {
      margin-top: 1.6rem;
      word-break: keep-all;

      &:first-child {
        margin-top: 0;
      }
    }

    .subtitle1 + .title1 {
      margin-top: 0.4rem;
    }

    .subtitle2 + .title2 {
      margin-top: 1rem;
    }

    .subtitle2 + .subtitle3 {
      margin-top: 0.4rem;
    }

    .title2 + .subtitle3 {
      margin-top: 0.4rem;
    }

    .media-wrapper {
      margin-top: 1.6rem;
      margin-bottom: 2.4rem;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }

      & .media-view {
        overflow: hidden;
        position: relative;
        width: 100%;
        border-radius: ${({ theme, isMediaRound }) => isMediaRound && theme.radius.r8};

        & img,
        video {
          border-radius: ${({ theme, isMediaRound }) => isMediaRound && theme.radius.r8};
        }
      }
    }

    .desc-wrapper {
      margin-bottom: 1.6rem;

      &:last-child {
        margin-bottom: 0;
      }

      &.size-small {
        font: ${({ theme }) => theme.content.contentStyle.fontType.small};
      }

      &.size-mini {
        font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
      }
    }
  }
`;
const TextStyled = styled.p<{ bold: boolean; color: string }>`
  color: ${({ color }) => color};
  font-weight: ${({ theme, bold }) => (bold === true ? theme.fontWeight.bold : theme.fontWeight.regular)}!important;
`;
