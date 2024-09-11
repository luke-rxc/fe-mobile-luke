/**
 * 모바일 웹에서 앱유도 팝업 Hook
 * @see https://www.notion.so/rxc/e60fe47bfab24911856fc609fbd952fe?pvs=4
 * @see https://www.notion.so/rxc/MWeb-to-APP-case-f0c9ad0a2afe4e939c85d6d07bcff06f
 */

import React, { useRef, useEffect } from 'react';
import { env } from '@env';
import { useDialog } from '@hooks/useDialog';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useAuth } from '@hooks/useAuth';
import { tracking, branch } from '@utils/log';
import { getLocalStorage, setLocalStorage } from '@utils/storage';
import { WebLogTypes } from '@constants/log';
import {
  AppPopupTypes,
  AppPopupLandingMessage,
  AppPopupCommonMessage,
  AppPopupActionBaseMessage,
  AppPopupActionPromotionMessage,
  AppPopupDataProps,
  AppPopupActionKind,
} from '@constants/mwebToAppDialog';
import { Image } from '@pui/image';

/**
 * 프로모션 여부 (프론트 코드로 관리)
 */
const IsAvailPromotion = true;

/**
 * 앱유도 팝업 로깅
 */
const LogEventTypes = {
  // 앱으로 보기 유도 팝업 노출시
  ImpressionToApp: 'popup.impression_to_app',
  // 앱으로 보기 버튼 클릭시
  TabToApp: 'popup.tab_to_app',
  // 앱으로 보기 버튼 클릭시, 내부 데이터 로깅을 이한 이벤트
  TabToAppInternal: 'popup.tab_to_app_internal',
  // 나중에 버튼 클릭시
  TabLater: 'popup.tab_later',
};

/**
 * 앱유도 팝업 시간 체크시의 Storage Key
 */
const WebToAppDialogStorage: Record<AppPopupTypes, string> = {
  /** 브랜치 Smart Banner 랜딩 체크 Storage key */
  LANDING: 'WebToApp_LANDING',
  /** action 시 저장할 Storage Key */
  ACTION: 'WebToApp',
};

/**
 * Branch 링크 생성시 Option Type
 */
type BranchGenerateOneLinkOptionProps = branch.GenerateOneLinkOptionProps;

/**
 * openDialogToApp 부가 옵션 Type
 */
interface DialogToAppOptions {
  /** 팝업의 랜딩 타입은 시점을 기준으로 타입을 구분, 기본값은 ACTION */
  appPopupType?: AppPopupTypes;
  /** appPopupType 이 ACTION 인 경우 세부 옵션 */
  actionProps?: {
    /** 각 액션의 유형을 결정(모든 도메인 메시지를 관리하는 constant에서 참조) */
    kind?: AppPopupActionKind;
    /** LocalStorage 로 시간체크를 하기 위한 여부, kind가 필수로 적용되어야 한다 */
    timerEnabled?: boolean;
  };
  /** 브랜치 내 링크 생성시 측정지표수집를 위한 데이터 입력, util/branch 내의 인터페이스 연계 */
  generateOptions?: BranchGenerateOneLinkOptionProps;
  /** 배너 활성화 Delay */
  delay?: number;
  /** z-index */
  zIndex?: number;
}

/**
 * 앱유도 팝업 UI Data Params
 */
type DialogUiDataParams = {
  appPopupType: AppPopupTypes;
  isLogin: boolean;
  actionKind?: AppPopupActionKind;
};

/**
 * 앱우도 팝업 UI Data (Message Set)
 */
const getDialogUiData = ({ appPopupType, isLogin, actionKind }: DialogUiDataParams): AppPopupDataProps | null => {
  const isPromotion = IsAvailPromotion && !isLogin;

  // LANDING
  if (appPopupType === AppPopupTypes.LANDING) {
    return isPromotion ? AppPopupLandingMessage.PROMOTION : AppPopupLandingMessage.DEFAULT;
  }

  // action
  if (isPromotion) {
    return actionKind ? AppPopupActionPromotionMessage[actionKind] : AppPopupCommonMessage;
  }

  return actionKind ? AppPopupActionBaseMessage[actionKind] : AppPopupCommonMessage;
};

/**
 * 앱유도 팝업 활성화 여부 체크 Params
 */
interface DialogActiveCheckParams {
  appPopupType: AppPopupTypes;
  actionKind?: AppPopupActionKind;
}

/**
 * 앱유도 팝업 활성화 여부 체크시 필요한 Storage Key 추출
 */
const getTimerStorageKey = ({ appPopupType, actionKind }: DialogActiveCheckParams): string => {
  if (appPopupType === AppPopupTypes.LANDING) {
    return WebToAppDialogStorage.LANDING;
  }

  if (!actionKind) {
    return '';
  }

  return `${WebToAppDialogStorage.ACTION}_${AppPopupActionKind[actionKind]}`;
};

/**
 * 앱유도 팝업 활성화 여부 Storage를 통한 시간 체크
 */
const getIsDialogActiveFromStorage = (storageKey: string): boolean => {
  const bannerLandingTime = getLocalStorage(storageKey);
  if (bannerLandingTime) {
    const now = new Date().getTime();
    const diffTime = now - +bannerLandingTime;
    /** 한번 활성화 된 배너는 1시간동안 활성화되지 않음 */
    const limitTime = 1000 * 60 * 60;
    if (!Number.isNaN(diffTime) && diffTime < limitTime) {
      return false;
    }
  }
  return true;
};

