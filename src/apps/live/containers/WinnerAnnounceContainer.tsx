import classNames from 'classnames';
import styled from 'styled-components';
import { useWinnerAnnounce } from '../hooks';
import {
  FireworkLotties,
  WinnerAnnounce,
  WinnerAnnounceImage,
  WinnerAnnounceList,
  WinnerAnnounceVideo,
} from '../components';
import { LiveRaffleWinnerModel } from '../models';

interface Props {
  show: boolean;
  liveRaffleWinnerItem: LiveRaffleWinnerModel | null;
  onClose?: () => void;
}

export const WinnerAnnounceContainer = ({ show, liveRaffleWinnerItem, onClose: handleClose }: Props) => {
  if (!show || liveRaffleWinnerItem === null) {
    return null;
  }

  const { winnerList: list, goodsMedia, goodsImage } = liveRaffleWinnerItem;

  const {
    refs: { announceRef, scrollRef, draggingRef, contentRef },
    ready,
    closed,
    nickname,
    autoScroll,
    winnerList,
    duration,
    onScrollStop: handleScrollStop,
    onScrollStart: handleScrollStart,
  } = useWinnerAnnounce({
    list,
    onClose: handleClose,
  });

  const contentOffsetHeight = contentRef.current?.offsetHeight ?? 0;
  const contentOffsetWidth = contentRef.current?.offsetWidth ?? 0;

  return (
    <WinnerAnnounce ref={announceRef} isReady={ready} closed={closed}>
      <LottieWrapperStyled>
        <ContentWrapperStyled ref={scrollRef}>
          <ContentStyled ref={contentRef} className="content" offsetHeight={contentOffsetHeight} duration={duration}>
            <div
              className={classNames({
                'short-content': !autoScroll,
              })}
            >
              {goodsImage && <WinnerAnnounceImage goodsImage={goodsImage} />}
              {goodsMedia && (
                <WinnerAnnounceVideo
                  goodsMedia={goodsMedia}
                  onScrollStop={handleScrollStop}
                  onScrollStart={handleScrollStart}
                />
              )}
              <WinnerAnnounceList winnerList={winnerList} nickname={nickname} />
            </div>
          </ContentStyled>
        </ContentWrapperStyled>
        <FireworkLotties offsetWidth={contentOffsetWidth} />
        <GrabberStyled ref={draggingRef}>
          <div className="drag-bar" />
        </GrabberStyled>
      </LottieWrapperStyled>
    </WinnerAnnounce>
  );
};
const LottieWrapperStyled = styled.div`
  width: 100%;
  height: 29.2rem;
`;

const ContentWrapperStyled = styled.div`
  width: 100%;
  height: 28rem;
  mask-image: ${({ theme }) =>
    `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.light.color.white} 8.22%, ${theme.light.color.white} 79.52%, rgba(255, 255, 255, 0) 100%)`};
  overflow: hidden;
  overflow-y: auto;
  will-change: scroll-position;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ContentStyled = styled.div<{ offsetHeight: number; duration: number }>`
  padding: 0;
  ${({ offsetHeight }) =>
    offsetHeight &&
    offsetHeight <= 280 &&
    `
    height: 100%;
  `}

  .short-content {
    height: 100%;
    ${({ theme }) => theme.mixin.centerItem()};
    flex-direction: column;
  }
`;

const GrabberStyled = styled.div`
  width: 100%;
  height: 3.6rem;
  ${({ theme }) => theme.mixin.absolute({ b: 0 })};

  .drag-bar {
    width: 3.2rem;
    height: 0.5rem;
    background-color: ${({ theme }) => theme.light.color.gray20};
    border-radius: 0.3rem;
    margin: 2.4rem auto 0;
  }
`;
