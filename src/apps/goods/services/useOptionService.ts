import { useState, useEffect, useRef, createElement } from 'react';
import { useUnmount } from 'react-use';
import isEmpty from 'lodash/isEmpty';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useLink } from '@hooks/useLink';
import { useDrawer } from '@hooks/useDrawer';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { getWebLink, getImageLink } from '@utils/link';
import { UniversalLinkTypes, WebLinkTypes } from '@constants/link';
import { GoodsType, GoodsAuctionStatusType, FloatingBannerOrder, FloatingBannerType } from '@constants/goods';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { useUserAdultService } from '@features/authIntegrate/services';
import { AuthCloseWebAppType, AuthErrorCode } from '@features/authIntegrate/constants';
import { AuthAdultReceiveProps } from '@features/authIntegrate/types';
import { ErrorTitle } from '@features/exception/constants';
import { useFloating } from '@features/floating';
import { disabledBodyScroll, enabledBodyScroll } from '@utils/bodyScroll';
import { Snackbar, SnackbarProps } from '@pui/snackbar';
import { GoodsModel, toGoodsOptionModel, OptionSelectedModel } from '../models';
import { useGoodsPageInfo } from '../hooks';
import { debug } from '../utils';
import { OptionSaveActionType, GoodsMessage } from '../constants';
import { useOptionActionService } from './useOptionActionService';
import { useGoodsOptionsAction, useGoodsOptionsState } from '../stores';

interface OptionCloseRefType {
  type: OptionSaveActionType | null;
  checkoutId?: number;
}

interface Props {
  detailGoods: GoodsModel | null;
  onReload: () => void;
  onRemoveLiveFloating: (id: number) => void;
  onLogOptionOpen?: () => void;
  onLogViewIdentifyAdult: () => void;
  onLogCompleteIdentifyAdult: (isAdult: boolean) => void;
  onLogAddToCart: (optionSelectedParams: OptionSelectedModel) => void;
  onLogTabToCheckout: (optionSelectedParams: OptionSelectedModel) => void;
  onLogCloseOptionModal: () => void;
}

