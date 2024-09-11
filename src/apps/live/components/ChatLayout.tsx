/* eslint-disable no-nested-ternary */
import React, { ReactNode, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Button } from '@pui/button';
import { AuctionMessage } from './AuctionMessage';
import { LiveDealGoods, SendBirdAdminMessageModel } from '../models';
import { LiveNotice } from '../types';
import { ActionButtonType, ActionButtonTypeButtonLabel, LiveActionType, ViewStatusType } from '../constants';
import { NoticeMessage } from './NoticeMessage';

interface Props {
  children: ReactNode;
  inputFocused?: boolean;
  inputAppendHeight?: number;
  lastAuctionMessage?: SendBirdAdminMessageModel | undefined;
  liveNotice?: LiveNotice | undefined;
  activeViewType: ActionButtonType | undefined;
  itemType: ActionButtonType;
  dealGoods: LiveDealGoods | undefined;
  uiView: ViewStatusType;
  isEllipsisNoticeMessage: boolean;
  chatAreaElement?: ReactNode;
  onUpdateEllipsis: () => void;
  onClickUserAction?: (path: LiveActionType) => (event: React.MouseEvent) => void;
}

/**
 * 채팅 layout
 */
export const ChatLayout = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      inputFocused = false,
      inputAppendHeight = 0,
      lastAuctionMessage,
      liveNotice,
      activeViewType,
      itemType,
      dealGoods,
      uiView,
      isEllipsisNoticeMessage,
      chatAreaElement,
      onClickUserAction: handleClickUserAction,
      onUpdateEllipsis: handleUpdateEllipsis,
    },
    chatAreaRef,
  ) => {
    const { isIOSWebChrome } = useDeviceDetect();
    const [animationName, setAnimationName] = useState<string>('default');
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;

    useEffect(() => {
      if (activeViewType) {
        if (activeViewType === itemType) {
          setAnimationName('slide-in');
        } else if (animationName === 'slide-in') {
          setAnimationName('slide-out');
        }
      }
    }, [activeViewType, animationName, itemType]);

    return (
      <ContainerStyled className={uiView}>
        <WrapperStyled
          className={`${isIOSWebChrome ? 'ios-chrome' : 'normal'} ${animationName}`}
          $focused={inputFocused}
          $inputAppendHeight={inputAppendHeight}
        >
          <WhiteSpaceStyled />
          <ChatArea className={isEllipsisNoticeMessage ? 'show' : 'hide'} ref={chatAreaRef} $focused={inputFocused}>
            <WhiteSpaceStyled />
            {children}
          </ChatArea>

          {itemType === ActionButtonType.CHAT && (
            <>
              {lastAuctionMessage && (
                <AuctionMessageStyled
                  className={isEllipsisNoticeMessage ? 'show' : 'hide'}
                  message={lastAuctionMessage.data.price ?? ''}
                  nickname={lastAuctionMessage.data.user?.nickname ?? ''}
                  profileUrl={lastAuctionMessage.data.user?.profileImage ?? ''}
                  backgroundColor={dealGoods?.bidColor}
                />
              )}
              {liveNotice && (
                <NoticeMessage
                  key={isPortrait ? 'portrait' : 'none-portrait'}
                  message={liveNotice.message}
                  profileUrl={liveNotice.showRoom.primaryImage.path ?? ''}
                  nickname={liveNotice.showRoom.name}
                  tintColor={liveNotice.showRoom.tintColor}
                  isEllipsisNoticeMessage={isEllipsisNoticeMessage}
                  onUpdateEllipsis={handleUpdateEllipsis}
                />
              )}
            </>
          )}

          {itemType &&
            (chatAreaElement || (
              <ButtonArea $full={!dealGoods}>
                <Button block size="medium" onClick={handleClickUserAction?.(LiveActionType.LIVE_AUCTION)}>
                  {ActionButtonTypeButtonLabel[itemType]}
                </Button>
              </ButtonArea>
            ))}
        </WrapperStyled>
      </ContainerStyled>
    );
  },
);

const fadeIn = keyframes`
  from { transform: translate3d(0, 110%, 0); }
  to { transform: translate3d(0, 0%, 0); }
`;
const fadeOut = keyframes`
  from { transform: translate3d(0, 0%, 0); }
  to { transform: translate3d(0, 110%, 0); }
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
  pointer-events: none;

  &.hide {
    animation: 200ms linear 0s normal forwards ${hide};
    pointer-events: none;
  }

  &.show {
    animation: 200ms linear 0s normal forwards ${show};
  }
`;

const WrapperStyled = styled.div<{ $focused: boolean; $inputAppendHeight: number }>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 6.4rem 1.6rem 0;
  transform: translate3d(0, 110%, 0);
  user-select: none;
  z-index: 2;
  perspective: 1000;
  backface-visibility: hidden;
  overflow: hidden;
  will-change: transform;
  ${({ theme }) => theme.mixin.safeArea('padding-bottom', 56)};

  &.normal {
    &.slide-in {
      animation: 350ms linear 0s normal forwards ${fadeIn};
    }

    &.slide-out {
      animation: 300ms linear 0s normal forwards ${fadeOut};
    }
  }

  &.ios-chrome {
    transition: transform 0.4s cubic-bezier(0.34, 0.13, 0.455, 0.955);
    &.slide-in {
      transform: translate3d(0, 0%, 0);
    }
    &.slide-out {
      transform: translate3d(0, 110%, 0);
    }
  }

  ${({ $focused, $inputAppendHeight }) =>
    $focused &&
    `
    height: calc(100% - ${$inputAppendHeight / 10}rem);
    margin-bottom: calc(0 + ${$inputAppendHeight / 10}rem);
    padding-top: 0;
  `}
`;

const WhiteSpaceStyled = styled.div`
  flex: 1 1 0;
  width: 100%;
`;

const ChatArea = styled.div<{ $focused: boolean }>`
  --chatbar-area-height: 7.2rem;
  --top-blank-height: 24rem;
  --top-blank-small-height: 16rem;

  display: flex;
  position: relative;
  flex-direction: column;
  width: calc(100% - 8rem);
  height: calc(100% - var(--chatbar-area-height) - var(--top-blank-height));
  overflow-y: hidden;

  @media screen and (max-device-height: 667px) {
    height: calc(100% - var(--chatbar-area-height) - var(--top-blank-small-height));
  }

  &.hide {
    animation: 200ms linear 0s normal forwards ${hide};
  }

  &.show {
    animation: 200ms linear 250ms normal both ${show};
  }

  ${({ $focused }) =>
    $focused &&
    `
    height: calc(100% - 7.2rem);
  `}
`;
const ButtonArea = styled.div<{ $full: boolean }>`
  width: ${({ $full }) => ($full ? '100%' : 'calc(100% - 8rem)')};
  padding: 1.6rem 0;
  box-sizing: border-box;

  > button {
    background-color: ${({ theme }) => theme.light.color.gray50};
    color: ${({ theme }) => theme.light.color.objectOnSurface};
    border-radius: ${({ theme }) => theme.radius.s8} !important;
  }
`;

const AuctionMessageStyled = styled(AuctionMessage)`
  max-width: calc(100% - 8rem);
  margin-top: 0.8rem;
  align-self: flex-start;

  &.hide {
    animation: 200ms linear 0s normal forwards ${hide};
  }

  &.show {
    animation: 200ms linear 250ms normal both ${show};
  }
`;
