import { createElement, useCallback, useEffect, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import env from '@env';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { CALL_WEB_EVENT_TYPE } from '@features/authentication/constants';
import { DrawerOrdererAuthContainer } from '@features/authentication/containers/DrawerOrdererAuthContainer';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import type { ErrorModel } from '@utils/api/createAxios';
import { getAppLink, getWebLink } from '@utils/link';
import { emitClearReceiveValues } from '@utils/webInterface';
import { getSuffrage, postVoteItem } from '../apis';
import type { ContentLogInfoModel, VoteItemModel, VoteReceiveModel } from '../models';
import { useContentStoreService } from './useContentStoreService';
import { useLogService } from './useLogService';

export const usePresetVoteItemService = ({
  voteId,
  vote,
  contentLogInfo,
  onVoteUpdate,
  onVoteFinish,
  onVoteSuccess,
}: {
  voteId: number;
  vote: VoteItemModel;
  contentLogInfo: ContentLogInfoModel;
  onVoteUpdate: (remainVote: number, item?: { id: number; voteCount: number }) => void;
  onVoteFinish: (isSharedValue: boolean) => void;
  onVoteSuccess: () => void;
}) => {
  const { isApp } = useDeviceDetect();
  const { getIsLogin } = useAuth();
  const { openModal } = useModal();
  const { open, receiveValues, showToastMessage } = useWebInterface();
  const { handleSignIn } = useContentStoreService();
  const { logPresetVoteComplete } = useLogService();
  const isSharedValue = useRef<boolean>(false);
  // 투표권 조회
  const { mutateAsync: handleGetSuffrage, isLoading: isSuffrageLoading } = useMutation(() => getSuffrage(voteId), {
    onSuccess: (res) => {
      const { allowedVoteCount, usedVoteCount, isShared } = res;
      const remainVote = allowedVoteCount - usedVoteCount; // 잔여 투표권
      isSharedValue.current = isShared;
      onVoteUpdate(remainVote);
    },
    onError: () => {},
  });

  // 투표하기
  const { mutateAsync: handleVote, isLoading: isVoteLoading } = useMutation(
    (itemId: number) => postVoteItem(voteId, itemId),
    {
      onSuccess: (res) => {
        const { allowedVoteCount, nomineeVoteCount, usedVoteCount, nomineeId } = res;
        const remainVote = allowedVoteCount - usedVoteCount; // 잔여 투표권
        onVoteUpdate(remainVote, { id: nomineeId, voteCount: nomineeVoteCount });
        onVoteSuccess();
        if (remainVote === 0) {
          // 마지막 투표권 행사시, 인증서 바로가기
          onVoteFinish(isSharedValue.current);
        }

        logPresetVoteComplete(contentLogInfo, {
          voteId,
          voteItemId: vote.id,
          voteItemName: vote.name || '',
        });
      },
      onError: (error: ErrorModel) => {
        showToastMessage(
          {
            message: error.data?.message ?? '일시적인 오류가 발생했습니다',
          },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );
      },
    },
  );

  /**
   * 투표 호출
   */
  const handleVoteItem = useCallback(
    (itemId: number) => {
      if (isVoteLoading || isSuffrageLoading) {
        return;
      }
      handleVote(itemId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSuffrageLoading, isVoteLoading],
  );

  /**
   * 본인 인증 모달 열기
   *
   * AUTH_SMS 딥링크 뷰의 상단 타이틀이 기존 "주문자 인증"과 상이하기 때문에,
   * 서비스 웹뷰로 open 인터페이스를 호출 처리한다.
   *
   * 타이틀을 받는쪽에서 정하기 보다는 보내는쪽에서 타이틀을 세팅해서 전달한다
   */
  const openAuth = (itemId: number) => {
    const initialData: VoteReceiveModel = {
      type: CALL_WEB_EVENT_TYPE.SET_TITLE,
      data: { title: '본인 인증', voteId, voteItemId: itemId },
    };

    if (isApp) {
      const url = getAppLink(AppLinkTypes.WEB, {
        landingType: 'modal',
        url: `${env.endPoint.baseUrl}${getWebLink(WebLinkTypes.AUTH_SMS)}`,
      });

      open({ url, initialData });

      return;
    }

    openModal(
      {
        nonModalWrapper: true,
        render: (props) => createElement(DrawerOrdererAuthContainer, { ...props }),
      },
      { ...initialData },
    );
  };

  /**
   * 투표 가능 여부 확인
   */
  const handleCheckVoteAvailable = useCallback(async (itemId: number) => {
    const res = await handleGetSuffrage().catch((error) => {
      showToastMessage({ message: error.data?.message });
    });
    if (!res) return;
    const { allowedVoteCount, usedVoteCount, isAuthentication, authenticationType } = res;
    const remainVote = allowedVoteCount - usedVoteCount; // 잔여 투표권
    if (remainVote === 0) {
      showToastMessage({ message: '오늘의 투표권을 모두 사용했습니다' });
      return;
    }

    if (!isAuthentication && authenticationType === 'MOBILE') {
      // 모바일 인증
      openAuth(itemId);
      return;
    }

    handleVoteItem(itemId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 투표하기
   */
  const handleTapVote = useCallback(
    async (itemId: number) => {
      if (isVoteLoading || isSuffrageLoading) {
        return;
      }

      if (!getIsLogin()) {
        const signInResult = await handleSignIn();
        if (signInResult) {
          handleCheckVoteAvailable(itemId);
        }
        return;
      }
      handleCheckVoteAvailable(itemId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSuffrageLoading, isVoteLoading],
  );

  /**
   * 인증 완료 후 투표
   */
  useEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }

    const { type, data } = receiveValues as VoteReceiveModel;
    if (!(voteId === data.voteId && vote.id === data.voteItemId)) return;

    switch (type) {
      // 인증 완료
      case CALL_WEB_EVENT_TYPE.ON_SMS_AUTH_CLOSE:
        handleVoteItem(data.voteItemId);
        emitClearReceiveValues();
        break;
      default:
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return {
    /** 투표하기 */
    handleTapVote,
  };
};