export const useOptionService = ({
  detailGoods,
  onReload: handleReload,
  onRemoveLiveFloating: handleRemoveLiveFloating,
  onLogOptionOpen: handleLogOptionOpen,
  onLogViewIdentifyAdult: handleLogViewIdentifyAdult,
  onLogCompleteIdentifyAdult: handleLogCompleteIdentifyAdult,
  onLogAddToCart: handleLogAddToCart,
  onLogTabToCheckout: handleLogTabToCheckout,
  onLogCloseOptionModal: handleLogCloseOptionModal,
}: Props) => {
  const { getIsLogin } = useAuth();
  const { isApp, isDesktop } = useDeviceDetect();
  const { toLink, getLink } = useLink();
  const { signIn, openGoodsOption, alert, receiveValues, emitCartItemUpdated, addedToCartValue } = useWebInterface();
  const { goodsPageId, goodsId, showRoomId, isInLivePage, deepLink } = useGoodsPageInfo();
  const { open, drawerOpen, drawerClose } = useDrawer();
  const { openDialogToApp, getIsDialogActionActive } = useMwebToAppDialog();
  const goodsOptions = useGoodsOptionsState();
  const { deleteGoodsOption } = useGoodsOptionsAction();
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isOptionDrawerOpen, setIsOptionDrawerOpen] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps | null>();
  const optionCloseType = useRef<OptionCloseRefType>({
    type: null,
  });
  const isShown = useRef<boolean>(false);
  const timeout = useRef<number | null>(null);
  const isAdded = useRef<boolean>(false);
  const { remove, show, hide } = useFloating(FloatingBannerType.CART_SNACKBAR, createElement(Snackbar, snackbarProps), {
    order: FloatingBannerOrder.TOP,
    enabled: !!detailGoods?.id && !!snackbarProps,
    defaultVisible: false,
    onAdded: () => {
      isAdded.current = true;
      show();
    },
    onShown: () => {
      isShown.current = true;
      timeout.current = window.setTimeout(() => {
        hide();
      }, 5000);
    },
    onHidden: () => {
      isShown.current = false;
      timeout.current = null;
    },
  });

  const isCloseConfirm = goodsOptions.some(({ id, options, expired }) => id === goodsId && expired && isEmpty(options));
  const sendWebOptionData = !isApp && detailGoods ? toGoodsOptionModel(detailGoods, showRoomId) : null;

  // 옵션 관련 API
  const { handleActionSave, handleDeleteExpired } = useOptionActionService({
    cartMutateOptions: {
      onSuccess: () => {
        optionCloseType.current = {
          type: OptionSaveActionType.CART,
        };
        drawerClose();
        emitCartItemUpdated({ isAdded: true });
      },
    },
    orderMutateOptions: {
      onSuccess: ({ orderCheckoutId: checkoutId }) => {
        optionCloseType.current = {
          type: OptionSaveActionType.ORDER,
          checkoutId,
        };
        drawerClose();
      },
    },
    seatOrderMutateOptions: {
      onSuccess: ({ orderCheckoutId: checkoutId }) => {
        optionCloseType.current = {
          type: OptionSaveActionType.SEAT_ORDER,
          checkoutId,
        };
        drawerClose();
      },
    },
    onLogAddToCart: handleLogAddToCart,
    onLogTabToCheckout: handleLogTabToCheckout,
  });

  // 성인인증 관련
  const { handleGetUserAdultInfo, toAuthAdultIntegrate } = useUserAdultService();

  // closeConfirm 으로 옵션 닫을 경우
  const handleOptionCloseWithDeleteExpired = () => {
    const option = goodsOptions.find(({ id, expired }) => id === goodsId && expired);

    if (!option) {
      return;
    }

    const { options, expired } = option;

    if (isEmpty(options)) {
      const { layoutIds } = expired ?? {};

      layoutIds && handleDeleteExpired({ layoutIds });
      deleteGoodsOption(goodsId);
    }

    handleOptionClose();
  };

  // only MWeb
  const handleOptionClose = () => {
    if (!isApp) {
      optionCloseType.current = {
        type: null,
      };
      drawerClose();
      handleLogCloseOptionModal();
    }
  };

  const handleOptionCloseComplete = () => {
    if (isApp) {
      return;
    }

    // option node 삭제
    setIsOptionOpen(false);

    if (!optionCloseType.current || !optionCloseType.current.type) {
      return;
    }

    const { type, checkoutId } = optionCloseType.current;

    if (type === OptionSaveActionType.CART) {
      return;
    }

    if (type === OptionSaveActionType.ORDER || type === OptionSaveActionType.SEAT_ORDER) {
      if (!checkoutId) {
        // 주문 연동이 완료되고도 checkoutId 를 못받은 경우 (예외 케이스)
        alert({
          title: ErrorTitle.Network,
          message: GoodsMessage.ERROR_ORDER_CHECKOUT_ID,
        });
        return;
      }

      toLink(
        getWebLink(WebLinkTypes.CHECKOUT, {
          checkoutId,
          ...(type === OptionSaveActionType.SEAT_ORDER && { goodsCode: goodsPageId }),
        }),
      );
    }
  };

  const handleRedirectLive = (liveId: number) => {
    toLink(getLink(UniversalLinkTypes.LIVE, { liveId }));
  };

  const handleOptionOpen = async () => {
    // 예외 처리 : 데이터가 없을 수 없음
    if (detailGoods === null) {
      return;
    }

    if (getIsDialogActionActive(AppPopupActionKind.PDP_PURCHASE)) {
      openDialogToApp(deepLink, {
        actionProps: {
          kind: AppPopupActionKind.PDP_PURCHASE,
          timerEnabled: true,
        },
      });
      return;
    }

    // PC 환경일 경우 alert 메세지 노출
    if (isDesktop) {
      alert({
        message: '상품 구매는 모바일 환경의 Web & APP에서 가능합니다',
      });
      return;
    }

    // Logging
    handleLogOptionOpen?.();

    const { type, status, liveId } = detailGoods;

    // 일반 상품상세 페이지내에서 경매 참여중인 상태에는 옵션 창을 활성화 하지 않고, 라이브 페이지로 이동
    const isBidding = type === GoodsType.AUCTION && status === GoodsAuctionStatusType.BID;
    if (isBidding) {
      if (!isInLivePage) {
        if (liveId !== null) {
          handleRemoveLiveFloating(liveId);
          handleRedirectLive(liveId);
        }
      }
      return;
    }

    if (!getIsLogin()) {
      const signInResult = await signIn();
      if (signInResult) {
        handleReload();
        checkAdultBeforeOptionOpen(detailGoods);
      }

      return;
    }

    checkAdultBeforeOptionOpen(detailGoods);
  };

  /** @todo promise return 검토 */
  const checkAdultBeforeOptionOpen = async (detailGoodsParams: GoodsModel) => {
    /**
     * 성인인증 체크
     */
    const { isAdultRequired } = detailGoodsParams;
    if (isAdultRequired) {
      try {
        const { isAdult, merchantId, shopId } = await handleGetUserAdultInfo();
        // 인증이 된 상태 (성인)
        if (isAdult) {
          executeOptionOpen(detailGoodsParams);
        } else {
          // PC 환경일 경우 앱유도 팝업 노출
          if (isDesktop) {
            openDialogToApp(deepLink, {
              actionProps: {
                kind: AppPopupActionKind.AUTH_ADULT,
              },
            });
            return;
          }
          // 미성년 또는 미인증자는 팝업
          const isConfirm = await toAuthAdultIntegrate(merchantId, shopId);

          // Logging
          if (isConfirm) {
            handleLogViewIdentifyAdult();
          }
        }
      } catch (e) {
        // useUserAdultService 에서 Alert 처리
        // 미성년인 케이스는 500오류
      }
    } else {
      executeOptionOpen(detailGoodsParams);
      emitCartItemUpdated({ isAdded: false });
    }
  };

  const executeOptionOpen = (detailGoodsParams: GoodsModel) => {
    if (!isApp) {
      drawerOpen();
      return;
    }

    const sendAppOptionData = toGoodsOptionModel(detailGoodsParams, showRoomId);
    openGoodsOption(sendAppOptionData);
  };

  /** Live - 장바구니 스낵바 노출 */
  const handleShowFloatingBanner = async () => {
    if (isShown.current) {
      timeout.current && window.clearTimeout(timeout.current);
      await hide();
      show();
      return;
    }

    isAdded.current && show();
  };

  /** 성인인증 진행여부 */
  const handleUserAdultProgress = () => {
    debug.log('[useOptionService]receiveValues', receiveValues);
    const { type, data } = receiveValues as AuthAdultReceiveProps;
    if (type === AuthCloseWebAppType.AUTH_ADULT) {
      const { isAuthSuccess, message, code } = data;
      if (isAuthSuccess) {
        detailGoods && executeOptionOpen(detailGoods);
        handleLogCompleteIdentifyAdult(true);
      } else {
        if (message === null) {
          return;
        }

        alert({
          message,
        });

        // code
        if (code && code === AuthErrorCode.UNDER_AGE) {
          handleLogCompleteIdentifyAdult(false);
        }
      }
    }
  };

  useEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }

    handleUserAdultProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  /** [MWEB] option open */
  useEffect(() => {
    if (open && !isOptionOpen) {
      setIsOptionOpen(true);
    }

    if (!open && isOptionDrawerOpen) {
      handleOptionCloseWithDeleteExpired();
      setIsOptionDrawerOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (isOptionOpen) {
      disabledBodyScroll();
      !isOptionDrawerOpen && setIsOptionDrawerOpen(true);
    } else {
      enabledBodyScroll();
    }
    return () => {
      isOptionOpen && enabledBodyScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOptionOpen]);

  useEffect(() => {
    if (!isApp || !addedToCartValue || !detailGoods) {
      return;
    }

    if (!snackbarProps) {
      const { primaryImage } = detailGoods;

      setSnackbarProps({
        title: '',
        message: GoodsMessage.CART_SAVED,
        action: {
          label: '이동',
          href: getLink(UniversalLinkTypes.CART),
        },
        image: {
          src: getImageLink(primaryImage.path, 192),
        },
        isFloatingBanner: true,
      });
      return;
    }

    handleShowFloatingBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedToCartValue, snackbarProps]);

  /** snackbar props 초기화 */
  useEffect(() => {
    return () => setSnackbarProps(null);
  }, [detailGoods]);

  useUnmount(() => remove());

  return {
    isOptionOpen,
    isOptionDrawerOpen,
    isCloseConfirm,
    sendWebOptionData,
    handleOptionOpen,
    handleOptionCloseWithDeleteExpired,
    handleOptionClose,
    handleOptionCloseComplete,
    handleActionSave,
    handleDeleteExpired,
  };
};
