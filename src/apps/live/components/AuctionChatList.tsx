import React, { useLayoutEffect, useRef, useContext, useState } from 'react';

import {
  ListChildComponentProps,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
  VariableSizeList as List,
} from 'react-window';
import styled from 'styled-components';
import classNames from 'classnames';
import { LiveDealGoods, SendBirdAdminMessageModel } from '../models';
import { AuctionMessage } from './AuctionMessage';
import { ChatItemSizer } from './ChatItemSizer';
import { ReturnTypeUseLiveChatService } from '../services/useLiveChatService';
import { ActionButtonType, CHATAREA_SCROLL_HEIGHT_OFFSET } from '../constants';
import { ChatContext } from '../contexts/ChatContext';

interface Props {
  activeViewType: ActionButtonType | undefined;
  auctionListItem: ReturnTypeUseLiveChatService['auctionListItem'];
  messages: Array<SendBirdAdminMessageModel>;
  dealGoods: LiveDealGoods | undefined;
  onUpdateMessageScrollRef: ReturnTypeUseLiveChatService['handleUpdateMessageScrollRef'];
  onUpdateShowLastMessage: ReturnTypeUseLiveChatService['handleUpdateShowLastMessage'];
}

const Row = (
  props: React.PropsWithChildren<
    ListChildComponentProps<unknown> & {
      children?: React.ReactNode;
    }
  >,
) => {
  const { bidColor, listAreaWidth, updateChatItemHeight } = useContext(ChatContext);
  const { style, index, data: messages } = props;
  const overrideStyled = {
    ...style,
    top: Number(style.top) + 2,
    height: Number(style.height) - 4,
  };

  const {
    messageId,
    data: { user, price },
  } = (messages as Array<SendBirdAdminMessageModel>)[index];

  return (
    <div style={overrideStyled} key={messageId}>
      <ChatItemSizer parentWidth={listAreaWidth} index={index} updateChatItemHeight={updateChatItemHeight}>
        <AuctionMessageStyled
          message={price ?? ''}
          nickname={user?.nickname ?? ''}
          profileUrl={user?.profileImage ?? ''}
          backgroundColor={index === (messages as Array<SendBirdAdminMessageModel>).length - 1 ? bidColor : undefined}
          $last={index === (messages as Array<SendBirdAdminMessageModel>).length - 1}
        />
      </ChatItemSizer>
    </div>
  );
};

/**
 * 경매 채팅 리스트
 */
const InnerAuctionChatList: React.ForwardRefRenderFunction<List, Props> = (
  {
    activeViewType,
    messages,
    dealGoods,
    auctionListItem: {
      listAreaWidth,
      listAreaHeight,
      getListItemHeight,
      setListItemHeight,
      toMessageScrollBottom,
      isMessageScrollTop,
      onScroll: handleScroll,
    },
    onUpdateMessageScrollRef: handleUpdateMessageScrollRef,
    onUpdateShowLastMessage: handleUpdateShowLastMessage,
  },
  ref,
) => {
  const outerRef = useRef<HTMLElement>(null);
  const loadRef = useRef<boolean>(false);
  const hideMask = messages.length === 1 || listAreaHeight > (outerRef.current?.scrollHeight || 0);
  const [isBottom, setIsBottom] = useState<boolean>(true);
  const prevBottomRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (!loadRef.current && activeViewType === ActionButtonType.AUCTION && messages.length > 0) {
      loadRef.current = true;
      setTimeout(() => {
        toMessageScrollBottom(messages.length);
      }, 100);
    }
  }, [messages, activeViewType, toMessageScrollBottom]);

  useLayoutEffect(() => {
    if (activeViewType === ActionButtonType.AUCTION && messages.length > 0) {
      if (isBottom) {
        setTimeout(() => {
          toMessageScrollBottom(messages.length);
        }, 100);
      } else if (isBottom === prevBottomRef.current) {
        handleUpdateShowLastMessage('auction', true);
      }

      prevBottomRef.current = isBottom;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isBottom]);

  const onItemsRendered = (props: ListOnItemsRenderedProps) => {
    handleUpdateMessageScrollRef(props.visibleStopIndex + 1, messages.length);
  };

  const onScroll = (props: ListOnScrollProps) => {
    const { scrollOffset, scrollUpdateWasRequested } = props;
    if (!loadRef.current) {
      return;
    }

    if (outerRef.current && !scrollUpdateWasRequested) {
      const { scrollTop, scrollHeight, clientHeight } = outerRef.current;

      setIsBottom(Math.ceil(scrollTop + clientHeight) >= scrollHeight - CHATAREA_SCROLL_HEIGHT_OFFSET);
    }

    handleScroll(scrollOffset, scrollUpdateWasRequested, outerRef);
  };

  return (
    <MaskingAreaStyled
      className={classNames({ 'hide-mask': hideMask })}
      $isTop={isMessageScrollTop}
      $isBottom={isBottom}
    >
      <ChatContext.Provider
        value={{ bidColor: dealGoods?.bidColor, listAreaWidth, updateChatItemHeight: setListItemHeight }}
      >
        <ListWrapperStyled $height={listAreaHeight}>
          <List
            className="list"
            height={listAreaHeight}
            itemData={messages}
            itemCount={messages.length}
            itemSize={getListItemHeight}
            width={listAreaWidth}
            onItemsRendered={onItemsRendered}
            ref={ref}
            onScroll={onScroll}
            outerRef={outerRef}
          >
            {Row}
          </List>
        </ListWrapperStyled>
      </ChatContext.Provider>
    </MaskingAreaStyled>
  );
};

