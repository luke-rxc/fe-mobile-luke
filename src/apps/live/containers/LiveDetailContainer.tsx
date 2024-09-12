import { PageError } from '@features/exception/components';
import { useEffect } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useTheme } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import {
  ActionButtons,
  LiveHeader,
  LivePreview,
  StreamViewer,
  DealBanner,
  LiveStyled,
  LiveGradientStyled,
  LiveGoodsList,
  ToggleMuteIcon,
  LiveContents,
  ScheduleDrawer,
  ScheduleItems,
  LiveFollowDrawer,
  LiveFollowView,
  ChatBlock,
  GoodsDrawer,
  LiveChatArea,
  ReactionArea,
  LiveMeta,
  FaqDrawer,
  LiveCouponList,
} from '../components';
import { ActionButtonType, ViewStatusType } from '../constants';
import {
  useDrawerStatus,
  useLiveHeaderAnimation,
  useShowroomFollow,
  useStreamVideoTimeTracker,
  useUser,
  useInputFocus,
  useContentEditable,
  useRaffleWinner,
  useLiveWebSocket,
  useLiveFnb,
} from '../hooks';
import {
  useLiveChatService,
  useLiveService,
  useLogService,
  useScheduleModalService,
  useLiveUserActionService,
  useLiveCouponService,
} from '../services';
import { WinnerAnnounceContainer } from './WinnerAnnounceContainer';
import { useLiveFaqService } from '../services/useLiveFaqService';
import { FaqList } from '../components/FaqList';

interface Props {
  liveId: number;
}

/**
 * LiveDetailContainer 16
 */
