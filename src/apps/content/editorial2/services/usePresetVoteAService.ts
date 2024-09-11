import { useCallback, useEffect, useState } from 'react';
import env from '@env';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useDialog } from '@hooks/useDialog';
import { useLink } from '@hooks/useLink';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { getAppLink, getWebLink } from '@utils/link';
import { getSuffrage } from '../apis';
import type { ContentLogInfoModel, VoteItemModel } from '../models';
// import { useContentStore } from '../stores';
import { useContentStoreService } from './useContentStoreService';
import { useLogService } from './useLogService';

export const usePresetVoteAService = ({
  voteId,
  list,
  contentLogInfo,
}: {
  voteId: number;
  list: VoteItemModel[];
  contentLogInfo: ContentLogInfoModel;
}) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { openDialog } = useDialog();
  const { toLink } = useLink();
  const { open, showToastMessage } = useWebInterface();
  const { logPresetVoteCertificationButtonTab } = useLogService();
  const { handleSignIn } = useContentStoreService();
  // const login = useContentStore.use.login();
  const [voteButtonActive, setVoteButtonActive] = useState(true); // 버튼 상태
  const [voteItemList, setVoteItemList] = useState<VoteItemModel[]>(list); // 투표리스트
  const { code: contentCode, type: contentType } = contentLogInfo;

  // 투표권 조회
  const { mutateAsync: handleGetSuffrage } = useMutation(() => getSuffrage(voteId), {
    onSuccess: (res) => {
      const { allowedVoteCount, usedVoteCount } = res;
      const remainVote = allowedVoteCount - usedVoteCount; // 잔여 투표권
      setVoteButtonActive(remainVote > 0);
    },
    onError: () => {},
  });

  /**
   * 투표 항목 업데이트
   */
  const handleVoteUpdate = useCallback((remainVote: number, item?: { id: number; voteCount: number }) => {
    setVoteButtonActive(remainVote > 0);

    if (item) {
      setVoteItemList((prev: VoteItemModel[]) => {
        const value = prev.map((voteItem) => {
          return {
            ...voteItem,
            ...(voteItem.id === item.id && { voteCount: item.voteCount }),
          };
        });
        return [...value];
      });
    }
  }, []);

  /**
   * 인증서 보기
   */
  const handleTapCertification = useCallback(async () => {
    logPresetVoteCertificationButtonTab(contentLogInfo, { voteId });
    if (!getIsLogin()) {
      const signInResult = await handleSignIn();
      if (signInResult) {
        handleCheckVoteHistory();
      }
      return;
    }

    handleCheckVoteHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 당일 유효 투표 이력 확인 후 인증뷰 이동
   */
  const handleCheckVoteHistory = useCallback(async () => {
    const res = await handleGetSuffrage().catch((error) => {
      showToastMessage({ message: error.data?.message });
    });
    if (!res) return;
    if (res.usedVoteCount === 0) {
      showToastMessage({ message: '투표 참여 기록이 없습니다' });
      return;
    }
    handleShortcutsCertification(false, res.isShared);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 인증서 바로가기
   */
  const handleShortcutsCertification = useCallback((isConfirmMove = false, isShared: boolean) => {
    const webLink = getWebLink(WebLinkTypes.CONTENT_VOTE, {
      contentType: contentType.toLowerCase(),
      contentCode,
      voteId,
    });
    if (isApp) {
      const url = getAppLink(AppLinkTypes.WEB, {
        landingType: 'modal',
        url: `${env.endPoint.baseUrl}${webLink}`,
      });

      open({
        url,
        initialData: {},
      });

      return;
    }

    // 웹에서 인증서 이동에 대한 컨펌처리
    if (isConfirmMove) {
      openDialog({
        title: isShared ? '투표 인증서를 확인할까요?' : '2표를 더 받아보세요',
        desc: isShared ? '' : '투표 인증서를 공유하면 바로 드립니다',
        type: 'confirm',
        cancel: {
          label: '취소',
        },
        confirm: {
          label: '확인',
          cb: () => {
            toLink(webLink);
          },
        },
      });
    } else {
      toLink(webLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 투표 소진 후 인증서 보기 처리
   */
  const handleVoteFinish = useCallback((isShared) => {
    handleShortcutsCertification(true, isShared);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 초기 투표권 상태 조회
   */
  useEffect(() => {
    if (!getIsLogin()) return;
    // 초기 투표권 상태 조회
    handleGetSuffrage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 로그인 상태에 따라 버튼 UI 업데이트 변경
   */
  // useEffect(() => {
  //   if (!login) return;
  //   handleGetSuffrage();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [login]);

  return {
    /** 투표 항목 리스트 */
    voteItemList,
    /** 버튼 활성 상태 */
    voteButtonActive,
    /** 투표 인증보기 */
    handleTapCertification,
    /** 투표 항목 업데이트 */
    handleVoteUpdate,
    /** 투표 소진시 */
    handleVoteFinish,
  };
};
