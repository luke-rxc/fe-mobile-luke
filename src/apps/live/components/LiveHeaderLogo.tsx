import { Action } from '@pui/action';
import { SVG } from '@pui/svg';
import styled, { keyframes } from 'styled-components';
import { LiveHeaderAnimationStatus, LogEventTypes } from '../constants';
import { LiveTitleLogoModel } from '../models';

interface Props {
  animationStatus: LiveHeaderAnimationStatus;
  showroomName: string;
  showroomLink: string;
  liveTitleLogo: LiveTitleLogoModel;
  raffleWinner: boolean;
  onAnimateEnd: () => void;
  onClickShowroom: (logEventType: LogEventTypes, showroomLink: string) => () => Promise<void>;
}

/**
 * 라이브 헤더 로고 component
 */
export const LiveHeaderLogo = ({
  animationStatus,
  showroomName,
  showroomLink,
  liveTitleLogo,
  raffleWinner,
  onAnimateEnd: handleAnimateEnd,
  onClickShowroom: handleClickShowroom,
}: Props) => {
  const { primaryImage, secondaryImage } = liveTitleLogo;

  return (
    <LogoWrapperStyled>
      <Action is="button" onClick={handleClickShowroom(LogEventTypes.LogLiveTapShowroomOnTopbar, showroomLink)}>
        <LogoItemStyled
          className={`brand-logo ${animationStatus}`}
          raffleWinner={raffleWinner}
          onAnimationEnd={handleAnimateEnd}
        >
          <SVG className="brand-logo-image" src={primaryImage.path} aria-label={showroomName} />
        </LogoItemStyled>
        {secondaryImage && (
          <LogoItemStyled className={`sliding-logo ${animationStatus}`} raffleWinner={raffleWinner}>
            <SVG className="sliding-logo-image" src={secondaryImage.path} aria-label={showroomName} />
          </LogoItemStyled>
        )}
      </Action>
    </LogoWrapperStyled>
  );
};

const show = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const brandTransition = keyframes`
  0% { transform: translate3d(-50%, -50%, 0) scale3d(1,1,1); } // 0초
  15.79% { transform: translate3d(-50%, calc(-50% + 12px), 0) scale3d(0.875,0.875,1); z-index: 20;} // 0.3초
  36.84% { transform: translate3d(-50%, -50%, 0) scale3d(0.75,0.75,1); z-index: 10;} // 0.4초
  63.16% { transform: translate3d(-50%, -50%, 0) scale3d(0.75,0.75,1); z-index: 10;} // 0.5초
  78.95% { transform: translate3d(-50%, calc(-50% - 12px), 0) scale3d(0.875,0.875,1);  z-index: 20;} // 0.3초
  100% { transform: translate3d(-50%, -50%, 0) scale3d(1,1,1); z-index: 20;} // 0.4초
`;
const brandFade = keyframes`
  0% { opacity: 1; } // 0초
  21.05% { opacity: 0; } // 0.4초
  63.16% { opacity: 0; } // 0.5초
  84.21% { opacity: 1; } // 0.4초
  100% { opacity: 1; } // 0.3초
`;

const slidingTransition = keyframes`
  0% { transform: translate3d(-50%, -50%, 0) scale3d(0.75,0.75,1); z-index: 10;} // 0초
  15.79% { transform: translate3d(-50%, calc(-50% - 12px), 0) scale3d(0.875,0.875,1); z-index: 10;} // 0.3초
  36.84% { transform: translate3d(-50%, -50%, 0) scale3d(1,1,1); z-index: 20;} // 0.4초
  63.16% { transform: translate3d(-50%, -50%, 0) scale3d(1,1,1); z-index: 20;} // 0.5초
  78.95% { transform: translate3d(-50%, calc(-50% + 12px), 0) scale3d(0.875,0.875,1);  z-index: 10;} // 0.3초
  100% { transform: translate3d(-50%, -50%, 0) scale3d(0.75,0.75,1); z-index: 10;} // 0.4초
`;

const slidingFade = keyframes`
  0% { opacity: 0; } // 0초
  21.05% { opacity: 1; } // 0.4초
  63.16% { opacity: 1; } // 0.5초
  84.21% { opacity: 0; } // 0.4초
  100% { opacity: 0; } // 0.3초
`;

const LogoWrapperStyled = styled.div`
  position: relative;
  height: 3.2rem;
  user-select: none;
  a {
    &:active {
      opacity: 0.5;
    }
  }
`;

const LogoItemStyled = styled.div<{ raffleWinner: boolean }>`
  position: absolute;
  height: 3.2rem;
  top: 50%;
  left: calc(50% - 0.6rem);
  transform: translate3d(-50%, -50%, 0);
  will-change: transform, opacity;

  .brand-logo-image {
    width: auto;
    height: 3.2rem;
    max-width: 15.2rem;

    * {
      fill: ${({ theme, raffleWinner }) =>
        raffleWinner ? theme.light.color.black : theme.light.color.white} !important;
      transition: 0.3s fill linear;
    }
  }

  .sliding-logo-image {
    width: auto;
    height: 3.2rem;
    max-width: 15.2rem;

    * {
      fill: ${({ theme, raffleWinner }) =>
        raffleWinner ? theme.light.color.black : theme.light.color.white} !important;
      transition: 0.3s fill linear;
    }
  }

  &.init {
    opacity: 0;
  }

  &.brand-logo {
    z-index: 20;

    &.running {
      animation-name: ${brandTransition}, ${brandFade};
      animation-duration: 1.9s, 1.9s;
      animation-delay: 0, 0;
      animation-fill-mode: forwards, forwards;
      animation-timing-function: linear, ease-in-out;
    }

    &.fixed {
      animation: ${show};
      animation-duration: 0.4s;
    }
  }

  &.sliding-logo {
    z-index: 10;
    opacity: 0;

    &.running {
      animation-name: ${slidingTransition}, ${slidingFade};
      animation-duration: 1.9s, 1.9s;
      animation-delay: 0, 0;
      animation-fill-mode: forwards, forwards;
      animation-timing-function: linear, ease-in-out;
    }
  }
`;
