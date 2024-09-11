import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import {
  VariableSizeList as List,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
  ListChildComponentProps,
} from 'react-window';
import styled from 'styled-components';
import classNames from 'classnames';
import { SendBirdUserMessageModel } from '../models';
import { UserMessage } from './UserMessage';
import { ChatItemSizer } from './ChatItemSizer';
import { ReturnTypeUseLiveChatService } from '../services/useLiveChatService';
import { ActionButtonType, CHATAREA_SCROLL_HEIGHT_OFFSET } from '../constants';
import { ChatContext } from '../contexts/ChatContext';

interface Props {
  activeViewType: ActionButtonType | undefined;
  messages: Array<SendBirdUserMessageModel>;
  chatListItem: ReturnTypeUseLiveChatService['chatListItem'];
  onUpdateMessageScrollRef: ReturnTypeUseLiveChatService['handleUpdateMessageScrollRef'];
  onUpdateShowLastMessage: ReturnTypeUseLiveChatService['handleUpdateShowLastMessage'];
  onClickArea: (event: React.MouseEvent) => void;
}

const Row = (
  props: React.PropsWithChildren<
    ListChildComponentProps<Array<SendBirdUserMessageModel>> & {
      children?: React.ReactNode;
    }
  >,
) => {
  const { listAreaWidth, updateChatItemHeight, onClickItem } = useContext(ChatContext);
  const { style, index, data: messages } = props;
  const overrideStyled = {
    ...style,
    top: Number(style.top) + 2,
    height: Number(style.height) - 4,
    paddingRight: '15px',
  };

  const {
    message,
    messageId,
    isAdmin,
    sender: { nickname, plainProfileUrl },
  } = messages[index];

  return (
    <div style={overrideStyled} key={messageId}>
      <ChatItemSizer
        parentWidth={listAreaWidth}
        index={index}
        updateChatItemHeight={updateChatItemHeight}
        onClickItem={onClickItem}
      >
        <UserMessage message={message} nickname={nickname} profileUrl={plainProfileUrl} isAdmin={isAdmin} />
      </ChatItemSizer>
    </div>
  );
};

/**
 * 사용자 채팅 리스트
 */
const InnerUserChatList: React.ForwardRefRenderFunction<List, Props> = (
  {
    activeViewType,
    messages,
    chatListItem: {
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
    onClickArea: handleClickArea,
  },
  ref,
) => {
  const outerRef = useRef<HTMLElement>(null);
  const loadRef = useRef<boolean>(false);
  const hideMask = messages.length === 1 || listAreaHeight > (outerRef.current?.scrollHeight || 0);
  const [isBottom, setIsBottom] = useState<boolean>(true);
  const prevBottomRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (!loadRef.current && activeViewType === ActionButtonType.CHAT && messages.length > 0) {
      loadRef.current = true;
      setTimeout(() => {
        toMessageScrollBottom(messages.length);
      }, 100);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, activeViewType]);

  useLayoutEffect(() => {
    if (outerRef.current && activeViewType === ActionButtonType.CHAT && messages.length > 0) {
      if (isBottom) {
        setTimeout(() => {
          toMessageScrollBottom(messages.length);
        }, 100);
      } else if (isBottom === prevBottomRef.current) {
        handleUpdateShowLastMessage('user', true);
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
        value={{ listAreaWidth, updateChatItemHeight: setListItemHeight, onClickItem: handleClickArea }}
      >
        <ListWrapperStyled $height={listAreaHeight}>
          <List
            className="list"
            height={listAreaHeight}
            itemData={messages}
            itemCount={messages.length}
            itemSize={getListItemHeight}
            width={listAreaWidth}
            ref={ref}
            outerRef={outerRef}
            onItemsRendered={onItemsRendered}
            onScroll={onScroll}
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

export const UserChatList = React.memo(
  React.forwardRef(InnerUserChatList),
  (
    {
      messages: prevMessages,
      activeViewType: prevActiveViewType,
      chatListItem: {
        listAreaWidth: prevWidth,
        listAreaHeight: prevHeight,
        isMessageScrollTop: prevIsMessageScrollTop,
        isMessageScrollBottom: prevIsMessageScrollBottom,
      },
    },
    {
      messages: nextMessages,
      activeViewType: nextActiveViewType,
      chatListItem: {
        listAreaWidth: nextWidth,
        listAreaHeight: nextHeight,
        isMessageScrollTop: nextIsMessageScrollTop,
        isMessageScrollBottom: nextIsMessageScrollBottom,
      },
    },
  ) => {
    const prev = prevMessages.map((item) => item.message).join(',');
    const next = nextMessages.map((item) => item.message).join(',');
    return (
      prev === next &&
      prevActiveViewType === nextActiveViewType &&
      prevWidth === nextWidth &&
      prevHeight === nextHeight &&
      prevIsMessageScrollTop === nextIsMessageScrollTop &&
      prevIsMessageScrollBottom === nextIsMessageScrollBottom
    );
  },
);
