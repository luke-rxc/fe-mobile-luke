import styled, { keyframes } from 'styled-components';
import { LiveContentsType } from '@constants/live';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import classNames from 'classnames';
import React from 'react';
import { ActionButtonType, LiveActionType, LiveViewMode } from '../constants';
import { DealGoods } from './DealGoods';
import { AuctionMessage } from './AuctionMessage';
import { DealMultiGoods } from './DealMultiGoods';
import { useDealBannerStatus } from '../hooks';
import { ReturnTypeUseLiveService } from '../services';

type Props = ReturnTypeUseLiveService['dealBanner'] & {
  activeViewType: ActionButtonType | undefined;
  inputFocused: boolean;
  onClickUserAction?: (path: LiveActionType) => (event: React.MouseEvent) => void;
};

export const DealBanner = React.memo(
  ({
    activeViewType,
    contentsType,
    dealGoodsItems,
    openningAuctionItem,
    lastAuctionMessage,
    uiView,
    inputFocused,
    liveMode,
    multiTypeContents,
    onClickShowGoodsList: handleClickShowGoodsList,
    onClickUserAction: handleClickUserAction,
  }: Props) => {
    if (!dealGoodsItems) {
      return null;
    }

    const { status } = useDealBannerStatus({ activeViewType, inputFocused });
    const { isIOSWebChrome } = useDeviceDetect();

    const className = classNames(`slide-${status}`, {
      preview: liveMode === LiveViewMode.PREVIEW,
      'ios-chrome': isIOSWebChrome,
      normal: !isIOSWebChrome,
    });

    if (multiTypeContents) {
      return (
        <ContainerStyled className={uiView}>
          <DealWrapperStyled className={className}>
            <ButtonStyled type="button" onClick={handleClickShowGoodsList}>
              <DealMultiGoods
                items={dealGoodsItems}
                openningAuctionItem={openningAuctionItem}
                isLiveViewMode={liveMode === LiveViewMode.LIVE}
              >
                {lastAuctionMessage && (
                  <AuctionMessageStyled
                    message={lastAuctionMessage.data.price ?? ''}
                    nickname={lastAuctionMessage.data.user?.nickname ?? ''}
                    profileUrl={lastAuctionMessage.data.user?.profileImage ?? ''}
                    backgroundColor={dealGoodsItems[LiveContentsType.AUCTION]?.bidColor ?? ''}
                    color={dealGoodsItems[LiveContentsType.AUCTION]?.textColor ?? ''}
                    width="1.6rem"
                    height="1.6rem"
                  />
                )}
              </DealMultiGoods>
            </ButtonStyled>
          </DealWrapperStyled>
        </ContainerStyled>
      );
    }

    const dealGoods = contentsType ? dealGoodsItems[contentsType] : null;

    if (!dealGoods) {
      return null;
    }

    const handleClick =
      contentsType === LiveContentsType.STANDARD
        ? handleClickShowGoodsList
        : handleClickUserAction?.(LiveActionType.LIVE_AUCTION);

    return (
      <ContainerStyled className={uiView}>
        <DealWrapperStyled className={className}>
          <ButtonStyled type="button" onClick={handleClick}>
            <DealGoods contentsType={contentsType} item={dealGoods}>
              {contentsType === LiveContentsType.AUCTION && lastAuctionMessage ? (
                <AuctionMessageStyled
                  message={lastAuctionMessage.data.price ?? ''}
                  nickname={lastAuctionMessage.data.user?.nickname ?? ''}
                  profileUrl={lastAuctionMessage.data.user?.profileImage ?? ''}
                  backgroundColor={dealGoods.bidColor ?? ''}
                  color={dealGoods.textColor ?? ''}
                  width="1.6rem"
                  height="1.6rem"
                />
              ) : null}
            </DealGoods>
          </ButtonStyled>
        </DealWrapperStyled>
      </ContainerStyled>
    );
  },
);

const slideIn = keyframes`
  from { transform: translateX(calc(100% - 9.6rem)); }
  to { transform: translateX(0); }
`;
const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(calc(100% - 9.6rem)); }
`;

const slideHide = keyframes`
  from { transform: translateX(calc(100% - 9.6rem)); }
  to { transform: translateX(calc(100%)); }
`;

const slideHideOut = keyframes`
  from { transform: translateX(calc(100%)); }
  to { transform: translateX(calc(100% - 9.6rem)); }
`;

const fadeIn = keyframes`
  from { transform: translateX(6.0rem); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const messageSlide = keyframes`
  from { transform: translateY(2.4rem); opacity: 0; }
  to{ transform: translateY(0); opacity: 1; }
`;

const show = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const hide = keyframes`
  from { opacity: 1 }
  to { opacity: 0 }
`;

const ContainerStyled = styled.div`
  &.hide {
    animation: linear 200ms normal forwards ${hide};
    pointer-events: none;
  }

  &.show {
    animation: linear 200ms normal forwards ${show};
  }
`;

const DealWrapperStyled = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 5.6rem;
  padding: 1.6rem;
  z-index: 3;
  perspective: 1000;
  backface-visibility: hidden;
  transform: translate3d(calc(100% - 9.6rem), 0, 0);
  will-change: transform, opacity;

  &.normal {
    &.slide-default {
      transform: translate3d(0, 0, 0);
    }

    &.slide-in {
      animation: 200ms linear 100ms normal both ${slideIn};
    }

    &.slide-out {
      animation: 200ms linear 100ms normal both ${slideOut};
    }

    &.slide-hide {
      animation: 250ms linear 0s normal forwards ${slideHide};
    }

    &.slide-hide-out {
      animation: 250ms linear 0s normal forwards ${slideHideOut};
    }

    &.preview {
      animation: 500ms linear 0s normal forwards ${fadeIn};
    }
  }

  &.ios-chrome {
    transition: all 0.4s cubic-bezier(0.34, 0.13, 0.455, 0.955);
    transform: translate3d(calc(100% - 9.6rem), 0, 0);
    opacity: 1;

    &.preview {
      animation: 500ms linear 0s normal forwards ${fadeIn};
    }

    &.slide-in {
      transform: translate3d(0, 0, 0);
    }

    &.slide-default {
      transform: translate3d(0, 0, 0);
    }

    &.slide-hide {
      transform: translate3d(calc(100%), 0, 0);
    }
  }
`;

const ButtonStyled = styled.button`
  width: 100%;
  height: auto;
  background-color: none;
  user-select: none;
`;

const AuctionMessageStyled = styled(AuctionMessage)`
  position: absolute;
  bottom: 0;
  padding: 0.3rem 0.4rem;
  border-radius: 0.4rem;
  opacity: 0.8;
  transform: translateY(2.4rem);

  animation: 300ms linear 450ms normal both ${messageSlide};
`;
