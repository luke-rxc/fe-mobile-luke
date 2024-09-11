import { UniversalLinkTypes } from '@constants/link';
import { LiveAuctionStatus, LiveContentsType, LiveStatus } from '@constants/live';
import { PageErrorProps } from '@features/exception/components';
import { ErrorActionButtonLabel, ErrorTitle } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { useDialog } from '@hooks/useDialog';
import { useLink } from '@hooks/useLink';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { getLiveInfo, getLivePurchaseVerification, putLiveCount } from '../apis';
import {
  ActionButtonType,
  LIVE_PURCHASE_VERIFICATION_QUERY_KEY,
  liveInfoQueryKey,
  LiveViewMode,
  LogEventTypes,
  previewLoadTime,
  ViewStatusType,
} from '../constants';
import {
  ReturnTypeUseDrawerStatus,
  ReturnTypeUseRaffleWinner,
  ReturnTypeUseShowroomFollow,
  useVideo,
  useVideoFullscreen,
} from '../hooks';
import { useSendbird } from '../hooks/useSendbird';
import { toLiveModel, toPurchaseVerificationStatusModel } from '../models';
import { LiveNotice, SendBirdUserInfo } from '../types';
import { ReturnTypeUseLiveChatService } from './useLiveChatService';
import { ReturnTypeUseLiveLogService } from './useLogService';
import { getIsPortait } from '../utils';
import { useLiveCouponIndicatorStore } from '../store';

export type ReturnTypeUseLiveService = ReturnType<typeof useLiveService>;
interface Props {
  liveId: number;
  sendbirdUser: SendBirdUserInfo;
  logService: ReturnTypeUseLiveLogService;
  goodsDrawer: ReturnTypeUseDrawerStatus;
  activeViewType: ActionButtonType | undefined;
  resetMessageScroll: ReturnTypeUseLiveChatService['resetMessageScroll'];
  handleUpdateFollowAwaiter: ReturnTypeUseShowroomFollow['handleUpdateFollowAwaiter'];
  handleUpdateRaffleWinnerInfo: ReturnTypeUseRaffleWinner['handleUpdateRaffleWinnerInfo'];
  handleUpdateEllipsisCancel: ReturnTypeUseLiveChatService['handleUpdateEllipsisCancel'];
  handleUpdateActiveViewType: ReturnTypeUseLiveChatService['handleUpdateActiveViewType'];
}

