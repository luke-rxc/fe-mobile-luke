import { useEffect, useState } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { getAppLink } from '@utils/link';
import { AppLinkTypes, UniversalLinkTypes } from '@constants/link';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import isEmpty from 'lodash/isEmpty';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { DrawCommonSchema } from '@features/authentication/schemas';
import { useLink } from '@hooks/useLink';
import { DrawEventType, DrawReceiveProps } from '@constants/content';
import { GetDrawStatusRequestParam, getDrawStatus } from '../apis';
import { DrawLabel, DrawString } from '../constants';
import type { ContentInfoModel, EventModel } from '../models';
import { useLogService } from './useLogService';

export interface DrawAParams {
  drawEvent: EventModel;
  displayDateTime: string;
  contentInfo: ContentInfoModel;
}

export const usePresetDrawAService = ({ drawEvent, displayDateTime, contentInfo }: DrawAParams) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { signIn, showToastMessage, receiveValues, open } = useWebInterface();
  const { getLink } = useLink();
  const { openDialogToApp } = useMwebToAppDialog();
  const { id: eventId, isDrawed, type: eventType, isDrawable } = drawEvent;
  const isLimit = eventType === 'LIMIT';
  const [isButtonDisabled, setButtonDisabled] = useState(isDrawed);
  const [isButtonLabel, setButtonLabel] = useState<string>('');
  const { logPresetDrawDetailInit, logPresetDrawComplete } = useLogService();

  /**
   * 응모 가능 상태 조회
   */
  const { mutateAsync: mutateDrawStatus } = useMutation<DrawCommonSchema, ErrorModel, GetDrawStatusRequestParam>(
    getDrawStatus,
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
            {
              message,
            },
            {
              autoDismiss: 2000,
              direction: 'bottom',
            },
          );
        }
      },
    },
  );

  /**
   * 응모 모달 open
   */
  const checkDrawAuth = async () => {
    open({
      url: getLink(UniversalLinkTypes.DRAW_GOODS, { eventId }),
      initialData: {
        isLimit,
        code: contentInfo.contentCode,
      },
    });
    // 응모 상세 모달 뷰 노출 시 이벤트 로깅
    logPresetDrawDetailInit(contentInfo, { eventId, raffleType: 'default' });
  };

  /**
   * 응모 상태에 따라, 버튼 disabled 및 모달 호출
   */
  const checkAvailableDraw = async () => {
    // 응모 상태 조회 API 호출
    const data = await mutateDrawStatus({ eventId });
    if (data?.isDrawed) {
      // 이미 응모되어있는 경우, 버튼 상태 변경
      setButtonDisabled(true);
      setButtonLabel(isLimit ? DrawLabel.LIMIT_COMPLETE : DrawLabel.COMPLETE);
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
      const { contentType, contentCode } = contentInfo;
      openDialogToApp(
        getAppLink(AppLinkTypes.CONTENT, {
          contentType: contentType.toLowerCase(),
          contentCode,
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
      const signInResult = await signIn();
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

  useEffect(() => {
    // 응모 완료 후, receiveValues 활용한 응모 버튼 disabled 변경 (label은 컴포넌트 내에서 disabled에 따라 변경)
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues as DrawReceiveProps;
      if (type === DrawEventType.GOODS && data.isComplete && data.eventId === eventId) {
        setButtonDisabled(true);
        setButtonLabel(isLimit ? DrawLabel.LIMIT_COMPLETE : DrawLabel.COMPLETE);
        // 응모 성공 시 이벤트 로깅
        logPresetDrawComplete(contentInfo, { eventId, raffleType: 'default' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  useEffect(() => {
    const { endDate } = drawEvent;
    const currentTime = new Date().getTime();
    if (currentTime > +endDate) {
      // eslint-disable-next-line no-nested-ternary
      const labal = isDrawed
        ? isLimit
          ? DrawLabel.LIMIT_COMPLETE
          : DrawLabel.COMPLETE
        : isLimit
        ? DrawLabel.LIMIT_FINISH
        : DrawLabel.FINISH;
      setButtonDisabled(true);
      setButtonLabel(labal);
      return;
    }

    if (isDrawed) {
      setButtonDisabled(true);
      setButtonLabel(isLimit ? DrawLabel.LIMIT_COMPLETE : DrawLabel.COMPLETE);
    } else {
      setButtonDisabled(false);
      setButtonLabel(isLimit ? DrawLabel.LIMIT_ACTIVE : DrawLabel.ACTIVE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isButtonDisabled,
    isButtonLabel,
    handleOpenDrawModal,
  };
};
