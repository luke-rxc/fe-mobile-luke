/* eslint-disable no-param-reassign */
import { createDebug } from '@utils/debug';
import { nanoid } from '@utils/nanoid';
import get from 'lodash/get';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import SendbirdChat, {
  BaseChannel,
  SendbirdChatParams,
  SendbirdError,
  MetaCounter,
  ConnectionState,
  LogLevel,
  ConnectionHandler,
} from '@sendbird/chat';
import { OpenChannel, OpenChannelHandler, OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { LiveAuctionStatus } from '@constants/live';
import {
  AdminMessage,
  BaseMessage,
  MessageType,
  PreviousMessageListQuery,
  UserMessage,
  UserMessageCreateParams,
} from '@sendbird/chat/message';
import env from '@env';
import { useDialog } from '@hooks/useDialog';
import { useLogout } from '@features/login/hooks';
import { useWebInterface } from '@hooks/useWebInterface';
import {
  LiveViewMode,
  SendbirdActionType,
  SendbirdErrorCode,
  LIVE_PURCHASE_VERIFICATION_METACOUNTER_KEY,
  LIVE_PURCHASE_VERIFICATION_EVENT_NAME,
  ActionButtonType,
  LIVE_FNB_EVENT_NAME,
} from '../constants';
import {
  FollowInfoModel,
  LiveChatChannelModel,
  RaffleWinnerInfoModel,
  SendBirdAdminMessageModel,
  SendBirdUserMessageModel,
  toLiveAuctionInfo,
  toSendbirdUserMessageModel,
  toSendbirdUserMessageModelList,
} from '../models';
import { SendBirdUserInfo } from '../types';
import { useCustomEvent } from './useCustomEvent';
import { getQueryString } from '../utils';
import { useLiveSendbirdStore } from '../store';

const debug = createDebug();

interface Props {
  enabled: boolean;
  chatChannelItem: LiveChatChannelModel | undefined;
  liveMode: LiveViewMode;
  sendbirdUser: SendBirdUserInfo;
  showRoomName: string;
  updateLiveInfo: () => void;
  handleReloadVideo: (videoUrl: string | null) => void;
  handleDialogEndedLive: () => void;
  handleAddAlertMessage: (message: string) => void;
  handleUpdateFollowAwaiter: (fallowInfo: FollowInfoModel) => void;
  handleUpdateRaffleWinnerInfo: (raffleWinnerItem: RaffleWinnerInfoModel) => void;
  handleUpdateEllipsisCancel: () => void;
  handleUpdateActiveViewType: (viewType?: ActionButtonType | undefined) => void;
}

export const useSendbird = ({
  enabled,
  chatChannelItem,
  liveMode,
  sendbirdUser,
  showRoomName,
  updateLiveInfo,
  handleReloadVideo,
  handleDialogEndedLive,
  handleAddAlertMessage,
  handleUpdateFollowAwaiter,
  handleUpdateRaffleWinnerInfo,
  handleUpdateEllipsisCancel,
  handleUpdateActiveViewType,
}: Props) => {
  const sendbird = useLiveSendbirdStore((state) => state.sendbird);
  const isLoading = useLiveSendbirdStore((state) => state.isLoading);
  const connected = useLiveSendbirdStore((state) => !state.disconnect);
  const needRetryConnection = useLiveSendbirdStore((state) => state.needRetryConnection);
  const liveChatChannel = useLiveSendbirdStore((state) => state.liveChatChannel);
  const auctionChatChannel = useLiveSendbirdStore((state) => state.auctionChatChannel);
  const interactionChannel = useLiveSendbirdStore((state) => state.interactionChannel);
  const subtitleChatChannel = useLiveSendbirdStore((state) => state.subtitleChatChannel);
  const metacounter = useLiveSendbirdStore((state) => state.metacounter);
  const messages = useLiveSendbirdStore((state) => state.messages);
  const adminMessages = useLiveSendbirdStore((state) => state.adminMessages);
  const auctionMessages = useLiveSendbirdStore((state) => state.auctionMessages);
  const noticeMessage = useLiveSendbirdStore((state) => state.noticeMessage);
  const sendbirdError = useLiveSendbirdStore((state) => state.error);
  const setChannel = useLiveSendbirdStore((state) => state.setChannel);
  const setSendbirdDisconnect = useLiveSendbirdStore((state) => state.setSendbirdDisconnect);
  const setNeedRetryConntion = useLiveSendbirdStore((state) => state.setNeedRetryConntion);
  const setLoading = useLiveSendbirdStore((state) => state.setLoading);
  const setSendbird = useLiveSendbirdStore((state) => state.setSendbird);
  const resetStore = useLiveSendbirdStore((state) => state.resetStore);
  const setMessageItem = useLiveSendbirdStore((state) => state.setMessageItem);
  const addMessage = useLiveSendbirdStore((state) => state.addMessage);
  const deleteMessage = useLiveSendbirdStore((state) => state.deleteMessage);
  const deleteAllMessages = useLiveSendbirdStore((state) => state.deleteAllMessages);
  const addAuctionMessage = useLiveSendbirdStore((state) => state.addAuctionMessage);
  const setMessage = useLiveSendbirdStore((state) => state.setMessage);
  const setNoticeMessage = useLiveSendbirdStore((state) => state.setNoticeMessage);
  const setError = useLiveSendbirdStore((state) => state.setError);

  /**
   * 운영에서 센드버드 로깅표시 처리를 위한 임시 처리
   */
  const queryString = getQueryString();
  const displaySendbirdLog = !!queryString.get('log') ?? false;

  /**
   * 센드버드 연결 타이머
   */
  const sendbirdConnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  /**
   * event 처리
   */
  const { publish } = useCustomEvent<string>();
  const { openDialog } = useDialog();
  const { logout } = useLogout();
  const { reload } = useWebInterface();

  /**
   * sendbird disconnect
   */
  const disconnectSendbird = useCallback(async () => {
    if (!sendbird) {
      debug.log('sendbird disconnect exit');
      return;
    }

    try {
      if (liveChatChannel !== null) {
        await liveChatChannel.exit();
      }

      if (interactionChannel !== null) {
        await interactionChannel.exit();
      }

      if (auctionChatChannel !== null) {
        await auctionChatChannel.exit();
      }

      if (subtitleChatChannel !== null) {
        await subtitleChatChannel.exit();
      }

      if (sendbird.connectionState === ConnectionState.OPEN) {
        await sendbird.disconnect();
      }
    } catch (error) {
      try {
        if (sendbird.connectionState === ConnectionState.OPEN) {
          sendbird.disconnect();
        }
      } catch (e) {
        debug.error(e);
      }
    } finally {
      debug.log('sendbird disconnect!!!');
    }
  }, [auctionChatChannel, interactionChannel, liveChatChannel, sendbird, subtitleChatChannel]);

  /**
   * sendbird enter channel
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const enterSendbirdChannel = useCallback(async () => {
    if (!(liveChatChannel && interactionChannel)) {
      return;
    }
    await liveChatChannel.enter();
    await interactionChannel.enter();

    if (auctionChatChannel !== null) {
      await auctionChatChannel.enter();
    }
    debug.log('sendbird enter channel!!!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveChatChannel, interactionChannel, auctionChatChannel]);

  /**
   * sendbird exit channel
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const exitSendbirdChannel = useCallback(async () => {
    if (!(liveChatChannel && interactionChannel)) {
      return;
    }
    await liveChatChannel.exit();
    await interactionChannel.exit();

    if (auctionChatChannel !== null) {
      await auctionChatChannel.exit();
    }
    debug.log('sendbird exit channel!!!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveChatChannel, interactionChannel, auctionChatChannel]);

  /**
   * Sendbird 연결
   */
  const connectSendbird = useCallback(
    async (init?: boolean) => {
      const { userId, profileImagePath, nickname } = sendbirdUser;
      if (!(sendbird && chatChannelItem && userId)) {
        return;
      }

      try {
        if (sendbird.currentUser && sendbird.currentUser.userId !== userId) {
          try {
            debug.log('sendbird user update - disconnect');
            await disconnectSendbird();
          } catch (e) {
            debug.error(e);
          }
        }

        await sendbird.connect(userId);
        await sendbird.updateCurrentUserInfo({
          profileUrl: profileImagePath,
          nickname,
        });

        const liveChatChannelInstance = await sendbird.openChannel.getChannel(chatChannelItem.liveChatUrl);
        const interactionChannelInstance = await sendbird.openChannel.getChannel(chatChannelItem.interactionChatUrl);
        const auctionChatChannelInstance = chatChannelItem.auctionChatUrl
          ? await sendbird.openChannel.getChannel(chatChannelItem.auctionChatUrl)
          : null;
        const subtitleChatChannelInstance = chatChannelItem.translateChatUrl
          ? await sendbird.openChannel.getChannel(chatChannelItem.translateChatUrl)
          : null;

        await liveChatChannelInstance.enter();
        await interactionChannelInstance.enter();

        if (auctionChatChannelInstance !== null) {
          await auctionChatChannelInstance.enter();
        }

        if (subtitleChatChannelInstance !== null) {
          await subtitleChatChannelInstance.enter();
        }

        setChannel({
          liveChatChannel: liveChatChannelInstance,
          interactionChannel: interactionChannelInstance,
          auctionChatChannel: auctionChatChannelInstance,
          subtitleChatChannel: subtitleChatChannelInstance,
        });

        debug.log('sendbird connect!!!', document.visibilityState, new Date());

        // 초기 connection시 background일 경우 disconnect 처리
        if (init && document.visibilityState === 'hidden') {
          disconnectSendbird();
        }
      } catch (error) {
        debug.error('error', error);
        const { code } = error as SendbirdError;

        if (String(code).startsWith('8002')) {
          debug.warn('sendbird connect - reconnect');
          await disconnectSendbird();
          connectSendbird();
          return;
        }

        switch (code) {
          case SendbirdErrorCode.BANNED_USER_SEND_MESSAGE_NOT_ALLOWED:
            setError({
              title: '라이브 시청이 제한 되었습니다',
              message: '관리자에게 문의하세요',
              callbackGoHome: liveMode === LiveViewMode.PREVIEW,
            });
            break;
          case SendbirdErrorCode.TOO_MANY_PARTICIPANTS:
          case SendbirdErrorCode.TOO_MANY_USER_WEBSOCKET_CONNECTIONS:
          case SendbirdErrorCode.TOO_MANY_APPLICATION_WEBSOCKET_CONNECTIONS:
            if (sendbirdUser.login) {
              await logout();
              reload();
              return;
            }

            openDialog({
              title: '현재 채팅 참여가 많아 접근이 지연되고 있습니다',
              desc: '잠시후 다시 시도해 주세요',
            });

            setTimeout(async () => {
              setNeedRetryConntion(true);
              handleUpdateActiveViewType(ActionButtonType.EMPTY);
              handleUpdateActiveViewType();
            }, 500);

            setLoading(false);
            break;
          default:
            setError({
              message: '현재 서비스의 상태가 원활하지 않습니다',
              callbackGoHome: true,
            });
        }

        if (sendbird) {
          try {
            if (sendbird.connectionState === ConnectionState.OPEN) {
              sendbird.disconnect();
            }
          } catch (e) {
            debug.error(e);
          }
          debug.log('sendbird disconnect!!! - connect error');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendbirdUser, sendbird, chatChannelItem],
  );

  useEffect(() => {
    const createSendbird = () => {
      if (!enabled || !chatChannelItem) {
        return;
      }
      setLoading();

      const params: SendbirdChatParams<Array<OpenChannelModule>> = {
        appId: chatChannelItem.applicationId,
        modules: [new OpenChannelModule()],
        appStateToggleEnabled: false,
      };
      const sb = SendbirdChat.init(params) as SendbirdOpenChat;

      if (displaySendbirdLog || !env.isProduction) {
        sb.logLevel = LogLevel.DEBUG;
      }

      setSendbird(sb);
    };

    createSendbird();
  }, [chatChannelItem, displaySendbirdLog, enabled, setLoading, setSendbird]);

  useEffect(() => {
    if (needRetryConnection) {
      return;
    }
    connectSendbird(true);
  }, [connectSendbird, needRetryConnection]);

  useEffect(() => {
    const reset = async () => {
      debug.log('sendbird cleanup :: disconnect');
      await disconnectSendbird();
      deleteAllMessages();
    };
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendbird]);

  useEffect(() => {
    return () => {
      debug.log('resetStore');
      resetStore();
    };
  }, [resetStore]);

  /**
   * sendbird 메세지 로드
   */
  const getLoadMessages = async (listQuery: PreviousMessageListQuery) => {
    try {
      const previousMessages = await listQuery.load();
      return previousMessages;
    } catch (e) {
      debug.error(e);
    }

    return null;
  };

  /**
   * 공지 메세지 조회
   */
  const getNoticeMessage = async (channel: OpenChannel) => {
    const meta = await channel.getAllMetaData();
    return get(meta, 'notice', null) as string;
  };

  /**
   * 이전 메세지 조회
   * @TODO 추후 사용을 위해 남겨둠
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPreviousMessage = useCallback(
    async (channel: OpenChannel) => {
      const listQuery = channel.createPreviousMessageListQuery();

      const loadMessages = await getLoadMessages(listQuery);
      if (loadMessages === null) {
        return null;
      }

      const convertMessage = toSendbirdUserMessageModelList(loadMessages, sendbirdUser.userId);

      const adminPreviousMessages = convertMessage
        .filter((item) => {
          return (
            item.messageType === MessageType.ADMIN &&
            (item as SendBirdAdminMessageModel).data?.actionType === SendbirdActionType.MESSAGE
          );
        })
        .map((item) => item as SendBirdAdminMessageModel);

      const previousMessages = convertMessage
        .filter((item) => item.messageType === MessageType.ADMIN)
        .sort((a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        });

      return {
        messages: previousMessages,
        adminMessages: adminPreviousMessages,
      };
    },
    [sendbirdUser.userId],
  );

  /**
   * 이전 interaction 메세지 조회
   * @TODO 추후 사용을 위해 남겨둠
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPreviousInteractionMessage = useCallback(async (channel: OpenChannel) => {
    const listQuery = channel.createPreviousMessageListQuery();

    const loadMessages = await getLoadMessages(listQuery);
    const convertMessages = toSendbirdUserMessageModelList(loadMessages as Array<AdminMessage>);
    const interactionMessage = convertMessages
      .filter((item) => {
        return (
          item.messageType === MessageType.ADMIN &&
          (item as SendBirdAdminMessageModel).data?.actionType === SendbirdActionType.SUBSCRIBE_SHOWROOM
        );
      })
      .map((item) => {
        const data = item as SendBirdUserMessageModel;
        data.message = '[구독 요청 메시지가 발송되었습니다.]';
        // data.messageType = 'user';
        return data;
      });

    return interactionMessage;
  }, []);

  /**
   * 이전 interaction 메세지 조회
   */
  const getPreviousAuctionMessage = useCallback(async (channel: OpenChannel) => {
    try {
      const listQuery = channel.createPreviousMessageListQuery();
      const loadMessages = await getLoadMessages(listQuery);
      const convertMessages = toSendbirdUserMessageModelList(loadMessages as Array<AdminMessage>);
      const auctionMessage = convertMessages
        .filter((item) => {
          return (
            item.messageType === MessageType.ADMIN &&
            (item as SendBirdAdminMessageModel).data?.actionType === SendbirdActionType.MESSAGE
          );
        })
        .map((item) => item as SendBirdAdminMessageModel);

      return auctionMessage;
    } catch (error) {
      return [];
    }
  }, []);

  const handleVisibilityChange = useCallback(async () => {
    if (sendbirdError || isLoading) {
      return;
    }

    debug.info('visibilityState', document.visibilityState);

    if (document.visibilityState === 'hidden') {
      // exitSendbirdChannel();
      if (sendbirdConnectTimerRef.current) {
        debug.log('샌드버드 연결 타이머 초기화', sendbirdConnectTimerRef.current);
        clearTimeout(sendbirdConnectTimerRef.current);
        sendbirdConnectTimerRef.current = null;
      }
      debug.log('sendbird', sendbird?.connectionState);
      await disconnectSendbird();

      deleteAllMessages();
    } else {
      if (needRetryConnection) {
        return;
      }
      if (sendbirdConnectTimerRef.current) {
        clearTimeout(sendbirdConnectTimerRef.current);
      }
      sendbirdConnectTimerRef.current = setTimeout(async () => {
        await connectSendbird();
      }, 1500);
      debug.log('샌드버드 연결 타이머 설정', sendbirdConnectTimerRef.current, '1.5초');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendbirdError, isLoading, connectSendbird, disconnectSendbird, needRetryConnection]);

  const connectionHandler = useMemo(
    () =>
      new ConnectionHandler({
        onConnected: () => {
          debug.log('ConnectionHandler:: sendbird connected');
        },
        onDisconnected: () => {
          debug.log('ConnectionHandler:: sendbird disconnected');
          setSendbirdDisconnect();
        },
        onReconnectStarted: () => {
          debug.log('ConnectionHandler:: sendbird reconnect start');
        },
        onReconnectSucceeded: () => {
          debug.log('ConnectionHandler:: sendbird reconnect success');
        },
        onReconnectFailed: async () => {
          debug.log('ConnectionHandler:: sendbird reconnect fail');
          await connectSendbird();
        },
      }),
    [connectSendbird, setSendbirdDisconnect],
  );

  const getOpenChannelHandler = useCallback(() => {
    return new OpenChannelHandler({
      // 사용자 메세지 받을시 호출 event
      onMessageReceived: (channel: BaseChannel, message: BaseMessage) => {
        debug.log('[sendbird - onMessageReceived]', channel.url, message, JSON.stringify(message));
        if (message.messageType === 'file') {
          return;
        }

        if (channel.url === liveChatChannel?.url) {
          const sendbirdMessage = toSendbirdUserMessageModel(message, sendbirdUser.userId, showRoomName);

          if (message.messageType === 'user') {
            addMessage(sendbirdMessage);
          } else if (
            typeof sendbirdMessage.data !== 'string' &&
            sendbirdMessage.data.actionType === SendbirdActionType.MESSAGE
          ) {
            handleAddAlertMessage((sendbirdMessage as SendBirdAdminMessageModel).message);
          }
        } else if (channel.url === auctionChatChannel?.url) {
          const auctionMessage = toSendbirdUserMessageModel(message, sendbirdUser.userId) as SendBirdAdminMessageModel;

          if (auctionMessage.data.actionType === SendbirdActionType.MESSAGE_FOR_ADMIN) {
            return;
          }

          addAuctionMessage(auctionMessage);
        } else if (channel.url === interactionChannel?.url) {
          /**
           * 라이브 정보 갱신시 처리
           */
          const item = toSendbirdUserMessageModel(message, sendbirdUser.userId) as SendBirdAdminMessageModel;
          const {
            data: { actionType, actionIdentifier, actionValue },
          } = item;
          switch (actionType) {
            case SendbirdActionType.REFRESH_GOODS: // 상품 갱신
              updateLiveInfo();
              break;
            case SendbirdActionType.UPDATE_VIDEO_URL: // video url 갱신
              setTimeout(() => {
                handleReloadVideo(actionValue ?? null);
              }, 5000);
              break;
            case SendbirdActionType.SUBSCRIBE_SHOWROOM: // 쇼룸 구독요청
              if (actionIdentifier !== undefined) {
                handleUpdateFollowAwaiter({
                  id: Number(actionIdentifier),
                  timedMetaDate: Number(actionValue),
                });
              }
              break;
            case SendbirdActionType.RAFFLE_WINNER: // 당첨자 발표
              if (actionIdentifier !== undefined) {
                handleUpdateRaffleWinnerInfo({
                  id: Number(actionIdentifier),
                  timedMetaDate: Number(actionValue),
                });
              }
              break;
            case SendbirdActionType.END: // 방송 종료
              if (document.visibilityState === 'hidden') {
                return;
              }

              handleDialogEndedLive();
              break;

            case SendbirdActionType.SHOW_FAQ:
              publish(LIVE_FNB_EVENT_NAME, 'show');
              break;

            case SendbirdActionType.HIDE_FAQ:
              publish(LIVE_FNB_EVENT_NAME, 'hide');
              break;

            default:
              break;
          }
        }
      },
      // 사용자 메세지 갱신시 호출 event
      onMessageUpdated: (channel, message) => {
        debug.log('[sendbird - onMessageUpdated]', channel.url, message);
        if (channel.url !== liveChatChannel?.url || message.messageType !== 'user') {
          return;
        }

        const item = toSendbirdUserMessageModel(message, sendbirdUser.userId);

        setMessage(item);
      },
      // 사용자 메세지 삭제시 호출 event
      onMessageDeleted: (channel, messageId) => {
        debug.log('[sendbird - onMessageDeleted]', channel.url, messageId);
        if (channel.url !== liveChatChannel?.url && channel.url !== interactionChannel?.url) {
          return;
        }

        deleteMessage(messageId, channel.url !== liveChatChannel?.url ? MessageType.USER : MessageType.ADMIN);
      },

      // Meta data 받을시 호출 event
      onMetaDataUpdated: (channel, message) => {
        debug.log('[sendbird - onMetaDataUpdated]', channel.url, message);

        // 공지메세지 변경
        if (channel.url === liveChatChannel?.url) {
          /**
           * 공지메세지 변경시 ellipsis 초기화 처리후
           * 메세지 초기화 한 이후에 새 메세지 업데이트 처리
           */
          const newNoticeMessage = get(message, 'notice', null) as string;
          handleUpdateEllipsisCancel();
          setNoticeMessage(null);

          newNoticeMessage &&
            setTimeout(() => {
              setNoticeMessage(newNoticeMessage);
            }, 100);
        } else if (channel.url === auctionChatChannel?.url) {
          const auctionInfoString = get(message, 'auction_info', null) as string;
          if (auctionInfoString) {
            const auctionInfo = toLiveAuctionInfo(auctionInfoString);
            if (
              auctionInfo.status !== LiveAuctionStatus.BIDDING &&
              auctionInfo.status !== LiveAuctionStatus.COUNTDOWN &&
              auctionInfo.status !== LiveAuctionStatus.PAUSE
            ) {
              updateLiveInfo();
            }
          }
        }
      },

      // 메타카운트 업데이트
      onMetaCounterUpdated: (channel: BaseChannel, metaCounter: MetaCounter) => {
        debug.log('[sendbird - onMetaCounterUpdated]', channel, metaCounter);
        if (Object.keys(metaCounter).includes(LIVE_PURCHASE_VERIFICATION_METACOUNTER_KEY)) {
          publish(LIVE_PURCHASE_VERIFICATION_EVENT_NAME, nanoid());
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendbirdUser.userId, connected]);

  useEffect(() => {
    /**
     * 메세지 정보 initialize
     */
    const initializeMessage = async () => {
      try {
        if (!(chatChannelItem && sendbird && liveChatChannel && interactionChannel)) {
          return;
        }
        // const { messages, adminMessages } = await getPreviousMessage(liveChatChannel);
        // const interactionMessages = await getPreviousInteractionMessage(interactionChannel);
        const previousAuctionMessages = auctionChatChannel ? await getPreviousAuctionMessage(auctionChatChannel) : [];
        const previousNoticeMessage = await getNoticeMessage(liveChatChannel);

        // live chat messages, interaction chat messages merge
        // const mergeMessages = messages.concat(interactionMessages).sort((a, b) => {
        //   return Number(a.createdAt) - Number(b.createdAt);
        // });

        // dispatch({
        //   type: SendbirdReduceActionType.SET_MESSAGE,
        //   payload: { messages: mergeMessages, adminMessages, noticeMessage, auctionMessages },
        // });

        const lastAuctionMessages = previousAuctionMessages.filter(
          (_, index) => index === previousAuctionMessages.length - 1,
        );

        const metacounterData = await interactionChannel.getMetaCounters([LIVE_PURCHASE_VERIFICATION_METACOUNTER_KEY]);
        debug.log('메타카운터 정보', metacounter);

        setMessageItem({
          messages: [],
          adminMessages: [],
          noticeMessage: previousNoticeMessage,
          auctionMessages: lastAuctionMessages,
          metacounter: metacounterData,
        });
      } catch (error) {
        const { code } = error as SendbirdError;

        if (String(code).startsWith('8002')) {
          debug.warn('sendbird connect - reconnect');
          await disconnectSendbird();
          connectSendbird();
          return;
        }

        setError({
          message: '현재 서비스의 상태가 원활하지 않습니다',
          callbackGoHome: true,
        });
      }
    };

    initializeMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveChatChannel]);

  useEffect(() => {
    if (sendbird && !!chatChannelItem) {
      sendbird.addConnectionHandler(chatChannelItem.applicationId, connectionHandler);
      if (connected) {
        const openchannelHandler = getOpenChannelHandler();
        sendbird.openChannel.addOpenChannelHandler(chatChannelItem.applicationId, openchannelHandler);
      } else {
        sendbird.openChannel.removeOpenChannelHandler(chatChannelItem.applicationId);
      }
    }

    return () => {
      if (sendbird && chatChannelItem) {
        sendbird.removeConnectionHandler(chatChannelItem.applicationId);
        sendbird.openChannel.removeOpenChannelHandler(chatChannelItem.applicationId);
      }
    };
  }, [sendbird, chatChannelItem, getOpenChannelHandler, connectionHandler, connected]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, [handleVisibilityChange]);

  /**
   *  temp user message 추가
   */
  const addTempUserMessage = useCallback(() => {
    const jsonString =
      '{"_iid":"su-8d725d0b-3e17-4323-acea-72d389dcb79e","channelType":"open","parentMessage":null,"silent":false,"isOperatorMessage":true,"messageType":"user","mentionType":"users","threadInfo":null,"reactions":[],"metaArrays":[],"appleCriticalAlertOptions":null,"createdAt":1689849453177,"updatedAt":0,"scheduledInfo":null,"extendedMessage":{},"_isContinuousMessages":false,"_scheduledStatus":null,"messageId":5612880625,"channelUrl":"sendbird_open_channel_2864_4c4f284911ebdce915e7967949122a144f6b4e84","parentMessageId":0,"data":"","customType":"","mentionedUsers":[],"mentionedUserIds":[],"mentionedMessageTemplate":"","ogMetaData":null,"reqId":"1689846655811","replyToChannel":false,"errorCode":0,"sender":{"_iid":"su-8d725d0b-3e17-4323-acea-72d389dcb79e","userId":"show_time_21,658_5ec17b8a-de74-46d3-98f7-7d6d239fdfa7","nickname":"Collins","plainProfileUrl":"https://cdn-image-dev.prizm.co.kr/showroom/20220302/b52f31fc-9c02-4204-a07c-a2a02fc4ae5c.png","requireAuth":false,"metaData":{},"connectionStatus":"nonavailable","isActive":true,"lastSeenAt":null,"preferredLanguages":null,"friendDiscoveryKey":null,"friendName":null,"isBlockedByMe":false,"role":"operator"},"sendingStatus":"succeeded","message":"123","messageParams":null,"translations":{},"translationTargetLanguages":[],"messageSurvivalSeconds":-1,"plugins":[],"_poll":null}';
    const message = JSON.parse(jsonString);

    const sendbirdMessage = toSendbirdUserMessageModel(message, sendbirdUser.userId);

    if (message.messageType === 'user') {
      (sendbirdMessage as unknown as UserMessage).message = nanoid(8);
      (sendbirdMessage as unknown as UserMessage).messageId = new Date().valueOf();

      addMessage(sendbirdMessage);
    } else if (
      typeof sendbirdMessage.data !== 'string' &&
      sendbirdMessage.data.actionType === SendbirdActionType.MESSAGE
    ) {
      handleAddAlertMessage((sendbirdMessage as SendBirdAdminMessageModel).message);
    }
  }, [addMessage, handleAddAlertMessage, sendbirdUser.userId]);

  /**
   * 메세지 전송
   */
  const sendMessage = (message: string) => {
    if (sendbird === null) {
      return;
    }

    const params: UserMessageCreateParams = {
      message,
    };

    // eslint-disable-next-line consistent-return
    return new Promise<void>((resolve) => {
      if (liveChatChannel === null) {
        return null;
      }

      liveChatChannel
        .sendUserMessage(params)
        .onSucceeded((useMessage) => {
          debug.info(useMessage);
          addMessage(toSendbirdUserMessageModel(useMessage, sendbirdUser.userId));

          resolve();
        })
        .onFailed((error, errorMessage) => {
          debug.error(errorMessage);
          if (error) {
            const code = errorMessage?.errorCode;

            if (
              code === SendbirdErrorCode.BANNED_USER_SEND_MESSAGE_NOT_ALLOWED ||
              code === SendbirdErrorCode.USER_NOT_MEMBER
            ) {
              setError({
                title: '라이브 시청이 제한 되었습니다',
                message: '관리자에게 문의하세요',
                callbackGoHome: true,
              });
            }
          }
        });
    });
  };

  /**
   * 사용자 메세지 초기화
   */
  const deleteAllUserMessage = () => {
    deleteAllUserMessage();
  };

  return {
    messages: messages
      .filter((item) => item.messageType === MessageType.USER)
      .map((item) => item as SendBirdUserMessageModel),
    adminMessages,
    noticeMessage,
    auctionMessages,
    isLoading,
    error: sendbirdError,
    addTempUserMessage,
    sendMessage,
    deleteAllUserMessage,
    connect: connected,
    disconnectSendbird,
  };
};
