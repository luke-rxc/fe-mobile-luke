import { MetaCounter, User } from '@sendbird/chat';
import { SendbirdOpenChat, OpenChannel } from '@sendbird/chat/openChannel';
import { create } from 'zustand';
import { MessageType } from '@sendbird/chat/message';
import { SendBirdMessageType, SendBirdAdminMessageModel } from '../models';
import { SendbirdCustomError } from '../types';

export interface ChannelItem {
  liveChatChannel: OpenChannel;
  interactionChannel: OpenChannel;
  auctionChatChannel: OpenChannel | null;
  subtitleChatChannel: OpenChannel | null;
}

export interface MessageItem {
  messages: Array<SendBirdMessageType>;
  adminMessages: Array<SendBirdAdminMessageModel>;
  auctionMessages: Array<SendBirdAdminMessageModel>;
  noticeMessage: string;
  banedUserList?: Array<User>;
  mutedUserList?: Array<User>;
  metacounter: MetaCounter | null;
  subtitles?: Array<SendBirdMessageType>;
}

interface SubtitleState {
  sendbird: SendbirdOpenChat | null;
  /* 로딩여부  */
  isLoading: boolean;
  // sendbird 연결해제 여부
  disconnect: boolean;
  // sendbird 재연결 처리 필요 여부
  needRetryConnection: boolean;
  // 메세지 검색 여부
  useMessageSearch: boolean;
  // 라이브 채팅 채널
  liveChatChannel: OpenChannel | null;
  // 경매 채팅 채널
  auctionChatChannel: OpenChannel | null;
  // interaction 채널
  interactionChannel: OpenChannel | null;
  // 자막 채널
  subtitleChatChannel: OpenChannel | null;
  // metacounter (구매인증)
  metacounter: MetaCounter | null;
  /* 메세지 리스트  */
  messages: Array<SendBirdMessageType>;
  /* 관리자 메세지 리스트  */
  adminMessages: Array<SendBirdAdminMessageModel>;
  /* 경매 메세지 리스트  */
  auctionMessages: Array<SendBirdAdminMessageModel>;
  /* 공지 메세지  */
  noticeMessage: string | null;
  /* 밴 유저 리스트 (office) */
  banedUserList: Array<User>;
  /* 음소거 유저 리스트 (office) */
  mutedUserList: Array<User>;
  /* 자막 리스트 (office) */
  subtitles: Array<SendBirdMessageType>;
  /* 쇼룸 구독요청 정보 (office) */
  showroomSubscribeInfo: string | null;
  /* 초기메세지 로드완료 여부 (office) */
  completeLoadFirstMessage: boolean;
  /* 이전메세지 로드완료 여부 (office) */
  completeLoadPreviousMessage: boolean;
  /* 이전자막 로드완료 여부 (office) */
  completeLoadPreviousSubtitle: boolean;
  lastMessageId: string | null;
  lastSubtitleMessageId: string | null;
  /* error */
  error: SendbirdCustomError | null;
  setSendbird: (sendbird: SendbirdOpenChat) => void;
  setChannel: (channelItem: ChannelItem) => void;
  setSendbirdDisconnect: () => void;
  setNeedRetryConntion: (needRetryConnection: boolean) => void;
  setMessageItem: (messageItem: MessageItem) => void;
  setMessage: (message: SendBirdMessageType) => void;
  addMessage: (message: SendBirdMessageType) => void;
  deleteMessage: (messageId: number, messageType: MessageType.USER | MessageType.ADMIN) => void;
  deleteAllMessages: () => void;
  addPreviousMessages: (messages: Array<SendBirdMessageType>, lastMessageId: string) => void;
  addAdminMessage: (adminMessage: SendBirdAdminMessageModel) => void;
  addAuctionMessage: (auctionMessage: SendBirdAdminMessageModel) => void;
  addPreviousAuctionMessages: (auctionMessages: Array<SendBirdAdminMessageModel>) => void;
  setAuctionMessages: (auctionMessages: Array<SendBirdAdminMessageModel>) => void;
  setNoticeMessage: (noticeMessage: string | null) => void;
  setBanedUserList: (banedUserList: Array<User>) => void;
  setMutedUserList: (mutedUserList: Array<User>) => void;
  setLoading: (loading?: boolean) => void;
  setUseSearchMessage: (useMessageSearch: boolean) => void;
  setShowroomSubscribeInfo: (showroomSubscribeInfo: string) => void;
  deleteShowroomSubscribeInfo: () => void;
  addSubtitleMessage: (subtitleMessage: SendBirdMessageType) => void;
  addPreviousSubtitleMessages: (subtitleMessages: Array<SendBirdMessageType>, lastSubtitleMessageId: string) => void;
  setMetacounter: (metacounter: MetaCounter) => void;
  setError: (error?: Omit<SendbirdCustomError, 'isError'>) => void;
  clearError: () => void;
  resetStore: () => void;
}

