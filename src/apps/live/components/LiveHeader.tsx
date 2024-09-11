import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { LiveHeaderAnimationStatus, LogEventTypes } from '../constants';
import { LiveHeaderLogo } from './LiveHeaderLogo';
import { ReturnTypeUseLiveService } from '../services';

type Props = ReturnTypeUseLiveService['header'] & {
  children?: ReactNode;
  show?: boolean;
  animationStatus: LiveHeaderAnimationStatus;
  raffleWinner: boolean;
  onAnimateEnd: () => void;
};

export const LiveHeader = ({
  showroom,
  children,
  uiView,
  show = true,
  raffleWinner,
  liveTitleLogo,
  handleClickShowroom,
  ...props
}: Props) => {
  if (!(showroom && liveTitleLogo)) {
    return null;
  }

  const { getLink } = useLink();

  const showroomLink = getLink(UniversalLinkTypes.SHOWROOM, { showroomCode: showroom?.code || '' });
  const profileProps: ProfilesProps = {
    showroomCode: showroom?.code || '',
    liveId: null,
    image: {
      src: showroom?.primaryImage.path,
    },
    size: 44,
    status: 'live',
  };

  return (
    <HeaderWrapperStyled $show={show} raffleWinner={raffleWinner} className={uiView}>
      <ContainerStyled>
        <ContentStyled className="profile">
          <Action is="button" onClick={handleClickShowroom(LogEventTypes.LogLiveTapShowroom, showroomLink)}>
            <Profiles {...profileProps} disabledLink />
          </Action>
          <ShowroomNameStyled>{showroom?.name}</ShowroomNameStyled>
        </ContentStyled>
        <ContentStyled className="logo">
          <LiveHeaderLogo
            {...props}
            showroomName={showroom?.name || ''}
            showroomLink={showroomLink}
            liveTitleLogo={liveTitleLogo}
            raffleWinner={raffleWinner}
            onClickShowroom={handleClickShowroom}
          />
        </ContentStyled>
        <ContentStyled className="mute">{children}</ContentStyled>
      </ContainerStyled>
    </HeaderWrapperStyled>
  );
};

const fadeout = keyframes`
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
`;

const show = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const hide = keyframes`
  0% { opacity: 1 }
  100% { opacity: 0 }
`;

const HeaderWrapperStyled = styled.div<{ $show: boolean; raffleWinner: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.6rem 1rem 1rem;
  box-sizing: border-box;
  z-index: 4;
  user-select: none;
  ${({ raffleWinner }) =>
    !raffleWinner && 'background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'};

  ${({ theme }) => theme.mediaQuery.md} {
    position: absolute;
  }

  ${({ $show }) =>
    !$show &&
    `
    visibility: hidden;
  `}

  &.hide {
    animation: ${hide} 0.2s both;
    pointer-events: none;
  }

  &.show {
    animation: ${show} 0.2s both;
  }
`;

const ContainerStyled = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const ContentStyled = styled.div`
  position: relative;

  &.profile {
    flex-shrink: 0;
    width: 4.4rem;
  }

  &.logo {
    flex-grow: 1;
  }

  &.mute {
    flex-shrink: 0;
    width: 3.2rem;
  }

  > div > a {
    -webkit-tap-highlight-color: transparent;
  }

  span.profile {
    > div {
      background-color: ${({ theme }) => theme.light.color.black};

      > div.mediaBox {
        > span {
          background-color: ${({ theme }) => theme.light.color.black};
        }
      }
    }
  }
`;

const ShowroomNameStyled = styled.span`
  position: absolute;
  min-width: 200px;
  left: 0;
  top: 50%;
  transform: translate3d(4.6rem, -50%, 0);
  color: ${({ theme }) => theme.light.color.white};
  opacity: 0;
  animation: ${fadeout};
  animation-duration: 2s;
  text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);
`;