const ListWrapperStyled = styled.div<{ $height: number }>`
  height: auto !important;
  max-height: ${({ $height }) => `${$height}px`};
  pointer-events: auto;

  .list {
    -ms-overflow-style: none;
    scrollbar-width: none;
    height: auto !important;
    max-height: ${({ $height }) => `${$height}px`};

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const AuctionMessageStyled = styled(AuctionMessage)<{ $last: boolean }>`
  max-width: 100%;

  ${({ $last }) =>
    $last &&
    `
    opacity: 0.8;
  `}
`;

const MaskingAreaStyled = styled.div<{ $isTop: boolean; $isBottom: boolean }>`
  width: 100%;
  &:not(.hide-mask) {
    mask-image: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 1) 7.2rem,
      rgba(0, 0, 0, 1) calc(100% - 0.8rem),
      transparent 100%
    );

    ${({ $isTop }) =>
      $isTop &&
      `
    mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 1) calc(100% - 0.8rem),
      transparent 100%
    );
  `}

    ${({ $isBottom }) =>
      $isBottom &&
      `
    mask-image: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 1) 7.2rem
  );
  `}
  }
`;

export const AuctionChatList = React.memo(
  React.forwardRef(InnerAuctionChatList),
  (
    {
      messages: prevMessages,
      activeViewType: prevActiveViewType,
      auctionListItem: {
        listAreaWidth: prevWidth,
        listAreaHeight: prevHeight,
        isMessageScrollTop: prevIsMessageScrollTop,
        isMessageScrollBottom: prevIsMessageScrollBottom,
      },
      dealGoods: prevDealGoods,
    },
    {
      messages: nextMessages,
      activeViewType: nextActiveViewType,
      auctionListItem: {
        listAreaWidth: nextWidth,
        listAreaHeight: nextHeight,
        isMessageScrollTop: nextIsMessageScrollTop,
        isMessageScrollBottom: nextIsMessageScrollBottom,
      },
      dealGoods: nextDealGoods,
    },
  ) => {
    const prev = prevMessages.map((item) => item.message).join(',');
    const next = nextMessages.map((item) => item.message).join(',');
    return (
      prev === next &&
      prevActiveViewType === nextActiveViewType &&
      prevWidth === nextWidth &&
      prevHeight === nextHeight &&
      prevDealGoods?.bidColor === nextDealGoods?.bidColor &&
      prevDealGoods?.textColor === nextDealGoods?.textColor &&
      prevIsMessageScrollTop === nextIsMessageScrollTop &&
      prevIsMessageScrollBottom === nextIsMessageScrollBottom
    );
  },
);
