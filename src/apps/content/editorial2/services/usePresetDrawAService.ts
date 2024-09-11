import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { DrawEventType, DrawReceiveProps } from '@constants/content';
import { AppLinkTypes, UniversalLinkTypes } from '@constants/link';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { DrawCommonSchema } from '@features/authentication/schemas';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLink } from '@hooks/useLink';
import { useMutation } from '@hooks/useMutation';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { getAppLink } from '@utils/link';
import { GetDrawStatusRequestParam, getDrawStatus } from '../apis';
import { DrawLabel, DrawString } from '../constants';
import type { ContentLogInfoModel, EventModel } from '../models';
// import { useContentStore } from '../stores';
import { useContentStoreService } from './useContentStoreService';
import { useLogService } from './useLogService';

export interface DrawAParams {
  drawEvent: EventModel;
  displayDateTime: string;
  contentLogInfo: ContentLogInfoModel;
}

export const usePresetDrawAService = ({ drawEvent, displayDateTime, contentLogInfo }: DrawAParams) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { getLink } = useLink();
  const { openDialogToApp } = useMwebToAppDialog();
  const { showToastMessage, receiveValues, open } = useWebInterface();
  const { id: eventId, isDrawed, type: eventType, isDrawable, endDate } = drawEvent;
  const isLimit = eventType === 'LIMIT';
  const [isButtonDisabled, setButtonDisabled] = useState(isDrawed);
  const [buttonLabel, setButtonLabel] = useState<string>('');
  const { logPresetDrawDetailInit, logPresetDrawComplete } = useLogService();
  const { handleSignIn } = useContentStoreService();
  // const login = useContentStore.use.login();

  /**
   * 응모 가능 상태 조회
   */
  const { mutateAsync: mutateDrawStatus } = useMutation<DrawCommonSchema, ErrorModel, GetDrawStatusRequestParam>(
    getDrawStatus,
  );

  /**
   *
   * @param status
   * @param limit
   * 1. 드로우 한 상태인 경우
   *  - 종료 시간 상관없이 - 선착순 타입인 경우 '신청완료'. 비활성
   *  - 종료 시간 상관없이 - 노멀 타입인 경우 '응모완료'. 비활성
   * 2. 드로우 하지 않은 상태인 경우(비로그인 상태 포함)
   *  - 종료 시간 경과
   *    - 선착순 타입인 경우 '신청 종료'. 비활성
   *    - 노멀 타입인 경우 '응모 종료'. 비활성
   *  - 종료 시간 경과하지 않은 경우
   *    - 선착순 타입인 경우 '사전 신청'. 활성
   *    - 노말 타입인 경우 '응모'. 활성
   */
  const handleButtonStatus = (status: 'done' | 'end' | 'drawable' = 'drawable', limit: boolean) => {
    if (status === 'drawable') {
      setButtonDisabled(false);
      setButtonLabel(limit ? DrawLabel.LIMIT_ACTIVE : DrawLabel.ACTIVE);
    } else if (status === 'end') {
      setButtonDisabled(true);
      setButtonLabel(limit ? DrawLabel.LIMIT_FINISH : DrawLabel.FINISH);
    } else if (status === 'done') {
      setButtonDisabled(true);
      setButtonLabel(limit ? DrawLabel.LIMIT_COMPLETE : DrawLabel.COMPLETE);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDrawStatus = async () => {
    const data = await mutateDrawStatus({ eventId }).catch(() => {});
    if (!data) return;
    const currentTime = new Date().getTime();
    if (data.isDrawed) {
      handleButtonStatus('done', isLimit);
    } else if (currentTime > +endDate) {
      handleButtonStatus('end', isLimit);
    } else {
      handleButtonStatus('drawable', isLimit);
    }
  };

  /**
   * 응모 모달 open
   */
  const checkDrawAuth = async () => {
    open({
      url: getLink(UniversalLinkTypes.DRAW_GOODS, { eventId }),
      initialData: {
        isLimit,
        code: contentLogInfo.code,
      },
    });
    // 응모 상세 모달 뷰 노출 시 이벤트 로깅
    logPresetDrawDetailInit(contentLogInfo, { eventId, raffleType: 'default' });
  };

  /**
   * 응모 상태에 따라, 버튼 disabled 및 모달 호출
   */
  const checkAvailableDraw = async () => {
    // 응모 상태 조회 API 호출
    const data = await mutateDrawStatus(
      { eventId },
      {
        onError: (error: ErrorModel<ErrorDataModel>) => {
          // 이벤트 종료에 따른 에러 시, 토스트 표현
          if (error.data?.code === 'E404972' || error.data?.code === 'E404977' || error.data?.code === 'E403979') {
            let message = '';
            switch (error.data.code) {
              case 'E404972':
                message = DrawString.END_MESSAGE;
                break;
              case 'E404977':
                message = DrawString.LIMIT_END_MESSAGE;
                break;
              case 'E403979':
                message = DrawString.LIMIT_FINISH_MESSAGE;
                break;
              default:
                break;
            }
            showToastMessage(
              { message },
              {
                autoDismiss: 2000,
                direction: 'bottom',
              },
            );
          }
        },
      },
    );
    if (data?.isDrawed) {
      // 이미 응모되어있는 경우, 버튼 상태 변경
      handleButtonStatus('done', isLimit);
    } else {
      // 아직 응모하지 않은 경우, 인증 및 마케팅 동의여부 체크 후 바로 API 호출 / 응모 모달 open
      await checkDrawAuth();
    }
  };

  /**
   * 응모 DrawA 버튼 클릭
   */
  const handleOpenDrawModal = async () => {
    /**
     * 미리보기 일 경우, 미동작하도록 제어
     */
    if (displayDateTime !== '') {
      return;
    }
    /**
     * 앱 유도 팝업
     */
    if (!isApp) {
      const { type, code } = contentLogInfo;
      openDialogToApp(
        getAppLink(AppLinkTypes.CONTENT, {
          contentType: type.toLowerCase(),
          contentCode: code,
        }),
        {
          actionProps: {
            kind: AppPopupActionKind.CONTENT,
          },
        },
      );
      return;
    }
    /**
     * 비로그인 시, 로그인 진행
     */
    if (!getIsLogin()) {
      const signInResult = await handleSignIn();
      if (signInResult) {
        await checkAvailableDraw();
      }
      // 비로그인 사용자가 로그인을 취소하는 경우
      return;
    }

    if (eventType === 'LIMIT' && !isDrawable) {
      // 응모 수량 없는 경우
      showToastMessage(
        {
          message: DrawString.LIMIT_FINISH_MESSAGE,
        },
        {
          autoDismiss: 2000,
          direction: 'bottom',
        },
      );

      return;
    }
    await checkAvailableDraw();
  };

  /**
   * 초기 버튼 상태
   */
  useEffect(() => {
    const currentTime = new Date().getTime();
    if (isDrawed) {
      handleButtonStatus('done', isLimit);
    } else if (currentTime > +endDate) {
      handleButtonStatus('end', isLimit);
    } else {
      handleButtonStatus('drawable', isLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 로그인 상태에 따라 버튼 UI 업데이트 변경
   */
  // useEffect(() => {
  //   if (!login) return;
  //   //  로그인 상태 변경에 따라 버튼 변경
  //   handleDrawStatus();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [login]);

  useEffect(() => {
    // 응모 완료 후, receiveValues 활용한 응모 버튼 disabled 변경 (label은 컴포넌트 내에서 disabled에 따라 변경)
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues as DrawReceiveProps;
      if (type === DrawEventType.GOODS && data.isComplete && data.eventId === eventId) {
        handleButtonStatus('done', isLimit);
        // 응모 성공 시 이벤트 로깅
        logPresetDrawComplete(contentLogInfo, { eventId, raffleType: 'default' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return {
    isButtonDisabled,
    buttonLabel,
    handleOpenDrawModal,
  };
};