export const useLiveService = ({
  liveId,
  sendbirdUser,
  logService,
  goodsDrawer,
  activeViewType,
  resetMessageScroll,
  handleUpdateFollowAwaiter,
  handleUpdateRaffleWinnerInfo,
  handleUpdateEllipsisCancel,
  handleUpdateActiveViewType,
}: Props) => {
  const [isPortait, setIsPortait] = useState<boolean>(true);

  /* 라이브 모드  */
  const [liveMode, setLiveMode] = useState<LiveViewMode>(LiveViewMode.PREVIEW);
  /* 음소거  */
  const [muted, setMuted] = useState<boolean>(true);
  /* 비디오 리로드 flag  */
  const [reloadVideo, setReloadVideo] = useState<boolean>(false);
  /* 임시 공지메세지  */
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  /* ui view  */
  const [uiView, setUiView] = useState<ViewStatusType>(isPortait ? ViewStatusType.DEFAULT : ViewStatusType.HIDE);
  /* 커버 이미지 로드 */
  const [isCoverImageLoading, setIsCoverImageLoading] = useState(true);
  /* 영상 재생 여부 */
  const [playStreamVideo, setPlayStreamVideo] = useState(false);
  /* 라이브 종료 알림 여부 */
  const [endedAlertLive, setEndedAlertLive] = useState(false);
  /* 라이브 정보 초기로드 여부 */
  const liveLoaded = useRef<boolean>(false);

  const updateDownloadableCouponStatus = useLiveCouponIndicatorStore((state) => state.updateDownloadableCouponStatus);

  const {
    action: { handleErrorReloadCb, handleErrorHomeCb },
  } = useErrorService();

  const {
    logLiveInit: handleLogLiveInit,
    logLiveTabGoodsBanner: handleLogLiveTabGoodsBanner,
    logLiveTabAlertEndingConfirm: handleLogLiveTabAlertEndingConfirm,
    logLiveTabAlertEndingGotoShowroom: handleLogLiveTabAlertEndingGotoShowroom,
    logLiveTapShowroom: handleLogLiveTapShowroom,
  } = logService;

  const { openDialog } = useDialog();

  const queryClient = useQueryClient();
  const history = useHistory();
  const { getLink } = useLink();

  const {
    data: liveInfo,
    isLoading: isLoadingLiveInfo,
    isError: isErrorLiveInfo,
    error: liveError,
  } = useQuery([liveInfoQueryKey, liveId], () => getLiveInfo(liveId), {
    select: (data) => {
      return toLiveModel(data);
    },
  });

  const { data: purchaseVerifiable } = useQuery(
    [LIVE_PURCHASE_VERIFICATION_QUERY_KEY, liveId],
    () => getLivePurchaseVerification(liveId),
    {
      select: toPurchaseVerificationStatusModel,
      enabled: (sendbirdUser.login && liveInfo && liveInfo.liveStatus !== LiveStatus.END) || false,
    },
  );

  // 구매인증 테스트용 코드
  // const [purchaseVerifiable, setPurchaseVerifiable] = useState(false);
  // const { subscribe } = useCustomEvent();

  // useEffect(() => {
  //   subscribe(LIVE_PURCHASE_VERIFICATION_EVENT_NAME, () => {
  //     setPurchaseVerifiable((prev) => !prev);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const { mutateAsync: getLive } = useMutation(() => getLiveInfo(liveId));

  const { mutateAsync: enteredLive } = useMutation(() => putLiveCount(liveId, sendbirdUser.userId));

  // sendbird 활성화 여부
  const enabledSendbird = useMemo(() => {
    const defaultEnabled = !!liveInfo && liveInfo.liveStatus !== LiveStatus.END;
    if (sendbirdUser.login) {
      return defaultEnabled;
    }

    return defaultEnabled && !!activeViewType && activeViewType !== ActionButtonType.SCHEDULE;
  }, [activeViewType, liveInfo, sendbirdUser.login]);

  useEffect(() => {
    if (!sendbirdUser.login && enabledSendbird) {
      queryClient.refetchQueries([liveInfoQueryKey, liveId]);
    }
  }, [enabledSendbird, liveId, queryClient, sendbirdUser.login]);

  /**
   * 라이브 종료
   */
  const handleDialogEndedLive = useCallback(() => {
    setEndedAlertLive(true);
    openDialog({
      title: '라이브 방송이 종료되었습니다',
      desc: '시청해주셔서 감사합니다',
      confirm: {
        cb: async () => {
          handleLogLiveTabAlertEndingConfirm();
          history.replace(`/live/${liveId}/end`);
        },
        label: '확인',
      },
      disableBackDropClose: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleLogLiveTabAlertEndingConfirm, handleLogLiveTabAlertEndingGotoShowroom, liveInfo, openDialog]);

  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === 'visible') {
      if (!endedAlertLive) {
        await queryClient.invalidateQueries([LIVE_PURCHASE_VERIFICATION_QUERY_KEY, liveId]);
        const liveData = await getLive();
        queryClient.setQueryData([liveInfoQueryKey, liveId], liveData);

        if (liveData.liveStatus === LiveStatus.END) {
          handleDialogEndedLive();
        }
      }
    } else {
      resetMessageScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetMessageScroll, endedAlertLive, getLive, handleDialogEndedLive]);

  const handleRotate = useCallback((event: MediaQueryListEvent) => {
    const portrait = event.matches;

    if (portrait) {
      setUiView(ViewStatusType.SHOW);
      setIsPortait(true);
    } else {
      setUiView(ViewStatusType.HIDE);
      setIsPortait(false);
    }
  }, []);

  const handleRotateFoldType = useCallback(() => {
    if (window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180) {
      setUiView(ViewStatusType.SHOW);
      setIsPortait(true);
    } else {
      setUiView(ViewStatusType.HIDE);
      setIsPortait(false);
    }
  }, []);

  useEffect(() => {
    setIsPortait(getIsPortait());
  }, []);

  useEffect(() => {
    return () => {
      queryClient.removeQueries([liveInfoQueryKey, liveId]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!liveInfo) {
      return;
    }

    if (liveInfo.liveStatus !== LiveStatus.END) {
      enteredLive();
      handleLogLiveInit(liveInfo);
    } else {
      history.replace(`/live/${liveId}/end`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveInfo]);

  useEffect(() => {
    if (liveInfo && liveInfo.liveStatus !== LiveStatus.END) {
      document.addEventListener('visibilitychange', handleVisibilityChange, false);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, [handleVisibilityChange, liveInfo]);

  useEffect(() => {
    if (!liveInfo) {
      return () => {};
    }

    if (liveInfo.videoSize.isFoldTypeScreen) {
      window.addEventListener('orientationchange', handleRotateFoldType, false);
    } else {
      window.matchMedia('(orientation: portrait)').addEventListener('change', handleRotate);
    }

    return () => {
      window.matchMedia('(orientation: portrait)').removeEventListener('change', handleRotate);
      window.removeEventListener('orientationchange', handleRotateFoldType, false);
    };
  }, [handleRotateFoldType, handleRotate, liveInfo]);

  useEffect(() => {
    if (!liveInfo) {
      return;
    }

    updateDownloadableCouponStatus(liveInfo.hasDownloadableCoupon, !liveLoaded.current);

    if (!liveLoaded.current) {
      liveLoaded.current = true;
    }
  }, [liveInfo, updateDownloadableCouponStatus]);

  /**
   * 라이브 정보 업데이트
   */
  const updateLiveInfo = () => {
    queryClient.invalidateQueries([liveInfoQueryKey, liveId]);
  };

  /**
   * 비디오 reload trigger
   */
  const handleReloadVideo = (videoUrl: string | null) => {
    if (videoUrl !== null) {
      queryClient.setQueryData([liveInfoQueryKey, liveId], {
        ...liveInfo,
        videoUrl,
      });
    } else {
      updateLiveInfo();
    }
    setReloadVideo(true);
  };

  const handleUpdateReloadVideo = () => {
    setReloadVideo(false);
  };

  /**
   * 라이브 알림메세지 표시
   */
  const handleAddAlertMessage = (message: string) => {
    setAlertMessage(message);
  };

  /**
   * 라이브 알림메세지 초기화
   */
  const handleClearAlertMessage = useCallback(() => {
    setAlertMessage(null);
  }, []);

  /**
   * 홈으로 이동
   */
  const handleGoHome = () => {
    history.replace('/');
  };

  /**
   * 영상 재생여부 업데이트
   */
  const handleUpdateLoadedStreamVideo = () => {
    setPlayStreamVideo((prev) => {
      if (!prev) {
        return true;
      }

      return prev;
    });
  };

  const videoProps = useVideo({
    streamUrl: liveInfo?.videoUrl,
    handleUpdateLoadedStreamVideo,
  });

  const fullscreenProps = useVideoFullscreen({
    enabled: liveInfo?.videoSize?.horizontalRatioVideo || false,
    videoRef: videoProps.videoRef,
  });

  const {
    messages,
    adminMessages,
    noticeMessage,
    auctionMessages,
    isLoading: isLoadingSendbird,
    error: sendbirdError,
    sendMessage,
    disconnectSendbird,
  } = useSendbird({
    chatChannelItem: liveInfo?.chatChannel,
    sendbirdUser,
    showRoomName: liveInfo?.showRoom.name || '',
    liveMode,
    updateLiveInfo,
    handleReloadVideo,
    handleDialogEndedLive,
    handleAddAlertMessage,
    handleUpdateFollowAwaiter,
    handleUpdateRaffleWinnerInfo,
    handleUpdateEllipsisCancel,
    handleUpdateActiveViewType,
    enabled: enabledSendbird,
  });

  /**
   * live mode 변경
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let viewChangeTimeout: NodeJS.Timeout | null = null;
    if (
      !isLoadingSendbird &&
      (!sendbirdError || !sendbirdError.isError) &&
      !!liveInfo?.videoUrl &&
      liveInfo.liveStatus !== LiveStatus.END
    ) {
      timeout = setTimeout(() => {
        setLiveMode(LiveViewMode.LIVE);

        if (liveInfo.videoSize.horizontalRatioVideo && sendbirdUser.login) {
          viewChangeTimeout = setTimeout(() => {
            handleUpdateActiveViewType(ActionButtonType.CHAT);
          }, 850);
        }
      }, previewLoadTime);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (viewChangeTimeout) {
        clearTimeout(viewChangeTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sendbirdError,
    isLoadingSendbird,
    liveInfo?.liveStatus,
    liveInfo?.videoUrl,
    liveInfo?.videoSize.horizontalRatioVideo,
    sendbirdUser.login,
  ]);

  /**
   * temp message 추가 timer
   */
  // useEffect(() => {
  //   let timeout2: NodeJS.Timeout | null = null;
  //   if (
  //     !isLoadingSendbird &&
  //     (!sendbirdError || !sendbirdError.isError) &&
  //     liveMode === LiveViewMode.LIVE &&
  //     activeViewType === ActionButtonType.CHAT
  //   ) {
  //     timeout2 = setInterval(() => {
  //       addTempUserMessage();
  //     }, 2000);
  //   }

  //   return () => {
  //     if (timeout2) {
  //       clearInterval(timeout2);
  //     }
  //   };
  // }, [sendbirdError, isLoadingSendbird, addTempUserMessage, liveMode, activeViewType]);

  const auctionMessagesByCurrentAuctionId = useMemo(() => {
    if (!liveInfo) {
      return [];
    }

    // currentAuctionId 해당하는 auction item이 cancel 상태면 auctionMessages 제외처리
    const currentAuction = liveInfo.auctionList.find((item) => item.id === liveInfo.currentAuctionId);
    if (currentAuction?.status === LiveAuctionStatus.CANCEL) {
      return [];
    }

    return auctionMessages?.filter(
      (item) => item.customType === (liveInfo.currentAuctionId ? liveInfo.currentAuctionId.toString() : null),
    );
  }, [auctionMessages, liveInfo]);

  const lastUserMessage = useMemo(() => {
    if (messages.length === 0) {
      return undefined;
    }

    return messages[messages.length - 1];
  }, [messages]);

  const lastAuctionMessage = useMemo(() => {
    if (liveMode === LiveViewMode.PREVIEW || auctionMessagesByCurrentAuctionId.length === 0) {
      return undefined;
    }

    return auctionMessagesByCurrentAuctionId[auctionMessagesByCurrentAuctionId.length - 1];
  }, [auctionMessagesByCurrentAuctionId, liveMode]);

  const liveNotice = useMemo(() => {
    if (noticeMessage) {
      return {
        showRoom: liveInfo?.showRoom,
        message: noticeMessage,
      } as LiveNotice;
    }
    return undefined;
  }, [noticeMessage, liveInfo?.showRoom]);

  /**
   * 에러 정보
   */
  const errorInfo: PageErrorProps | null = useMemo(() => {
    if (isErrorLiveInfo) {
      if (liveError?.data?.message) {
        return {
          description: liveError?.data?.message ?? null,
          actionLabel: ErrorActionButtonLabel.HOME,
          onAction: handleErrorHomeCb,
        } as PageErrorProps;
      }

      return {
        description: ErrorTitle.Network,
        actionLabel: ErrorActionButtonLabel.RELOAD,
        onAction: handleErrorReloadCb,
      } as PageErrorProps;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorLiveInfo, liveError]);

  useEffect(() => {
    if (sendbirdError) {
      openDialog({
        title: sendbirdError.title ?? '',
        desc: sendbirdError.message,
        confirm: {
          label: '확인',
          ...(sendbirdError.callbackGoHome && { cb: handleGoHome }),
        },
        disableBackDropClose: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendbirdError]);

  /**
   * mute update
   */
  const handleToggleMuted = () => {
    setMuted((prev) => !prev);
  };

  /**
   * 라이브 상품 목록 표시
   */
  const handleClickShowGoodsList = async () => {
    if (
      liveMode === LiveViewMode.PREVIEW ||
      !liveInfo ||
      (liveInfo.goodsList.length === 0 && liveInfo.auctionList.length === 0)
    ) {
      return;
    }

    if (liveInfo.contentsType === LiveContentsType.STANDARD) {
      if (liveInfo.goodsList.length > 1 || liveInfo.hasDownloadableCoupon) {
        goodsDrawer.handleUpdateOpened(true);
        handleLogLiveTabGoodsBanner();
      } else {
        const {
          goods: { id, name, code },
        } = liveInfo.goodsList[0];
        await disconnectSendbird();
        history.push(getLink(UniversalLinkTypes.GOODS, { goodsCode: code }));
        handleLogLiveTabGoodsBanner({
          goodsId: id.toString(),
          goodsName: name,
        });
      }
    } else if (liveInfo.contentsType === LiveContentsType.AUCTION) {
      if (!liveInfo.currentAuctionId) {
        return;
      }

      if (liveInfo.multiTypeContents) {
        goodsDrawer.handleUpdateOpened(true);
        handleLogLiveTabGoodsBanner();
        return;
      }

      const currentAuction = liveInfo.auctionList.find((item) => item.id === liveInfo.currentAuctionId);

      if (currentAuction) {
        await disconnectSendbird();
        history.push(getLink(UniversalLinkTypes.GOODS, { goodsCode: currentAuction.goodsDetail.goods.code }));
        handleLogLiveTabGoodsBanner({
          goodsId: currentAuction.goodsDetail.goods.id.toString(),
          goodsName: currentAuction.goodsDetail.goods.name,
        });
      }
    }
  };

  /**
   * 라이브 상품 drawer close event
   */
  const handleCloseLiveGoodsDrawer = () => {
    goodsDrawer.handleUpdateOpened(false);
  };

  const handleToggleUiView = (event: React.MouseEvent) => {
    if (event.target !== event.currentTarget || !isPortait) {
      return;
    }

    setUiView((prev) => (prev === ViewStatusType.HIDE ? ViewStatusType.SHOW : ViewStatusType.HIDE));
  };

  /**
   * 커버 이미지 로드
   */
  useEffect(() => {
    // data load
    if (isLoadingLiveInfo) {
      return;
    }

    // image path check after data load
    /** @todo coverImage 가 필수가 아니라면 체크 */
    if (!liveInfo?.coverImage.path) {
      return;
    }

    if (isCoverImageLoading) {
      const image = document.createElement('img');
      image.src = liveInfo.coverImage.path;
      // success
      image.onload = () => {
        setIsCoverImageLoading(false);
      };
      // error 처리
      image.onerror = () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCoverImageLoading, isLoadingLiveInfo]);

  /**
   * 채팅 메세지 submit
   */
  const handleSubmitMessage = (message: string) => {
    sendMessage(message);
  };

  /**
   * 쇼룸 페이지 이동
   */
  const handleClickShowroom = (logEventType: LogEventTypes, showroomLink: string) => {
    const callback = handleLogLiveTapShowroom(logEventType);
    return async () => {
      await disconnectSendbird();
      callback();
      history.push(showroomLink);
    };
  };

  const isLoading = isLoadingLiveInfo || isCoverImageLoading;
  const isError = isErrorLiveInfo || liveInfo?.liveStatus === LiveStatus.END;

  return {
    // liveInfo,
    isExistLiveInfo: !!liveInfo,
    isLoading,
    isError,
    errorInfo,
    uiView,
    purchaseVerifiable: !!purchaseVerifiable,
    hasDownloadableCoupon: liveInfo?.hasDownloadableCoupon || false,
    handleSubmitMessage,
    webSocket: {
      enabledSendbird,
      enabled: !isLoading && !isError && liveMode === LiveViewMode.LIVE,
    },
    headerAnimation: {
      usedAnimation: liveInfo?.contentsType === LiveContentsType.AUCTION && !!liveInfo?.liveTitleLogo.secondaryImage,
      isLiveMode: liveMode === LiveViewMode.LIVE,
    },
    seo: {
      ...liveInfo?.seo,
      helmetProps: { title: liveInfo?.seo.title },
    },
    header: {
      showroom: liveInfo?.showRoom,
      contentsType: liveInfo?.contentsType,
      liveTitleLogo: liveInfo?.liveTitleLogo,
      uiView,
      liveMode,
      handleClickShowroom,
    },
    liveMute: {
      show: playStreamVideo && liveMode === LiveViewMode.LIVE,
      active: !muted,
      onClickToggle: handleToggleMuted,
    },
    preview: {
      coverImage: liveInfo?.coverImage.path,
      title: liveInfo?.title,
      description: liveInfo?.description,
      emptyDealGoods: !liveInfo?.dealGoodsItem,
      liveMode,
    },
    viewer: {
      muted,
      streamUrl: liveInfo?.videoUrl,
      reloadVideo,
      liveMode,
      videoSize: liveInfo?.videoSize,
      videoProps,
      fullscreenProps,
      isPortait,
      onToggleUiView: fullscreenProps.enabled ? fullscreenProps.onClickFullscreen : handleToggleUiView,
      onUpdateReloadVideo: handleUpdateReloadVideo,
    },
    chat: {
      liveInfo,
      liveMode,
      lastAuctionMessage,
      uiView,
      showPurchaseVerificationButton: !!purchaseVerifiable,
      messages,
      adminMessages,
      liveNotice,
      auctionMessages,
      lastUserMessage,
      alertMessage,
      handleClearAlertMessage,
      handleToggleUiView: fullscreenProps.enabled ? fullscreenProps.onClickFullscreen : handleToggleUiView,
    },
    dealBanner: {
      contentsType: liveInfo?.contentsType,
      dealGoodsItems: liveInfo?.dealGoodsItems,
      openningAuctionItem: liveInfo?.openningAuctionItem,
      multiTypeContents: liveInfo?.multiTypeContents,
      lastAuctionMessage,
      uiView,
      liveMode,
      onClickShowGoodsList: handleClickShowGoodsList,
    },
    actionButtons: {
      show: liveMode === LiveViewMode.LIVE,
      contentsType: liveInfo?.contentsType,
      uiView,
      isPortait,
    },
    goodsDrawer: {
      onCloseDrawer: handleCloseLiveGoodsDrawer,
    },
    goodsList: {
      items: liveInfo?.goodsList,
      multiTypeContents: liveInfo?.multiTypeContents,
    },
  };
};
