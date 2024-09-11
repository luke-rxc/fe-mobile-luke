import { useHistory } from 'react-router-dom';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLink } from '@hooks/useLink';
import { ErrorModel } from '@utils/api/createAxios';
import { ErrorStatus, ErrorTitle, ErrorMessage } from '@features/exception/constants';
import { UniversalLinkTypes } from '@constants/link';

/** Feature Flag */
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';

type HandleErrorStatus = {
  [key in number]: () => void;
};

interface HandleErrorParams {
  /** API Error Model */
  error?: ErrorModel;
  /** API Error Model중에 메시지를 못받은 케이스에 대응하는 공통 메시지 */
  defaultMessage?: string;
  /** custom status 처리 */
  status?: HandleErrorStatus;
}

export const useErrorService = () => {
  const history = useHistory();
  const { isApp } = useDeviceDetect();
  const { showToastMessage, alert, close, reload } = useWebInterface();
  const { toLink, getLink } = useLink();

  /** Feature Flag */
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV);

  /**
   * Page Error : Confirm Action (확인)
   */
  const handleErrorConfirmCb = () => {
    close(undefined, {
      doWeb: () => {
        history.goBack();
      },
    });
  };

  /**
   * Page Error : Home Action (홈으로 이동)
   */
  const handleErrorHomeCb = () => {
    if (activeFeatureFlag) {
      toLink(getLink(UniversalLinkTypes.HOME));
      return;
    }

    if (isApp) {
      toLink(getLink(UniversalLinkTypes.HOME));
    }

    history.replace('/');
  };

  /**
   * Page Error : Reload Action (다시 시도)
   */
  const handleErrorReloadCb = () => {
    reload();
  };

  /**
   * Action Error : 액션 발생시 오류 처리를 위한 공통 Method
   *
   * @example
     ```
    import { ErrorModel } from '@utils/api/createAxios';
    import { useErrorService } from '@services/useErrorService';

    onError: (error: ErrorModel) => {
        handleError({
          error,
          status: {
            404: () => {
              console.log('404 처리');
            },
            500: () => {
              console.log('500');
            },
          },
        });
      },
    ```
  */
  const handleError = ({ error, defaultMessage, status = {} }: HandleErrorParams) => {
    const { data, status: httpStatus } = error ?? {};
    const message = data?.message || defaultMessage || ErrorTitle.Network;

    /** custom status 처리 */
    const statusList = Object.keys(status);

    if (httpStatus && statusList.length) {
      const isMatchedStatus = statusList.includes(`${httpStatus}`);

      if (isMatchedStatus) {
        status[httpStatus]();
        return;
      }
    }

    /** 429 Error */
    if (httpStatus === ErrorStatus.Traffic) {
      alert({
        title: ErrorTitle.Traffic,
        message: ErrorMessage.Traffic,
      });
      return;
    }

    /** 500, network Error */
    if (error && (!httpStatus || httpStatus >= 500)) {
      /**
       * feature-flag + mweb 일때만 alert 으로 띄움
       * @todo 22.10.28 전체 Migration 시에 해당 로직 삭제
       * @since 22.11.03
       *  - 네트워크 오류가 아닌 API 오류 시에도 500 대의 오류가 나올 수 있음
       *  - 네트워크 오류에 대한 공통의 메시지 포맷을 가져가기 어려운 이슈 (장바구니같은 경우 Custom)
       *  - 우선 해당 alert 로직 주석 처리 후 추후 가이드를 잡음
       */
      /* if (activeFeatureFlag && !isApp) {
        alert({
          title: ErrorTitle.Network,
          message: ErrorMessage.Network,
        });
        return;
      } */
      showToastMessage({
        message,
      });
      return;
    }

    /** 429, 500대 오류를 제외한 API 오류 */
    showToastMessage({
      message,
    });
  };

  return {
    handleError,
    action: {
      handleErrorConfirmCb,
      handleErrorHomeCb,
      handleErrorReloadCb,
    },
  };
};
