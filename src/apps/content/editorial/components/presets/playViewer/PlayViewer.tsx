import { useCallback, forwardRef, useImperativeHandle, useRef, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import { ImageStatus, useImageLoader } from '@hooks/useImageLoader';
import { useIntersection } from '@hooks/useIntersection';
import { Conditional } from '@pui/conditional';
import { Empty } from '@pui/icon';
import { TransparentImageSource } from '@pui/image';
import { getImageLink } from '@utils/link';
import { getBlurHashBase64 } from '@utils/blurHash';
import { useAnimationFrame } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  PlayViewerComponentRefModel,
  PlayViewerProps,
} from '../../../models';
import { useLogService } from '../../../services';
import { getFrameImagePath, getHeightForVideoFrame, getValidImageFrame, getViewHeightForRatio } from '../../../utils';

const AnimationKey = {
  IMAGE_FRAME: 'imageFrame', // 이미지 프레임 정보
} as const;

const PlayViewerComponent = forwardRef<PlayViewerComponentRefModel, PlayViewerProps>(
  ({ className, media, fullMode, mediaViewRatio, contentInfo, visible }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el

    const playViewerAnimation: AnimationSet[] = useMemo(
      () => [
        {
          id: AnimationKey.IMAGE_FRAME,
          animations: [
            {
              startRange: fullMode ? 0 : 0.25, // 풀모드 노출인 경우, 진행율 0~1내에 프레임 재생, 고정비율인 경우 진행율 0.25~0.75내에서 프레임 재생
              endRange: fullMode ? 1 : 0.75,
              startValue: 0,
              endValue: media.totalFrames - 1,
            },
          ],
        },
      ],
      [fullMode, media],
    );
    const { logPresetPlayViewerInit } = useLogService();
    const { inView: inViewLoadBoundary, subscribe } = useIntersection(); // 뷰포트 교차
    const { preloadImages } = useImageLoader();
    const { middlePath, totalFrames, fileName, blurHash, extension } = media;
    const [isReadyAnimationPlay, setIsReadyAnimationPlay] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [activeFrame, setActiveFrame] = useState<number>(0);
    const imageData = useRef<ImageStatus[]>([]);
    const imageUrls: string[] = useMemo(() => {
      const imgList = [...new Array(totalFrames)].map((_, index) => {
        return getFrameImagePath({
          frameNum: index,
          middlePath,
          fileName,
          extension,
        });
      });
      return imgList;
    }, [extension, fileName, middlePath, totalFrames]);
    const blurHashImage = useMemo(() => {
      return (blurHash ? getBlurHashBase64(blurHash) : TransparentImageSource) as string;
    }, [blurHash]);
    const isStartLoadImage = useRef<boolean>(true);

    const loop = useCallback(
      (animResultValue: AnimationSetForScroll[]) => {
        if (isError) return;
        // 이미지 애니메이션
        const imageFrameValues = animResultValue.find(
          (target: AnimationSetForScroll) => target.id === AnimationKey.IMAGE_FRAME,
        ) as AnimationSetForScroll;

        const currentFrame = Math.floor(imageFrameValues.value);
        const frame = getValidImageFrame(currentFrame, imageData.current);
        setActiveFrame(frame);
      },
      [isError],
    );

    const [inView, setInView] = useState(false); // 컴포넌트 뷰 노출
    const isFirstVisibleSection = useRef<boolean>(false); // 컴포넌트 최초 노출 여부
    const observer = useRef<IntersectionObserver | null>(null);
    const sectionInnerRef = useCallback((el) => {
      if (!el || observer.current) return;
      observer.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry: IntersectionObserverEntry) => setInView(entry.isIntersecting));
        },
        { rootMargin: `0px 0px 0px 0px`, threshold: 0 },
      );
      observer.current.observe(el);
    }, []);

    // 애니메이션 실행
    useAnimationFrame({
      sectionRef,
      onRequestFrame: loop,
      animationData: playViewerAnimation,
      viewRatio: fullMode ? 0 : 1,
      viewEndRatio: fullMode ? 0 : 1,
    });

    const [viewHeight, setViewHeight] = useState(0);
    // 고정 비율시 높이 설정
    const handleSetViewHeight = useCallback(() => {
      if (!mediaViewRatio || fullMode) return;

      const targetViewHeight = getViewHeightForRatio(mediaViewRatio.width, mediaViewRatio.height);
      setViewHeight(targetViewHeight);
    }, [fullMode, mediaViewRatio]);

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
        logPresetPlayViewerInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    useEffect(() => {
      if (sectionRef.current) {
        // 영역 노출전 미리 이미지 로드를 위해 rootMargin 값 처리
        const rootMargin = `0px 0px ${window.innerHeight * 2}px 0px`;
        subscribe(sectionRef.current, {
          rootMargin,
          threshold: 0,
        });
      }
    }, [sectionRef, subscribe]);

    useEffect(() => {
      if (!inViewLoadBoundary) return;

      if (isStartLoadImage.current) {
        preloadImages(imageUrls).then((value) => {
          imageData.current = [...value];
          const successList = value.filter((img) => img.status === 'success');
          setIsError(successList.length === 0);
          setIsReadyAnimationPlay(true);
        });
      }
      isStartLoadImage.current = false;
    }, [contentInfo, imageUrls, inViewLoadBoundary, logPresetPlayViewerInit, preloadImages]);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div ref={sectionRef}>
            <div ref={sectionInnerRef}>
              <div
                className={classnames('sticky-wrapper', {
                  'is-full': fullMode,
                })}
              >
                <div
                  className={`${fullMode ? 'full-view sticky' : 'view'}`}
                  style={{
                    paddingTop: viewHeight,
                  }}
                >
                  <div className="bg">
                    <Conditional
                      condition={!isReadyAnimationPlay || (isReadyAnimationPlay && isError)}
                      trueExp={
                        <>
                          {/* 섬네일로 쓰일 이미지 */}
                          <img src={blurHashImage} alt="" />
                          {isReadyAnimationPlay && isError && (
                            <span className="image-error">
                              <Empty aria-label="이미지 로드 실패" size="4.8rem" />
                            </span>
                          )}
                        </>
                      }
                      falseExp={
                        <>
                          {imageUrls.map((url, index) => {
                            return (
                              <img
                                src={getImageLink(url)}
                                alt=""
                                key={url}
                                style={{ display: `${activeFrame === index ? 'block' : 'none'}` }}
                              />
                            );
                          })}
                        </>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export const PlayViewer = styled(PlayViewerComponent)`
  position: relative;
  .sticky-wrapper {
    position: relative;
    ${({ fullMode, media }) => {
      if (fullMode) {
        const defaultHt = 200; // 기본 화면 뷰 2배
        return `
          height: ${getHeightForVideoFrame(media.duration, defaultHt)}vh;
        `;
      }
      return null;
    }}
    margin-bottom: -1px; // bottom 흰라인 이슈
    &.is-full {
      margin-bottom: 0;
    }
  }

  .full-view {
    width: 100%;
    height: 100vh;
  }
  .sticky {
    position: sticky;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .bg {
    position: relative;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }

    & .image-error {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: inherit;
      color: ${({ theme }) => theme.color.gray20};
      background: ${({ theme }) => theme.color.gray8};
    }
  }

  .view {
    position: relative;
    overflow: hidden;
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
`;
