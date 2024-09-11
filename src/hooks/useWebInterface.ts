import React, { useContext, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { WebInterfaceContext } from '@contexts/WebInterfaceContext';
import { env } from '@env';
import { useToast } from '@hooks/useToast';
import { useSnackbar } from '@hooks/useSnackbar';
import type { ToastProps } from '@pui/toast';
import type { SnackbarProps } from '@pui/snackbar';
import type {
  ShowToastMessageParams,
  ShowSnackbarParams,
  AlertParams,
  ConfirmParams,
  PromptParams,
  PromptOptions,
  OpenParams,
  OpenOptions,
  CloseReceiveData,
  CloseOptions,
  OpenShareType,
  OpenShareParams,
} from '@utils/webInterface';
import * as webInterfaces from '@utils/webInterface';
import { createDebug } from '@utils/debug';
import { getWebLink } from '@utils/link';
import { webShare, WebShareOptionParams } from '@utils/webShare';
import { WebLinkTypes } from '@constants/link';
import { LoginModalStepContainer } from '@features/login/containers';
import { ModalDataContext } from '@pui/modal';
import { useModal } from './useModal';
import { useDialog } from './useDialog';
import { useDialogPrompt } from './useDialogPrompt';

const debug = createDebug('hooks:useWebInterface');

/* eslint-disable @typescript-eslint/naming-convention */
const {
  openShare: _openShare,
  signIn: _signIn,
  reload: _reload,
  showToastMessage: _showToastMessage,
  showSnackbar: _showSnackbar,
  alert: _alert,
  confirm: _confirm,
  prompt: _prompt,
  open: _open,
  close: _close,
  emitSignIn,
  emitAlert,
  emitConfirm,
  emitPrompt,
  emitOpen,
  emitClose,
  ...interfaces
} = webInterfaces;
/* eslint-enable @typescript-eslint/naming-convention */

export const useWebInterface = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { addSnackbar } = useSnackbar();
  const { openDialog } = useDialog();
  const { openDialogPrompt } = useDialogPrompt();
  const { isModalView, openModal } = useModal();
  const {
    initialValues,
    receiveValues,
    searchValues,
    subscribeShowroom,
    showroomFollowStatusValues,
    subscribeSchedule,
    webStatusCompleted,
    cartItemUpdatedValues,
    wishItemUpdatedValues,
    bottomSafeAreaUpdatedValue,
    addedToCartValue,
    floatingLivePlayerStatusValue,
    initializeValues,
    toolbarButtonTappedValue,
    pageActivatedCount,
  } = useContext(WebInterfaceContext);
  const { initialValues: modalInitialValues, receiveValues: modalReceiveValues } = useContext(ModalDataContext);
  /** set open interface */
  const windowRef = useRef<Window | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initRef = useRef<any>({});

  /**
   * Open Share
   */
  const openShare = <T extends OpenShareType>(
    params: OpenShareParams<T>,
    options?: Omit<WebShareOptionParams, 'url'> & { url?: string },
  ) => {
    return _openShare(params, {
      doWeb: () => {
        if (options?.url) {
          webShare({ url: options.url, ...options });
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { contentType, code, id } = params as any;
        let url: string | null = null;
        switch (params.type) {
          case 'CONTENT':
            url = getWebLink(WebLinkTypes.CONTENT, {
              contentType: contentType.toLowerCase(),
              contentCode: code,
            });
            break;
          case 'SHOWROOM':
            url = getWebLink(WebLinkTypes.SHOWROOM, { showroomCode: code });
            break;
          case 'GOODS':
            url = getWebLink(WebLinkTypes.GOODS, { goodsCode: code });
            break;
          case 'LIVE':
            url = getWebLink(WebLinkTypes.LIVE, { liveId: id });
            break;
          default:
            break;
        }

        url && webShare({ url: `${env.endPoint.baseUrl}${url}`, ...options });
      },
    });
  };

  /**
   * Reload Page
   */
  const reload = () => {
    _reload({ doWeb: () => history.go(0) });
  };

  /**
   * Show Toast Message
   */
  const showToastMessage = (params: ShowToastMessageParams, options?: Omit<ToastProps, 'message'>) => {
    _showToastMessage(params, {
      doWeb: () => {
        addToast({
          ...options,
          message: params.message,
        });
      },
    });
  };

  /**
   * Show Snack Bar
   */
  const showSnackbar = (params: ShowSnackbarParams, options?: Omit<SnackbarProps, 'message'>) => {
    _showSnackbar(params, {
      doWeb: () => {
        const { title, message, imagePath, isAutoClose, isHighlighted } = params;
        const { autoDismiss, image: webParamImage, action, ...etcOptions } = options ?? {};
        const appParamImage = imagePath ? { src: imagePath } : undefined;
        const actionWebProps = action && {
          ...action,
          highlighted: action.highlighted ?? !!isHighlighted,
        };
        const actionAppProps = isHighlighted
          ? {
              highlighted: true,
            }
          : undefined;
        addSnackbar({
          ...etcOptions,
          title,
          message: message ?? '',
          image: webParamImage ?? appParamImage,
          autoDismiss: isAutoClose ? autoDismiss ?? 3000 : isAutoClose,
          action: actionWebProps ?? actionAppProps,
        });
      },
    });
  };

  /**
   * Sign In
   */
  const signIn = () => {
    return _signIn({
      doWeb: () => {
        openModal({
          fadeTime: 0.2,
          timeout: 0.25,
          nonModalWrapper: true,
          render: (props) =>
            React.createElement(LoginModalStepContainer, {
              ...props,
              onClose: () => {
                emitSignIn(false);
                props.onClose?.();
              },
            }),
        });
      },
      addListener: true,
    });
  };

  /**
   * Alert
   */
  const alert = (params: AlertParams) => {
    return _alert(params, {
      doWeb: () => {
        debug.log('alert params: %o', params);
        const { title, message: desc, buttonTitle } = params;
        openDialog({
          title: title ?? '',
          desc,
          confirm: {
            cb: emitAlert,
            label: buttonTitle ?? '확인',
          },
          disableBackDropClose: true,
        });
      },
    });
  };

  /**
   * Confirm
   */
  const confirm = (params: ConfirmParams) => {
    return _confirm(params, {
      doWeb: () => {
        debug.log('confirm params: %o', params);
        const { title, message: desc, confirmButtonTitle, cancelButtonTitle } = params;
        openDialog({
          title: title ?? '',
          desc,
          type: 'confirm',
          confirm: {
            cb: () => emitConfirm({ isOK: true }),
            label: confirmButtonTitle ?? '확인',
          },
          cancel: {
            cb: () => emitConfirm({ isOK: false }),
            label: cancelButtonTitle ?? '취소',
          },
          disableBackDropClose: true,
        });
      },
    });
  };

  /**
   * Prompt
   */
  const prompt = (params: PromptParams, options?: PromptOptions) => {
    return _prompt(params, {
      ...options,
      doWeb: () => {
        debug.log('prompt params: %o', params);
        const { title, message: desc, placeholder, confirmButtonTitle, cancelButtonTitle } = params;
        const isNumberIc = options?.numeric ?? true;
        openDialogPrompt({
          title: title ?? '',
          desc,
          type: 'confirm',
          textField: {
            placeholder,
            type: isNumberIc ? 'tel' : 'text',
          },
          confirm: {
            cb: (value?: string) => emitPrompt({ isOK: true, value: isNumberIc && value ? +value : value }),
            label: confirmButtonTitle ?? '확인',
          },
          cancel: {
            cb: () => emitPrompt({ isOK: false }),
            label: cancelButtonTitle ?? '취소',
          },
          disableBackDropClose: true,
        });
      },
    });
  };

  /**
   * Open
   */
  const open = (params: OpenParams, options: OpenOptions = {}) => {
    return _open(params, {
      doWeb: () => {
        const { url, initialData } = params;
        windowRef.current = window.open(url);
        initRef.current = initialData ?? {};
      },
      ...options,
    });
  };

  useEffect(() => {
    if (webStatusCompleted && webStatusCompleted.listenerStatus === 'ready' && windowRef.current) {
      emitOpen(initRef.current ?? {}, { target: windowRef.current.window });
      initRef.current = {};
    }
  }, [webStatusCompleted]);

  /**
   * Close
   */
  const close = (
    receiveData: CloseReceiveData = {},
    options: CloseOptions & { historyType?: 'replace' | 'push'; url?: string } = {},
  ) => {
    const { historyType = 'replace', url, ...restOptions } = options;

    return _close(receiveData, {
      doWeb: () => {
        if (window.opener) {
          emitClose(receiveData, { target: window.opener });
          window.close();
        } else {
          emitClose(receiveData);
          url && history[historyType](url);
        }
      },
      ...restOptions,
    });
  };

  return {
    openShare,
    signIn,
    reload,
    showToastMessage,
    showSnackbar,
    alert,
    confirm,
    prompt,
    open,
    close,
    emitSignIn,
    emitAlert,
    emitConfirm,
    emitPrompt,
    emitOpen,
    emitClose,
    initialValues: isModalView() ? modalInitialValues : initialValues,
    receiveValues: isModalView() ? modalReceiveValues : receiveValues,
    searchValues,
    subscribeShowroom,
    showroomFollowStatusValues,
    subscribeSchedule,
    cartItemUpdatedValues,
    wishItemUpdatedValues,
    bottomSafeAreaUpdatedValue,
    addedToCartValue,
    floatingLivePlayerStatusValue,
    initializeValues,
    toolbarButtonTappedValue,
    pageActivatedCount,
    ...interfaces,
  };
};
