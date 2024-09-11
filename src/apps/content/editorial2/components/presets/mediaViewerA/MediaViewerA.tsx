import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import type Swiper from 'swiper';
import type { VideoViewingTimeModel } from '@features/videoPlayer/models';
import { SwiperContainerProps, SwiperContainer, SwiperSlide } from '@pui/swiper';
import { LandingActionType, MediaType, OverlayColorTypes } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  DisplayMediaModel,
  LandingActionModel,
  MediaViewerACardItemModel,
  MediaViewerADisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { ImageBox } from './ImageBox';
import { VideoBox } from './VideoBox';

const MediaViewerAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as MediaViewerADisplayModel;
  const { controller, mediaViewRatio, mediaLists = [] } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    logPresetMediaViewerInit,
    logPresetMediaViewerSlide,
    logPresetMediaViewerVideoView,
    logPresetMediaViewerTab,
    logPresetMediaViewerTabMute,
  } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const prevSwiperRealIndex = useRef<number | null>(null);
  const swp = useRef<Swiper | null>(null);
  const [viewH, setViewH] = useState<number>(0);

  const handleSlideView = (swiper: Swiper) => {
    const isChangeIndex = prevSwiperRealIndex.current !== swiper.realIndex; // 중복 로깅 처리 방지
    if (isChangeIndex) {
      prevSwiperRealIndex.current = swiper.realIndex;
      // 뷰 노출 된 이후 로깅 처리
      logPresetMediaViewerSlide(contentLogInfo, swiper.realIndex);
    }
  };

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

  const handleViewingVideo = (viewingTime: VideoViewingTimeModel, idx: number) => {
    const { totalViewTime, isStartedPlay } = viewingTime;
    if (isStartedPlay && totalViewTime !== 0) {
      logPresetMediaViewerVideoView(contentLogInfo, totalViewTime, idx);
    }
  };

  const handleTapedMuteState = (state: boolean, idx: number) => {
    logPresetMediaViewerTabMute(contentLogInfo, idx, state);
  };

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
    const width = window.innerWidth;
    const height = Math.floor((width * mediaViewRatio.height) / mediaViewRatio.width);
    setViewH(height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <MediaViewerAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
                        onClickMuteState={(v: boolean) => handleTapedMuteState(v, index)}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </SwiperContainer>
        </MediaViewerAContent>
      )}
    </div>
  );
});
const MediaViewerA = styled(MediaViewerAComponent)``;
export default MediaViewerA;

const MediaViewerAContent = styled('div').attrs((props: MediaViewerADisplayModel) => props)`
  position: relative;
  background: ${({ theme }) => theme.color.gray8};

  & .media-wrapper {
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  ${VideoBox} {
    & .player.is-error:before {
      background: none;
    }
  }

  & .swiper-pagination:before {
    bottom: -10px;
  }
`;
