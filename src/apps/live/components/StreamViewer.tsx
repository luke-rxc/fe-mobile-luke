import styled from 'styled-components';
import classNames from 'classnames';
import { LiveViewMode } from '../constants';
import { HLSPlayer, HLSPlayerProps } from './HLSPlayer';

interface Props extends HLSPlayerProps {
  className?: string;
  liveMode: LiveViewMode;
  height: number | null;
  inputFocused?: boolean;
}

export const StreamViewer = ({ className, liveMode, height, inputFocused = false, ...props }: Props) => {
  const { videoSize, isPortait, onToggleUiView: handleToggleUiView } = props;
  const show = liveMode === LiveViewMode.LIVE;

  return (
    <WrapperStyled
      className={classNames(className, { landscape: !isPortait })}
      $show={show}
      $inputFocused={inputFocused}
      $horizontalRatioVideo={videoSize?.horizontalRatioVideo || false}
      $isFoldTypeScreen={videoSize?.isFoldTypeScreen || false}
      $videoRatio={videoSize?.videoRatio || 0}
      height={height}
      onClick={handleToggleUiView}
    >
      {show && <HLSPlayer {...props} />}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{
  $show: boolean;
  $inputFocused: boolean;
  $horizontalRatioVideo: boolean;
  $isFoldTypeScreen: boolean;
  $videoRatio: number;
  height: Props['height'];
}>`
  position: relative;
  display: flex;
  width: 100%;
  ${({ height }) =>
    height
      ? `
      height: ${height}px;
  `
      : `
    height: calc(100vh - 5.6rem);
    height: calc(var(--vh, 1vh) * 100 - 5.6rem);
  `}
  justify-content: center;
  overflow: hidden;
  align-items: ${({ $inputFocused }) => ($inputFocused ? 'end' : 'center')};
  background-color: ${({ theme }) => theme.light.color.black};
  ${({ theme }) => theme.mixin.safeArea('padding-bottom')};

  ${({ $horizontalRatioVideo, $isFoldTypeScreen, $videoRatio, $inputFocused }) =>
    $horizontalRatioVideo
      ? `
    padding-top: 6.4rem;
    align-items: ${$inputFocused && !$isFoldTypeScreen ? 'center' : 'start'};
    background-color: transparent;

    @media screen and (min-width: 992px) {
      align-items: start;
    }

    &.landscape {
      height: calc(100vw * ${$videoRatio});
      padding-top: 0;

      video {
        height: 100%;
      }
    }
  `
      : `
    margin: 0 auto;
  `}

  video {
    position: relative;
    width: 100%;
    height: ${({ $videoRatio }) => `calc(100vw * ${$videoRatio})`};
    vertical-align: middle;
    visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};

    ${({ $horizontalRatioVideo, $videoRatio }) =>
      $horizontalRatioVideo &&
      `
        height: calc(100vw * ${$videoRatio});

        @media screen and (min-width: 992px) {
          height: calc(var(--vh, 1vh) * 100 * 1080 / 1920  * ${$videoRatio});
        }
      `}
  }
`;
