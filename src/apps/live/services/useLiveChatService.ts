import { useCallback, useState } from 'react';
import { ReturnTypeUseLiveLogService } from './useLogService';
import { ActionButtonType } from '../constants';
import { useVirtualList } from '../hooks';
import { useLiveCouponIndicatorStore, useLiveSendbirdStore } from '../store';

export type ReturnTypeUseLiveChatService = ReturnType<typeof useLiveChatService>;

interface Props {
  logService: ReturnTypeUseLiveLogService;
}

export const useLiveChatService = ({ logService }: Props) => {
  // 활성 view type
  const [activeViewType, setActiveViewType] = useState<ActionButtonType | undefined>(undefined);

  const chatListItem = useVirtualList({ viewType: ActionButtonType.CHAT, activeViewType });
  const auctionListItem = useVirtualList({ viewType: ActionButtonType.AUCTION, activeViewType });

  /* 사용자 마지막 메세지 표시 여부  */
  const [showLastUserMessage, setShowLastUserMessage] = useState<boolean>(false);
  /* 경매 마지막 메세지 표시 여부  */
  const [showLastAuctionMessage, setShowLastAuctionMessage] = useState<boolean>(false);
  /* 공지메세지 Ellipsis 여부  */
  const [isEllipsisNoticeMessage, setIsEllipsisNoticeMessage] = useState<boolean>(true);

  const { logLiveViewChat: handleLogLiveViewChat, logLiveViewAuction: handleLogLiveViewAuction } = logService;

  const setNeedRetryConntion = useLiveSendbirdStore((state) => state.setNeedRetryConntion);

  const updateShowCouponIndicator = useLiveCouponIndicatorStore((state) => state.updateShowCouponIndicator);
  const initializeDownloadableCouponStatus = useLiveCouponIndicatorStore(
    (state) => state.initializeDownloadableCouponStatus,
  );

  /**
   * active view type update
   */
  const handleUpdateActiveViewType = (viewType?: ActionButtonType) => {
    if (viewType === ActionButtonType.EMPTY) {
      chatListItem.updateMessageScrollRef(0, 0);
      auctionListItem.updateMessageScrollRef(0, 0);
      updateShowCouponIndicator(false);
      setTimeout(() => {
        initializeDownloadableCouponStatus();
      }, 350);
    }

    switch (viewType) {
      case ActionButtonType.CHAT:
        setNeedRetryConntion(false);
        handleLogLiveViewChat();
        updateShowCouponIndicator(true);
        break;
      case ActionButtonType.AUCTION:
        setNeedRetryConntion(false);
        handleLogLiveViewAuction();
        updateShowCouponIndicator(true);
        break;
      default:
    }

    setActiveViewType(viewType);
  };

  const handleUpdateShowLastMessage = (type: 'user' | 'auction', isShow: boolean) => {
    if (type === 'user') {
      setShowLastUserMessage(isShow);
    } else {
      setShowLastAuctionMessage(isShow);
    }
  };

  /**
   * 공지메세지 Ellipsis 업데이트
   */
  const handleUpdateEllipsis = () => {
    setIsEllipsisNoticeMessage((prev) => !prev);
  };

  /**
   * 공지메세지 Ellipsis 처리
   */
  const handleUpdateEllipsisCancel = () => {
    setIsEllipsisNoticeMessage((prev) => {
      if (!prev) {
        return true;
      }

      return prev;
    });
  };

  /**
   * message ref update
   */
  const handleUpdateMessageScrollRef = (currentIndex: number, total: number) => {
    if (activeViewType === ActionButtonType.CHAT) {
      chatListItem.updateMessageScrollRef(currentIndex, total);
    } else if (activeViewType === ActionButtonType.AUCTION) {
      auctionListItem.updateMessageScrollRef(currentIndex, total);
    }

    if (currentIndex === total) {
      setShowLastUserMessage((prev) => {
        if (prev) {
          return false;
        }

        return prev;
      });
      setShowLastAuctionMessage((prev) => {
        if (prev) {
          return false;
        }

        return prev;
      });
    }
  };

  /**
   * 메세지창 스크롤 최하단 이동
   */
  const toMessageScrollBottom = useCallback(
    (messageLength?: number) => {
      if (activeViewType === ActionButtonType.CHAT) {
        chatListItem.toMessageScrollBottom(messageLength);
      }
      if (activeViewType === ActionButtonType.AUCTION) {
        auctionListItem.toMessageScrollBottom(messageLength);
      }
    },
    [activeViewType, auctionListItem, chatListItem],
  );

  /**
   * 메세지창 스크롤 변수 초기화
   */
  const resetMessageScroll = useCallback(() => {
    chatListItem.resetMessageScroll();
    auctionListItem.resetMessageScroll();
  }, [auctionListItem, chatListItem]);

  return {
    chatListItem,
    auctionListItem,
    activeViewType,
    showLastUserMessage,
    showLastAuctionMessage,
    isEllipsisNoticeMessage,
    handleUpdateShowLastMessage,
    handleUpdateEllipsis,
    handleUpdateEllipsisCancel,
    handleUpdateMessageScrollRef,
    handleUpdateActiveViewType,
    toMessageScrollBottom,
    resetMessageScroll,
  };
};