export const LiveDetailContainer = ({ liveId }: Props) => {
  const theme = useTheme();
  const { isMobile } = useDeviceDetect();
  const logService = useLogService();
  const { handlePauseVideo, handlePlayVideo } = useStreamVideoTimeTracker({
    updateLiveViewPauseTime: logService.updateLiveViewPauseTime,
  });

  const { sendbirdUser, handleLogin } = useUser();

  const goodsDrawer = useDrawerStatus();
  const scheduleDrawer = useDrawerStatus();
  const showroomFollowDrawer = useDrawerStatus();
  const raffleWinnerDrawer = useDrawerStatus();
  const faqDrawer = useDrawerStatus();

  const {
    activeViewType,
    toMessageScrollBottom,
    resetMessageScroll,
    handleUpdateActiveViewType,
    handleUpdateShowLastMessage,
    handleUpdateEllipsisCancel,
    ...liveChatServiceProps
  } = useLiveChatService({ logService });

  const {
    focused: inputFocused,
    initialInnerHeight,
    focusedInnerHeight,
    handleBlur,
    handleFocus,
  } = useInputFocus({ toMessageScrollBottom, handleUpdateEllipsisCancel });

  const {
    followData,
    showroomList,
    handleClearFollowData,
    handleUpdateFollowAwaiter,
    handlePendingFollowEndTimer,
    handlePendingCancelFollowEndTimer,
    handleUpdateFollowStatus,
  } = useShowroomFollow({
    disabledFollow:
      goodsDrawer.opened || scheduleDrawer.opened || activeViewType === ActionButtonType.AUCTION || inputFocused,
    showroomFollowDrawer,
    logService,
  });

  const { handleUpdateRaffleWinnerInfo, ...raffleWinner } = useRaffleWinner({
    liveId,
    raffleWinnerDrawer,
  });

  const {
    isExistLiveInfo,
    isLoading,
    isError,
    errorInfo,
    purchaseVerifiable,
    uiView,
    hasDownloadableCoupon,
    handleSubmitMessage,
    ...liveServiceProps
  } = useLiveService({
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
  });

  useLiveWebSocket({ liveId, ...liveServiceProps.webSocket, userId: sendbirdUser.userId });

  const contentEditable = useContentEditable({ handleSubmitMessage, handleFocus, handleBlur });

  const { scheduleModalItems, handleOpenScheduleModal, handleCloseScheduleModal, handleClickOpenContents } =
    useScheduleModalService({
      liveId,
      logService,
      enabledScheduleModal: isExistLiveInfo,
      scheduleDrawer,
    });

  const { showroomFollowLoading, handleAction: handleUserAction } = useLiveUserActionService({
    liveId,
    isLogin: sendbirdUser.login,
    showroomList,
    logService,
    handleLogin,
    handlePendingFollowEndTimer,
    handlePendingCancelFollowEndTimer,
    handleUpdateFollowStatus,
  });

  const faqServiceProps = useLiveFaqService({
    liveId,
    openCallbackFunc: () => faqDrawer.handleUpdateOpened(true),
    closeCallbackFunc: () => faqDrawer.handleUpdateOpened(false),
    enabled: faqDrawer.opened,
  });

  const liveCouponServiceProps = useLiveCouponService({
    liveId,
    isOpenedGoodsDrawer: goodsDrawer.opened,
    hasDownloadableCoupon,
    isLogin: sendbirdUser.login,
    handleLogin,
    handleLogLiveImpressionCoupon: logService.logLiveImpressionGoodsListCoupon,
    handleLogLiveTabCouponDownload: logService.logLiveTabGoodsListCouponDownload,
    handleLogLiveCompleteCouponDownload: logService.logLiveCompleteGoodsListCouponDownload,
  });

  useLiveFnb({ fnb: liveServiceProps?.chat?.liveInfo?.fnb });

  const { animationStatus, handleAnimateEnd } = useLiveHeaderAnimation(liveServiceProps.headerAnimation);

  useEffect(() => {
    if (!isError) {
      document.body.style.backgroundColor = theme.light.color.black;
    }

    return () => {
      document.body.style.backgroundColor = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useHeaderDispatch({
    type: 'mweb',
    enabled: isError,
    quickMenus: ['cart', 'menu'],
  });

  if (isError) {
    return <PageError {...errorInfo} isFull />;
  }

  // TODO: 추후 로딩화면 처리
  if (!isExistLiveInfo || isLoading) {
    return null;
  }

  return (
    <>
      <LiveMeta {...liveServiceProps.seo} />
      <LiveStyled height={focusedInnerHeight}>
        <LiveContents height={initialInnerHeight} $isMobile={isMobile}>
          <LiveHeader
            {...liveServiceProps.header}
            show={!inputFocused}
            animationStatus={animationStatus}
            raffleWinner={raffleWinner.openedDrawer}
            onAnimateEnd={handleAnimateEnd}
          >
            <ToggleMuteIcon {...liveServiceProps.liveMute} />
          </LiveHeader>
          <LivePreview {...liveServiceProps.preview} />

          <StreamViewer
            {...liveServiceProps.viewer}
            height={initialInnerHeight}
            inputFocused={inputFocused}
            onPauseStreamVideo={handlePauseVideo}
            onPlayStreamVideo={handlePlayVideo}
          />

          <LiveChatArea
            {...liveServiceProps.chat}
            {...liveChatServiceProps}
            activeViewType={activeViewType}
            toMessageScrollBottom={toMessageScrollBottom}
            contentEditable={contentEditable}
            inputFocused={inputFocused}
            sendbirdUser={sendbirdUser}
            horizontalRatioVideo={liveServiceProps.viewer.videoSize?.horizontalRatioVideo || false}
            handleUserAction={handleUserAction}
            handleUpdateShowLastMessage={handleUpdateShowLastMessage}
            handleLogLiveImpressionPurchaseVerification={logService.logLiveImpressionPurchaseVerification}
          />

          <ChatBlock
            contentEditable={contentEditable}
            inputFocused={inputFocused}
            showPurchaseVerificationButton={purchaseVerifiable}
            horizontalRatioVideo={liveServiceProps.viewer.videoSize?.horizontalRatioVideo || false}
            onClickUserAction={handleUserAction}
          />

          <LiveGradientStyled className={uiView} />

          <DealBanner
            {...liveServiceProps.dealBanner}
            activeViewType={activeViewType}
            inputFocused={inputFocused}
            onClickUserAction={handleUserAction}
          />

          <ActionButtons
            {...liveServiceProps.actionButtons}
            activeButtonType={activeViewType}
            inputFocused={inputFocused}
            onClickChangeActive={handleUpdateActiveViewType}
            onClickScheduleModal={handleOpenScheduleModal}
            onClickFaqModal={faqServiceProps.handleOpen}
          />

          <GoodsDrawer {...liveServiceProps.goodsDrawer} opened={goodsDrawer.opened}>
            <LiveGoodsList
              {...liveServiceProps.goodsList}
              isOpen={goodsDrawer.opened}
              isLoading={liveCouponServiceProps.isFetching}
              openValue={goodsDrawer.openValue}
              couponElement={<LiveCouponList {...liveCouponServiceProps} showroom={liveServiceProps.header.showroom} />}
              onLogLiveTabGoods={logService.logLiveTabGoods}
              onLogLiveImpressionGoodsList={logService.logLiveImpressionGoodsList}
              onClickUserAction={handleUserAction}
            />
          </GoodsDrawer>

          <ScheduleDrawer opened={scheduleDrawer.opened} onCloseDrawer={handleCloseScheduleModal}>
            <ScheduleItems
              items={scheduleModalItems}
              opened={scheduleDrawer.opened}
              onClickUserAction={handleUserAction}
              onClickOpenContents={handleClickOpenContents}
            />
          </ScheduleDrawer>

          <LiveFollowDrawer opened={showroomFollowDrawer.opened} onCloseDrawer={handleClearFollowData}>
            <LiveFollowView
              showroom={followData.runner?.showroom ?? null}
              isLoadingFollow={showroomFollowLoading}
              onClickUserAction={handleUserAction}
            />
          </LiveFollowDrawer>

          <FaqDrawer opened={faqDrawer.opened} onCloseDrawer={faqServiceProps.handleClose}>
            {faqDrawer.opened && (
              <FaqList
                items={faqServiceProps.faqList}
                isLoading={faqServiceProps.isLoading}
                onClickItem={faqServiceProps.handleClickFaqItem}
              />
            )}
          </FaqDrawer>

          <WinnerAnnounceContainer
            show={raffleWinner.openedDrawer}
            liveRaffleWinnerItem={raffleWinner.liveRaffleWinnerItem}
            onClose={raffleWinner.handleClearRaffleWinner}
          />
        </LiveContents>
        <ReactionArea show={uiView !== ViewStatusType.HIDE && activeViewType === ActionButtonType.CHAT} />
      </LiveStyled>
    </>
  );
};
