import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { ImageStatus, useImageLoader } from '@hooks/useImageLoader';
import { Conditional } from '@pui/conditional';
import { Empty } from '@pui/icon';
import { TransparentImageSource } from '@pui/image';
import { getBlurHashBase64 } from '@utils/blurHash';
import { getImageLink } from '@utils/link';
import { useAnimationFrame, useIntersection } from '../../../hooks';
import type {
  AnimationSet,
  AnimationSetForScroll,
  ContentLogInfoModel,
  PlayViewerDisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getFrameImagePath, getHeightForVideoFrame, getValidImageFrame, getViewHeightForRatio } from '../../../utils';

const AnimationKey = {
  IMAGE_FRAME: 'imageFrame', // 이미지 프레임 정보
} as const;

const PlayViewerComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as PlayViewerDisplayModel;
  // eslint-disable-next-line no-empty-pattern
  const { media, fullMode, mediaViewRatio } = displayValues;
  const { middlePath, totalFrames, fileName, blurHash, extension } = media;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetPlayViewerInit } = useLogService();
  const {
    sectionRef,
    sectionElRef,
    inView: inViewLoadBoundary,
  } = useIntersection({
    once: true,
    options: {
      rootMargin: `0px 0px ${window.innerHeight * 2}px 0px`,
    },
  });
  const { sectionRef: sectionInnerRef, inView } = useIntersection({ once: true });

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
  const isStartLoadImage = useRef<boolean>(true);
  const { preloadImages } = useImageLoader();
  const [isError, setIsError] = useState<boolean>(false);
  const [isReadyAnimationPlay, setIsReadyAnimationPlay] = useState<boolean>(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [activeFrame, setActiveFrame] = useState<number>(0);
  const blurHashImage = useMemo(() => {
    return (blurHash ? getBlurHashBase64(blurHash) : TransparentImageSource) as string;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 고정 비율시 높이 설정
  const handleSetViewHeight = () => {
    if (!mediaViewRatio || fullMode) return;
    const targetViewHeight = getViewHeightForRatio(mediaViewRatio.width, mediaViewRatio.height);
    setViewHeight(targetViewHeight);
  };

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

  // 애니메이션 실행
  useAnimationFrame({
    sectionRef: sectionElRef,
    onRequestFrame: loop,
    animationData: playViewerAnimation,
    viewRatio: fullMode ? 0 : 1,
    viewEndRatio: fullMode ? 0 : 1,
  });

  // 이미지 프리로드 처리
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewLoadBoundary]);

  useEffect(() => {
    if (inView) {
      logPresetPlayViewerInit(contentLogInfo);
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
        <PlayViewerContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div ref={sectionInnerRef}>
            <div
              className={classNames('sticky-wrapper', {
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
        </PlayViewerContent>
      )}
    </div>
  );
});
const PlayViewer = styled(PlayViewerComponent)``;
export default PlayViewer;
const PlayViewerContent = styled('div').attrs((props: PlayViewerDisplayModel) => props)`
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
    margin-bottom: -1px; /** bottom 흰라인 이슈 */
    &.is-full {
      margin-bottom: 0;
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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }

    & .image-error {
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
      background: ${({ theme }) => theme.color.gray8};
      color: ${({ theme }) => theme.color.gray20};
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
`;