/**
 * 라이브 sendbird store
 */
export const useLiveSendbirdStore = create<SubtitleState>((set) => ({
  sendbird: null,
  isLoading: false,
  disconnect: true,
  needRetryConnection: false,
  useMessageSearch: false,
  liveChatChannel: null,
  auctionChatChannel: null,
  interactionChannel: null,
  subtitleChatChannel: null,
  metacounter: null,
  messages: [],
  adminMessages: [],
  auctionMessages: [],
  noticeMessage: null,
  banedUserList: [],
  mutedUserList: [],
  subtitles: [],
  showroomSubscribeInfo: null,
  completeLoadFirstMessage: false,
  completeLoadPreviousMessage: false,
  completeLoadPreviousSubtitle: false,
  lastMessageId: null,
  lastSubtitleMessageId: null,
  error: null,

  setSendbird: (sendbird) => {
    // SET_SENDBIRD
    set({
      sendbird,
    });
  },

  resetStore: () => {
    set({
      sendbird: null,
      isLoading: false,
      disconnect: true,
      needRetryConnection: false,
      useMessageSearch: false,
      liveChatChannel: null,
      auctionChatChannel: null,
      interactionChannel: null,
      subtitleChatChannel: null,
      metacounter: null,
      messages: [],
      adminMessages: [],
      auctionMessages: [],
      noticeMessage: null,
      banedUserList: [],
      mutedUserList: [],
      subtitles: [],
      showroomSubscribeInfo: null,
      completeLoadFirstMessage: false,
      completeLoadPreviousMessage: false,
      completeLoadPreviousSubtitle: false,
      lastMessageId: null,
      lastSubtitleMessageId: null,
      error: null,
    });
  },

  setChannel: ({ liveChatChannel, interactionChannel, auctionChatChannel, subtitleChatChannel }: ChannelItem) => {
    // SET_INSTANCE
    set(() => {
      return {
        liveChatChannel,
        interactionChannel,
        auctionChatChannel,
        subtitleChatChannel,
        disconnect: false,
        isLoading: false,
        needRetryConnection: false,
      };
    });
  },

  setSendbirdDisconnect: () => {
    // SET_DISCONNECT
    set(() => {
      return {
        liveChatChannel: null,
        interactionChannel: null,
        auctionChatChannel: null,
        subtitleChatChannel: null,
        disconnect: true,
        needRetryConnection: false,
      };
    });
  },

  setNeedRetryConntion: (needRetryConnection: boolean) => {
    set(() => {
      return {
        needRetryConnection,
      };
    });
  },

  setMessageItem: ({
    messages,
    adminMessages,
    auctionMessages,
    noticeMessage,
    banedUserList,
    mutedUserList,
    metacounter,
    subtitles,
  }: MessageItem) => {
    // SET_MESSAGE
    set(() => {
      return {
        completeLoadFirstMessage: true,
        messages,
        adminMessages,
        auctionMessages,
        noticeMessage: noticeMessage ?? null,
        banedUserList,
        mutedUserList,
        metacounter,
        subtitles,
        isLoading: false,
      };
    });
  },

  /**
   * 메세지 설정
   */
  setMessage: (message: SendBirdMessageType) => {
    // UPDATE_MESSAGE
    set((state) => {
      return {
        messages: state.messages.map((item) => {
          if (item.messageId === message.messageId) {
            return message;
          }

          return item;
        }),
      };
    });
  },

  /**
   * 메세지 추가
   */
  addMessage: (message: SendBirdMessageType) => {
    // ADD_MESSAGE
    set((state) => {
      return {
        messages: state.messages.concat(message),
      };
    });
  },

  /**
   * 메세지 삭제
   */
  deleteMessage: (messageId: number, messageType: MessageType.USER | MessageType.ADMIN) => {
    // DELETE_MESSAGE
    set((state) => {
      return {
        messages:
          messageType === 'user' ? state.messages.filter((item) => item.messageId !== messageId) : state.messages,
        adminMessages:
          messageType === 'admin'
            ? (state.adminMessages ?? []).filter((item) => item.messageId !== messageId)
            : state.adminMessages,
      };
    });
  },

  /**
   * 이전 메세지 추가
   */
  addPreviousMessages: (messages: Array<SendBirdMessageType>, lastMessageId: string) => {
    set((state) => {
      return {
        completeLoadPreviousMessage: true,
        messages: messages.concat(state.messages).sort((a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        }),
        lastMessageId,
      };
    });
  },

  /**
   * 전체 메세지 삭제
   */
  deleteAllMessages: () => {
    // DELETE_ALL_MESSAGE
    set((state) => {
      return {
        messages: [],
        adminMessages: [],
        auctionMessages: state.auctionMessages.filter((_, index) => index === state.auctionMessages.length - 1),
      };
    });
  },

  /**
   * 관리자 메세지 추가
   */
  addAdminMessage: (adminMessage: SendBirdAdminMessageModel) => {
    set((state) => {
      return {
        adminMessages: state.adminMessages.concat(adminMessage),
      };
    });
  },

  /**
   * 경매 메세지 추가
   */
  addAuctionMessage: (auctionMessage: SendBirdAdminMessageModel) => {
    // ADD_AUCTION_MESSAGE
    set((state) => {
      return {
        auctionMessages: state.auctionMessages.concat(auctionMessage),
      };
    });
  },

  /**
   * 이전 경매 메세지 추가
   */
  addPreviousAuctionMessages: (auctionMessages: Array<SendBirdAdminMessageModel>) => {
    set((state) => {
      return {
        auctionMessages: auctionMessages.concat(state.auctionMessages),
      };
    });
  },

  /**
   * 경매 메세지 리스트 설정
   */
  setAuctionMessages: (auctionMessages: Array<SendBirdAdminMessageModel>) => {
    set(() => {
      return {
        auctionMessages,
      };
    });
  },

  /**
   * 공지 메세지 설정
   */
  setNoticeMessage: (noticeMessage: string | null) => {
    // UPDATE_NOTICE_MESSAGE
    set(() => {
      return {
        noticeMessage,
      };
    });
  },

  /**
   * BAN 유저 리스트 설정
   */
  setBanedUserList: (banedUserList: Array<User>) => {
    // UPDATE_BANED_USER_LIST
    set(() => {
      return {
        banedUserList,
      };
    });
  },

  /**
   * MUTE 유저 리스트 설정
   */
  setMutedUserList: (mutedUserList: Array<User>) => {
    // UPDATE_MUTED_USER_LIST
    set(() => {
      return {
        mutedUserList,
      };
    });
  },

  /**
   * Loading 설정
   */
  setLoading: (loading?: boolean) => {
    // SET_LOADING
    set(() => {
      return {
        isLoading: loading ?? true,
      };
    });
  },

  /**
   * 메세지 검색기능 여부 설정
   */
  setUseSearchMessage: (useMessageSearch: boolean) => {
    // UPDATE_USE_SEARCH_MESSAGE
    set(() => {
      return {
        useMessageSearch,
      };
    });
  },

  /**
   * 쇼룸 구독요청 정보 설정
   */
  setShowroomSubscribeInfo: (showroomSubscribeInfo: string) => {
    set(() => {
      return {
        showroomSubscribeInfo,
      };
    });
  },

  /**
   * 쇼룸 구독요청 정보 삭제
   */
  deleteShowroomSubscribeInfo: () => {
    set(() => {
      return {
        showroomSubscribeInfo: null,
      };
    });
  },

  /**
   * 자막 메세지 추가
   */
  addSubtitleMessage: (subtitleMessage: SendBirdMessageType) => {
    set((state) => {
      return {
        subtitles: state.subtitles.concat(subtitleMessage),
      };
    });
  },

  /**
   * 이전 자막 메세지 리스트 추가
   */
  addPreviousSubtitleMessages: (subtitles: Array<SendBirdMessageType>, lastSubtitleMessageId: string) => {
    set(() => {
      return {
        completeLoadPreviousSubtitle: true,
        subtitles,
        lastSubtitleMessageId,
      };
    });
  },

  /**
   * metacounter 설정
   */
  setMetacounter: (metacounter: MetaCounter) => {
    set(() => {
      return {
        metacounter,
      };
    });
  },

  /**
   * Error 설정
   */
  setError: (error?: Omit<SendbirdCustomError, 'isError'>) => {
    set(() => {
      return {
        error: error ? { ...error, isError: true } : null,
        isLoading: false,
      };
    });
  },

  /**
   * Error 초기화
   */
  clearError: () => {
    set(() => {
      return {
        error: null,
      };
    });
  },
}));
