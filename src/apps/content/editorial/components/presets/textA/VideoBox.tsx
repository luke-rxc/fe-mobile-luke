import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { VideoPlayer } from '@features/videoPlayer/components';
import { getImageLink } from '@utils/link';
import type { DisplayMediaModel } from '../../../models';

export type VideoBoxProps = HTMLAttributes<HTMLDivElement> & {
  /** 미디어 정보 */
  media: DisplayMediaModel;
  /** 음소거 버튼 노출 여부 */
  visibleMediaMute: boolean;
  /** 음소거 클릭 */
  onClickMuteState?: (state: boolean) => void;
};

const VideoBoxComponent = forwardRef<HTMLDivElement, VideoBoxProps>(
  ({ className, media, visibleMediaMute, onClickMuteState = () => {} }, ref) => {
    return (
      <div className={className} ref={ref}>
        <div className="media-box">
          <VideoPlayer
            video={{
              src: getImageLink(media.path),
              poster: getImageLink(media?.posterImage),
              width: media.width,
              height: media.height,
              loop: true,
              autoPlay: true,
            }}
            threshold={0.1}
            lazy={false}
            forceLoadVideo
            usableMuteButton={visibleMediaMute}
            onClickMutedState={onClickMuteState}
          />
        </div>
      </div>
    );
  },
);

/**
 * 비디오 뷰
 */
export const VideoBox = styled(VideoBoxComponent)`
  ${VideoPlayer} {
    position: absolute;
    top: 50%;
    height: 100%;
    left: 0;
    transform: translateY(-50%);

    & .player {
      position: absolute;
      inset: 0px;
      z-index: 0;
      height: 100%;
      overflow: hidden;
      &.is-error {
        transform: translateY(-50%);
        top: 50%;
      }
      & video {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: middle;
      }
    }
  }
`;
