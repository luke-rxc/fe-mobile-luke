import { forwardRef, useEffect, useRef, useImperativeHandle, useCallback, useState } from 'react';
import styled from 'styled-components';
import type Swiper from 'swiper';
import type { VideoViewingTimeModel } from '@features/videoPlayer/models';
import { useIntersection } from '@hooks/useIntersection';
import { SwiperContainerProps, SwiperContainer, SwiperSlide } from '@pui/swiper';
import { LandingActionType, MediaType } from '../../../constants';
import type {
  DisplayMediaModel,
  LandingActionModel,
  MediaViewerACardItemModel,
  MediaViewerAComponentRefModel,
  MediaViewerAProps,
} from '../../../models';
import { useLogService } from '../../../services';
import { ImageBox } from './ImageBox';
import { VideoBox } from './VideoBox';

const OverlayColorTypes = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
  NONE: '',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
type OverlayColorTypes = typeof OverlayColorTypes[keyof typeof OverlayColorTypes];

const MediaViewerAComponent = forwardRef<MediaViewerAComponentRefModel, MediaViewerAProps>(
  ({ className, controller, mediaViewRatio, mediaLists = [], contentInfo, visible }, ref) => {
    const {
      logPresetMediaViewerInit,
      logPresetMediaViewerSlide,
      logPresetMediaViewerVideoView,
      logPresetMediaViewerTab,
      logPresetMediaViewerTabMute,
    } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const swp = useRef<Swiper | null>(null);
    const [viewH, setViewH] = useState<number>(0);
    const prevSwiperRealIndex = useRef<number | null>(null);

    const handleSlideView = useCallback(
      (swiper: Swiper) => {
        const isChangeIndex = prevSwiperRealIndex.current !== swiper.realIndex; // 중복 로깅 처리 방지
        if (isFirstVisibleSection.current && isChangeIndex) {
          prevSwiperRealIndex.current = swiper.realIndex;
          // 뷰 노출 된 이후 로깅 처리
          logPresetMediaViewerSlide(contentInfo, swiper.realIndex);
        }
      },
      [contentInfo, logPresetMediaViewerSlide],
    );
    const swiperOption = useRef<SwiperContainerProps>({
      pagination: {
        type: 'bullets',
        clickable: true,
      },
      loop: mediaLists.length > 1,
      controlTheme: {
        ...(controller?.bulletColor && { color: controller.bulletColor }),
        paginationOverlay:
          // eslint-disable-next-line no-nested-ternary
          controller?.background === OverlayColorTypes.BLACK
            ? 'black'
            : controller?.background === OverlayColorTypes.WHITE
            ? 'white'
            : '',
      },
      touchReleaseOnEdges: mediaLists.length === 1,
      onSlideChange: handleSlideView,
      onSwiper: (swiper: Swiper) => {
        swp.current = swiper;
      },
    });

    const handleViewingVideo = useCallback(
      (viewingTime, idx: number) => {
        const { totalViewTime, isStartedPlay } = viewingTime;
        if (isStartedPlay && totalViewTime !== 0) {
          logPresetMediaViewerVideoView(contentInfo, totalViewTime, idx);
        }
      },
      [contentInfo, logPresetMediaViewerVideoView],
    );

    const handleTabedMuteState = useCallback(
      (state: boolean, idx: number) => {
        logPresetMediaViewerTabMute(contentInfo, idx, state);
      },
      [contentInfo, logPresetMediaViewerTabMute],
    );

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
      const width = window.innerWidth;
      const height = Math.floor((width * mediaViewRatio.height) / mediaViewRatio.width);
      setViewH(height);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div className="viewer">
            <SwiperContainer {...swiperOption.current}>
              {mediaLists.map((mediaItem: MediaViewerACardItemModel, index) => {
                const {
                  id,
                  type,
                  actions = { actionType: LandingActionType.NONE, value: '' },
                  visibleMediaMute,
                  ...mediaRest
                } = mediaItem;
                const media = { ...mediaRest } as DisplayMediaModel;
                return (
                  <SwiperSlide key={id}>
                    <div
                      className="media-wrapper"
                      style={{
                        paddingTop: `${viewH}px`,
                      }}
                    >
                      {type === MediaType.IMAGE && (
                        <ImageBox
                          actions={actions}
                          media={media}
                          viewerRatio={mediaViewRatio}
                          onActions={() => {
                            handleAction(actions, index);
                          }}
                        />
                      )}
                      {type === MediaType.VIDEO && (
                        <VideoBox
                          media={media}
                          visibleMediaMute={visibleMediaMute}
                          viewerRatio={mediaViewRatio}
                          outViewInitialMuted={mediaLists.length > 1}
                          onViewingTime={(v: VideoViewingTimeModel) => handleViewingVideo(v, index)}
                          onClickMuteState={(v: boolean) => handleTabedMuteState(v, index)}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </SwiperContainer>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 미디어 뷰어 A 컴포넌트
 */
export const MediaViewerA = styled(MediaViewerAComponent)`
  & .viewer {
    position: relative;
    background: ${({ theme }) => theme.color.gray8};

    ${VideoBox} {
      & .player.is-error:before {
        background: none;
      }
    }
    & .swiper-pagination:before {
      bottom: -10px;
    }
  }

  & .media-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
`;
