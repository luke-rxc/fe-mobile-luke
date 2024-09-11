import { ActionButtonType, LiveViewMode } from '../constants';
import { ReturnTypeUseContentEditable } from '../hooks';
import {
  ReturnTypeUseLiveChatService,
  ReturnTypeUseLiveLogService,
  ReturnTypeUseLiveService,
  ReturnTypeUseLiveUserActionService,
} from '../services';
import { SendBirdUserInfo } from '../types';
import { AuctionChatList } from './AuctionChatList';
import { ChatArea } from './ChatArea';
import { ChatLayout } from './ChatLayout';
import { LiveAlertMessage } from './LiveAlertMessage';
import { RecentMessage } from './RecentMessage';
import { UserChatList } from './UserChatList';

type Props = ReturnTypeUseLiveService['chat'] &
  Omit<
    ReturnTypeUseLiveChatService,
    'handleUpdateActiveViewType' | 'handleUpdateEllipsisCancel' | 'resetMessageScroll'
  > & {
    contentEditable: ReturnTypeUseContentEditable;

    inputFocused: boolean;
    sendbirdUser: SendBirdUserInfo;
    // 구매인증 버튼 노출여부
    showPurchaseVerificationButton: boolean;
    horizontalRatioVideo: boolean;
    handleUserAction: ReturnTypeUseLiveUserActionService['handleAction'];
    handleLogLiveImpressionPurchaseVerification: ReturnTypeUseLiveLogService['logLiveImpressionPurchaseVerification'];
  };

export const LiveChatArea = ({
  liveInfo,
  liveMode,
  alertMessage,
  auctionMessages,
  lastAuctionMessage,
  liveNotice,
  messages,
  lastUserMessage,
  uiView,
  activeViewType,
  auctionListItem,
  chatListItem,
  isEllipsisNoticeMessage,
  showLastAuctionMessage,
  showLastUserMessage,
  toMessageScrollBottom,
  contentEditable,
  inputFocused,
  sendbirdUser,
  showPurchaseVerificationButton,
  horizontalRatioVideo,
  handleClearAlertMessage,
  handleToggleUiView,
  handleUpdateEllipsis,
  handleUpdateMessageScrollRef,
  handleUserAction,
  handleUpdateShowLastMessage,
  handleLogLiveImpressionPurchaseVerification,
}: Props) => {
  if (!liveInfo || liveMode !== LiveViewMode.LIVE) {
    return null;
  }

  return (
    <>
      <LiveAlertMessage
        message={alertMessage}
        liveShowroom={liveInfo.showRoom}
        onClearAlertMessage={handleClearAlertMessage}
      />

      <ChatLayout
        ref={chatListItem.listAreaRef}
        activeViewType={activeViewType}
        itemType={ActionButtonType.CHAT}
        liveNotice={liveNotice}
        lastAuctionMessage={lastAuctionMessage}
        dealGoods={liveInfo.dealGoodsItem}
        uiView={uiView}
        inputFocused={inputFocused}
        inputAppendHeight={contentEditable.inputAppendHeight}
        onClickUserAction={handleUserAction}
        isEllipsisNoticeMessage={isEllipsisNoticeMessage}
        onUpdateEllipsis={handleUpdateEllipsis}
        chatAreaElement={
          <ChatArea
            fullWidth={!liveInfo.dealGoodsItem || inputFocused}
            inputFocused={inputFocused}
            chatMessage={contentEditable.content}
            buttonLabel="로그인 후 참여할 수 있습니다"
            sendbirdUser={sendbirdUser}
            showPurchaseVerificationButton={showPurchaseVerificationButton}
            activeViewType={activeViewType}
            horizontalRatioVideo={horizontalRatioVideo}
            onClickUserAction={handleUserAction}
            onBlur={contentEditable.handleBlur}
            onFocus={contentEditable.handleFocus}
            onLogLiveImpressionPurchaseVerification={handleLogLiveImpressionPurchaseVerification}
          />
        }
      >
        <UserChatList
          ref={chatListItem.listRef}
          activeViewType={activeViewType}
          messages={messages}
          chatListItem={chatListItem}
          onUpdateMessageScrollRef={handleUpdateMessageScrollRef}
          onClickArea={handleToggleUiView}
          onUpdateShowLastMessage={handleUpdateShowLastMessage}
        />

        {lastUserMessage && (
          <RecentMessage
            show={showLastUserMessage}
            message={lastUserMessage.message}
            nickname={lastUserMessage.sender.nickname}
            profileUrl={lastUserMessage.sender.profileUrl}
            isUserMessage
            onClickMessage={() => toMessageScrollBottom(messages.length)}
          />
        )}
      </ChatLayout>
      <ChatLayout
        ref={auctionListItem.listAreaRef}
        activeViewType={activeViewType}
        itemType={ActionButtonType.AUCTION}
        liveNotice={liveNotice}
        lastAuctionMessage={lastAuctionMessage}
        dealGoods={liveInfo.dealGoodsItem}
        uiView={uiView}
        onClickUserAction={handleUserAction}
        isEllipsisNoticeMessage={isEllipsisNoticeMessage}
        onUpdateEllipsis={handleUpdateEllipsis}
      >
        <AuctionChatList
          ref={auctionListItem.listRef}
          activeViewType={activeViewType}
          auctionListItem={auctionListItem}
          messages={auctionMessages || []}
          dealGoods={liveInfo.dealGoodsItem}
          onUpdateMessageScrollRef={handleUpdateMessageScrollRef}
          onUpdateShowLastMessage={handleUpdateShowLastMessage}
        />
        {lastAuctionMessage && (
          <RecentMessage
            show={showLastAuctionMessage}
            message={lastAuctionMessage.data?.price ?? ''}
            nickname={lastAuctionMessage.data?.user?.nickname ?? ''}
            profileUrl={lastAuctionMessage.data?.user?.profileImage ?? ''}
            backgroundColor={liveInfo.dealGoodsItem?.bidColor}
            onClickMessage={() => toMessageScrollBottom(auctionMessages.length)}
          />
        )}
      </ChatLayout>
    </>
  );
};
