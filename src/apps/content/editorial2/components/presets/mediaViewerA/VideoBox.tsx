import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { VideoPlayer } from '@features/videoPlayer/components';
import type { VideoViewingTimeModel } from '@features/videoPlayer/models';
import { getImageLink } from '@utils/link';
import { MediaViewerRatio } from '../../../constants';
import type { DisplayMediaModel } from '../../../models';

export type VideoBoxProps = HTMLAttributes<HTMLDivElement> & {
  /** 미디어 정보 */
  media: DisplayMediaModel;
  /** 음소거 버튼 노출 여부 */
  visibleMediaMute: boolean;
  /** 뷰어 사이즈 */
  viewerRatio: MediaViewerRatio;
  /** 뷰포트 포함되지 않을때 음소거 초기화 여부 */
  outViewInitialMuted?: boolean;
  /** 비디오 체류 cb */
  onViewingTime: (v: VideoViewingTimeModel) => void;
  /** 음소거 클릭 */
  onClickMuteState: (state: boolean) => void;
};

const VideoBoxComponent = forwardRef<HTMLDivElement, VideoBoxProps>(
  ({ className, media, visibleMediaMute, viewerRatio, outViewInitialMuted, onViewingTime, onClickMuteState }, ref) => {
    const videoInfo: {
      videoW: number;
      videoH: number;
      centerX: number;
      centerY: number;
    } = useMemo(() => {
      // 기기에 따라 소수점 렌더 처리 될 경우, 흰 라인 발생 이슈로 정수로 처리
      const viewerWidth = window.innerWidth;
      const viewerHeight = Math.floor((viewerWidth * viewerRatio.height) / viewerRatio.width);
      const videoHeight = (media.height * viewerWidth) / media.width;

      let targetW = 0;
      let targetH = 0;
      let centerX = 0;
      let centerY = 0;
      if (viewerHeight > videoHeight) {
        targetW = Math.round((media.width * viewerHeight) / media.height);
        targetH = viewerHeight;
        centerX = Math.floor((targetW - viewerWidth) / 2) * -1;
      } else {
        targetW = viewerWidth;
        targetH = Math.round(videoHeight);
        centerY = Math.floor((targetH - viewerHeight) / 2) * -1;
      }

      return {
        videoW: targetW,
        videoH: targetH,
        centerX,
        centerY,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={className} ref={ref}>
        <VideoPlayerStyled {...videoInfo}>
          <VideoPlayer
            video={{
              src: getImageLink(media.path),
              poster: getImageLink(media?.posterImage),
              width: media.width,
              height: media.height,
              loop: true,
              autoPlay: true,
            }}
            threshold={0.2}
            lazy={false}
            usableMuteButton={visibleMediaMute}
            forceLoadVideo
            outViewInitialMuted={outViewInitialMuted}
            onViewingTime={onViewingTime}
            onClickMutedState={onClickMuteState}
          />
        </VideoPlayerStyled>
      </div>
    );
  },
);

/**
 * 비디오 뷰 컴포넌트
 */
export const VideoBox = styled(VideoBoxComponent)`
  ${VideoPlayer} {
    position: absolute;
    top: 50%;
    left: 0;
    height: 100%;
    transform: translateY(-50%);

    & .player {
      overflow: hidden;
      position: absolute;
      z-index: 0;
      height: 100%;
      inset: 0px;

      &.is-error {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
`;

export const VideoPlayerStyled = styled.div.attrs(
  ({ videoW, videoH, centerX, centerY }: { videoW: number; videoH: number; centerX: number; centerY: number }) => {
    return {
      videoW,
      videoH,
      centerX,
      centerY,
    };
  },
)`
  & .player .video-poster {
    width: ${({ videoW }) => `${videoW / 10}rem`};
    height: ${({ videoH }) => `${videoH / 10}rem`};
    transform: ${({ centerX, centerY }) => `translate3d(${centerX / 10}rem,${centerY / 10}rem, 0rem)`};
  }

  & video {
    position: relative;
    width: ${({ videoW }) => `${videoW / 10}rem`};
    height: ${({ videoH }) => `${videoH / 10}rem`};
    transform: ${({ centerX, centerY }) => `translate3d(${centerX / 10}rem,${centerY / 10}rem, 0rem)`};
    object-fit: cover;
    vertical-align: top;
  }
`;