export const useMwebToAppDialog = () => {
  const { openDialog } = useDialog();
  const { isIOSSafari, isApp } = useDeviceDetect();
  const { getIsLogin } = useAuth();
  const openDialogTimeoutRef = useRef<number | null>(null);

  const clearOpenDialogTimeout = () => {
    if (openDialogTimeoutRef.current) {
      window.clearTimeout(openDialogTimeoutRef.current);
    }
  };

  /**
   * Public : appPopupType이 Action 일 경우의 앱유도 팝업 활성화 여부 체크
   */
  const getIsDialogActionActive = (actionKind: AppPopupActionKind): boolean => {
    /** App 인경우 실행하지 않음 */
    if (isApp) {
      return false;
    }

    const { isDialogActive } = getDialogActiveData({
      appPopupType: AppPopupTypes.ACTION,
      actionKind,
    });
    return isDialogActive;
  };

  /**
   * 앱유도 팝업 활성화 관련 데이터 체크
   * @returns
   * - isDialogActive {boolean} : 앱유도 팝업 활성화 여부, Storage와 실제 UI Data의 유무를 통해 판단
   * - dialogUiData {AppPopupDataProps} : 앱유도 팝업 UI Data
   */
  const getDialogActiveData = ({ appPopupType, actionKind }: DialogActiveCheckParams) => {
    const isDialogStorageActive = getIsDialogActiveFromStorage(
      getTimerStorageKey({
        appPopupType,
        actionKind,
      }),
    );

    /** UI Data */
    const dialogUiData = getDialogUiData({
      appPopupType,
      isLogin: getIsLogin(),
      actionKind,
    });

    return {
      isDialogActive: isDialogStorageActive && !!dialogUiData,
      dialogUiData,
    };
  };

  const openDialogToApp = async (deepLinkPath: string, options?: DialogToAppOptions) => {
    /** App 인경우 실행하지 않음 */
    if (isApp) {
      return;
    }

    const { appPopupType = AppPopupTypes.ACTION, actionProps, generateOptions, delay = 0, zIndex } = options ?? {};
    const { kind: actionKind, timerEnabled = false } = actionProps ?? {};
    const { isDialogActive, dialogUiData } = getDialogActiveData({ appPopupType, actionKind });
    const { title, desc, confirmLabel } = dialogUiData ?? {};

    /** Dialog 를 Active 하는 여부 체크 */
    if (!isDialogActive) {
      return;
    }

    /** Clear Timeout */
    clearOpenDialogTimeout();

    openDialogTimeoutRef.current = window.setTimeout(() => {
      /**
       * @issue 해당 앱유도팝업이 이미 활성화된 케이스라면 중복으로 활성화 되지 않도록 처리
       */
      const $floating = document.getElementById('floating-root') as HTMLDivElement;

      if ($floating.querySelectorAll('[datatype=web-to-app]').length) {
        clearOpenDialogTimeout();
        return;
      }

      /** LANDING Type: 브랜치연동 스마트 배너 타입은 시간설정 */
      if (appPopupType === AppPopupTypes.LANDING) {
        setLocalStorage(WebToAppDialogStorage.LANDING, new Date().getTime());
      }

      /** ACTION Type: actionKind가 존재하고 timerEnabled prop이 true 일 경우 시간설정 */
      if (appPopupType === AppPopupTypes.ACTION && actionKind && timerEnabled) {
        setLocalStorage(`${WebToAppDialogStorage.ACTION}_${AppPopupActionKind[actionKind]}`, new Date().getTime());
      }

      openDialog({
        logoImage: {
          size: '48',
          element: React.createElement(Image, {
            src: `${env.endPoint.baseUrl}/static/image/app_icon.png`,
            alt: 'logo',
          }),
        },
        title,
        desc,
        type: 'confirm',
        buttonDirection: 'vertical',
        zIndex: zIndex ?? undefined,
        disableBackDropClose: appPopupType === AppPopupTypes.LANDING,
        dataType: 'web-to-app',
        confirm: {
          cb: async () => {
            const { appLink, logParameters } = await branch.generateOneLinkBranchURL({
              deepLinkPath,
              linkOptions: generateOptions,
            });

            tracking.logEvent({
              name: LogEventTypes.TabToApp,
              parameters: {
                current_page: appLink,
              },
              targets: {
                web: [WebLogTypes.MixPanel],
              },
            });

            tracking.logEvent({
              name: LogEventTypes.TabToAppInternal,
              parameters: {
                ...logParameters,
              },
              targets: {
                web: [WebLogTypes.MixPanel],
              },
            });

            /** 플랫폼, 브라우저에 따라 location 이동 혹은 window open 으로 제어 필요 */
            setTimeout(() => {
              if (isIOSSafari) {
                window.open(appLink, '_blank');
                return;
              }
              window.location.href = appLink;
            }, 0);
          },
          variant: 'primary',
          label: confirmLabel,
        },
        cancel: {
          label: '나중에',
          cb: async () => {
            tracking.logEvent({
              name: LogEventTypes.TabLater,
              targets: {
                web: [WebLogTypes.MixPanel],
              },
            });
          },
        },
        onMount: () => {
          tracking.logEvent({
            name: LogEventTypes.ImpressionToApp,
            targets: {
              web: [WebLogTypes.MixPanel],
            },
          });
        },
      });
    }, delay);
  };

  useEffect(() => {
    return () => {
      clearOpenDialogTimeout();
    };
  }, []);

  return {
    openDialogToApp,
    getIsDialogActionActive,
  };
};
