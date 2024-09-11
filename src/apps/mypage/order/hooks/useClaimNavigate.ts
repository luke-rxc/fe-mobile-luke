import env from '@env';
import qs from 'qs';
import { userAgent } from '@utils/ua';
import { generatePath, useHistory } from 'react-router-dom';
import { useWebInterface } from '@hooks/useWebInterface';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { ClaimManageInfo, ClaimTypes, CommonInfoText, ProcessTypes } from '../constants';

export type ClaimInfoParams = {
  /** 주문 상품 id */
  itemId?: number | string;
  /** 주문 옵션 id  */
  itemOptionId?: number | string;
  /** 출고 id */
  exportId?: string | number;
  /** 묶음 가능 상품 존재 여부 */
  hasBundle?: boolean;
  /** 취소 또는 반품 대표 아이디 */
  cancelOrReturnId?: number | string;
};

/** 앱 서비스웹뷰 딥링크 내 사용 Params */
interface AppLinkParams {
  landingType: 'modal' | 'push';
  rootNavigation: boolean;
}

interface PathParams {
  path: string;
  appLinkParams: AppLinkParams;
  // TODO: 타입정의 구체화
  initialData?: Record<string, unknown>;
}

interface ClaimNavigateParams {
  orderId: string | number;
  claimType: ValueOf<typeof ClaimTypes>;
  queryObj?: ClaimInfoParams;
  processType?: ValueOf<typeof ProcessTypes>;
  appLinkParams: AppLinkParams;
  // TODO: 타입정의 구체화
  initialData?: Record<string, unknown>;
}

interface SetDismissConfirmParams {
  title: string;
  message?: string;
  isConfirmable?: boolean;
  confirmButtonTitle?: string;
  cancelButtonTitle?: string;
}

export const useClaimNavigate = () => {
  const { isApp } = userAgent();
  const history = useHistory();
  const { open, setDismissConfirm } = useWebInterface();

  /**
   * handleNavigate로 전달 받은 정보를 통해, 앱 open, 웹 history push 화면 이동
   *
   */
  const handlePath = ({ path, initialData = {}, appLinkParams }: PathParams) => {
    if (isApp) {
      const url = getAppLink(AppLinkTypes.WEB, {
        landingType: appLinkParams.landingType,
        url: `${env.endPoint.baseUrl}${path}`,
        rootNavigation: `${appLinkParams.rootNavigation}`,
        topBarHidden: 'false',
      });
      open({ url, initialData });
      return;
    }
    history.push(path, initialData);
  };

  /**
   * app/web url navigate - 프로세스 이동 시에도 해당 함수 활용
   * 화면 이동 시 필요 정보 params 전달
   */
  const handleNavigate = (params: ClaimNavigateParams) => {
    const { queryObj, orderId, claimType, processType, appLinkParams, initialData } = params;
    if (!claimType) return;
    const navigatePath = [
      generatePath(ClaimManageInfo[claimType].url, {
        orderId,
        processType,
      }),
      qs.stringify(queryObj),
    ].join('?');
    handlePath({ path: navigatePath, initialData, appLinkParams });
  };

  /**
   * dismiss confirm 제어함수
   */
  const handleDismissConfirm = ({
    title,
    message = CommonInfoText.DISMISS_DEFAULT_MESSAGE,
    isConfirmable = true,
    confirmButtonTitle,
    cancelButtonTitle,
  }: SetDismissConfirmParams) => {
    setDismissConfirm({ title, message, isConfirmable, confirmButtonTitle, cancelButtonTitle });
  };

  return {
    handleNavigate,
    handleDismissConfirm,
  };
};
