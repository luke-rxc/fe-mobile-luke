/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { useWebInterface } from '@hooks/useWebInterface';
import { BrandSubscribeRequestParam, postBrandSubscribe, deleteBrandSubscribe } from '../apis';

export interface UpdateSubscribeMutationParam extends BrandSubscribeRequestParam {
  code: string;
  name: string;
}

export interface BrandSubscribeServiceOptionsParam {
  confirmMessage?: string;
  onError?: (error: ErrorModel) => void;
  onSuccess?: (subscribeState: boolean, showroomInfo: UpdateSubscribeMutationParam) => void;
}

/**
 * useBrandSubscribeService
 *
 * @deprecated useBrandFollowService으로 대체
 */
export const useBrandSubscribeService = ({ confirmMessage, onError, onSuccess }: BrandSubscribeServiceOptionsParam) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { openDialogToApp } = useMwebToAppDialog();
  const { signIn, confirm, subscriptionStatusUpdated } = useWebInterface();
  const subscribeError = React.useRef<ErrorModel | undefined>(undefined);
  const [subscribeRequestState, setSubscribeRequestState] = React.useState<{
    isSubscribed?: boolean;
    error?: boolean;
    success?: boolean;
  }>({
    isSubscribed: undefined,
    error: undefined,
    success: undefined,
  });

  /** 구독 신청/취소 상태 초기화 */
  const handleBeforeUpdateSubscribeRequest = () => {
    setSubscribeRequestState({ success: undefined, error: undefined });
  };

  /** 구독 신청/취소 요청 성공시 실행 콜백 함수 */
  const handleSuccessUpdateSubscribeRequest = (
    isSubscribed: boolean,
    { id, code, name }: UpdateSubscribeMutationParam,
  ) => {
    setSubscribeRequestState({ isSubscribed, success: true, error: false });
    subscribeError.current = undefined;

    // APP Interface :: 변경된 구독 상태를 APP에 전달
    isApp &&
      subscriptionStatusUpdated({
        isSubscribed,
        showroomId: id,
        showroomCode: code,
      });

    onSuccess && onSuccess(isSubscribed, { name, id, code });
  };

  /** 구독 신청/취소 요청 실패시 실행 콜백 함수 */
  const handleFailureUpdateSubscribeRequest = (error: ErrorModel) => {
    setSubscribeRequestState({ success: false, error: true });
    subscribeError.current = error;

    onError && onError(error);
  };

  /** useMutation 콜백 옵션 */
  const mutationOptions = React.useMemo(
    () => ({
      onMutate: handleBeforeUpdateSubscribeRequest,
      onSuccess: handleSuccessUpdateSubscribeRequest,
      onError: handleFailureUpdateSubscribeRequest,
    }),
    [],
  );

  // 구독 신청 Mutation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const subscribe = useMutation<boolean, ErrorModel, UpdateSubscribeMutationParam>(({ id, code }) => {
    // mutation의 onSuccess 콜백내부에서 사용된 APP인터페이스를 위해 api에서 사용하지 않는 code를 추가로 받고 있음
    return postBrandSubscribe({ id });
  }, mutationOptions);

  // 구독 취소 Mutation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unsubscribe = useMutation<boolean, ErrorModel, UpdateSubscribeMutationParam>(({ id, code }) => {
    // mutation의 onSuccess 콜백내부에서 사용된 APP인터페이스를 위해 api에서 사용하지 않는 code를 추가로 받고 있음
    return deleteBrandSubscribe({ id });
  }, mutationOptions);

  /**
   * 구독 신청/취소하기
   *
   * @param id 쇼룸 아이디
   * @param code 쇼룸 코드
   * @param name 쇼룸명
   * @param state 구독: true / 구독취소: false
   */
  const updateSubscribeState = React.useCallback(
    async ({
      id,
      name,
      code,
      state,
      deepLink = '',
    }: UpdateSubscribeMutationParam & { name: string; state: boolean; deepLink?: string }) => {
      // WEB
      if (!isApp) {
        return openDialogToApp(deepLink);
      }

      // APP에서 비로그인사용자가 로그인을 취소하는 경우
      if (!getIsLogin() && !(await signIn())) {
        return undefined;
      }

      // 이미 요청중인 Request가 있는 경우
      if (subscribe.isLoading || unsubscribe.isLoading) {
        return false;
      }

      if (state) {
        // 구독하기
        subscribe.mutate({ id, code, name });
      } else {
        // 구독취소 여부 확인후 구독취소하기
        (await confirm(
          confirmMessage ? { title: confirmMessage } : { title: name, message: '팔로우를 취소하시겠습니까?' },
        )) && unsubscribe.mutate({ id, code, name });
      }

      return undefined;
    },
    [getIsLogin, subscribe.isLoading, unsubscribe.isLoading],
  );

  return {
    isSubscribed: subscribeRequestState.isSubscribed,
    subscribeError: subscribeError.current,
    isSubscribeError: subscribeRequestState.error,
    isSubscribeSuccess: subscribeRequestState.success,
    isSubscribeLoading: subscribe.isLoading || unsubscribe.isLoading,
    updateSubscribeState,
  };
};
