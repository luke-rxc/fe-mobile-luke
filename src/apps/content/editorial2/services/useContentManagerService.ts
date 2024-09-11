import { useEffect, useLayoutEffect, useState } from 'react';
import omit from 'lodash/omit';
import { WebHeaderHeight } from '@constants/ui';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import type { ContentStoryModel } from '../models';
import { useContentEventService } from './useContentEventService';
import { useContentHistoryService } from './useContentHistoryService';
import { useContentStoreService } from './useContentStoreService';
import { useLogService } from './useLogService';
/**
 * 유효 컨텐츠에 대한 관리
 * @returns
 */

export const useContentManagerService = ({ content }: { content: ContentStoryModel }) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { initializeValues } = useWebInterface();

  // 최근 본 컨텐츠 등록 서비스
  const { contentHistoryMutate } = useContentHistoryService();
  // 이벤트코드 유저 등록 서비스
  const { handleContentEvent } = useContentEventService();
  // 로깅 서비스
  const { logContentInit, logPresetReplyTab } = useLogService();
  const {
    handleUpdateLogin,
    handleUpdateFollowed,
    handleUpdateContentInfo,
    handleUpdateShowroom,
    handleUpdatePageViewTopBar,
    handleUpdateShowReply,
    handleResetStore,
  } = useContentStoreService();
  const [render, setRender] = useState(false);

  /**
   * 초기 상태값 업데이트
   */
  const handleInitStoreState = () => {
    const { contentNo, contentName, code, type, deepLink, dateTime, preview, showroom } = content;
    handleResetStore();
    handleUpdateLogin(getIsLogin());
    handleUpdateFollowed(showroom.isFollow);
    handleUpdateContentInfo({
      contentNo,
      contentName,
      code,
      type,
      deepLink,
      dateTime,
      preview,
    });
    handleUpdateShowroom(omit(showroom, 'isFollow'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  /**
   * 댓글 메뉴 클릭
   */
  const handleClickReplyMenu = () => {
    const { code, type } = content;
    handleUpdateShowReply(true);
    logPresetReplyTab({
      contentCode: code,
      contentType: type,
    });
  };

  /**
   * 초기화 및 웹뷰 Top 시스템 영역 사이즈
   */
  useLayoutEffect(() => {
    handleInitStoreState();
    if (!isApp) {
      handleUpdatePageViewTopBar(WebHeaderHeight);
      return;
    }
    if (initializeValues && initializeValues.topInset) {
      handleUpdatePageViewTopBar(initializeValues.topInset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeValues]);

  useEffect(() => {
    const { contentName, contentNo, type, status, eventCode, showroom, keywordList } = content;
    // 최근본 콘텐츠
    contentHistoryMutate(contentNo);
    // 이벤트코드 유저 등록
    if (eventCode) {
      handleContentEvent({ eventCode });
    }

    // 콘텐츠 진입 로그
    logContentInit({
      contentId: contentNo,
      contentName,
      contentType: type,
      contentStatus: status,
      showroomName: showroom.name,
      showroomId: showroom.id,
      contentsKeyword: keywordList.map((keyword) => {
        return keyword.name;
      }),
    });
    setRender(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return {
    render,
    handleClickReplyMenu,
  };
};
