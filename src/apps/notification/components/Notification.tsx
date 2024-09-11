import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { AppLinkTypes } from '@constants/link';
import { getAppLink } from '@utils/link';
import { TemplateTypes } from '../constants';
import type { NotificationItemModel } from '../models';
import { useLogService } from '../services';
import { NotificationBadge } from './NotificationBadge';
import { NotificationProfile } from './NotificationProfile';
import { NotificationInformation } from './NotificationInformation';
import { NotificationThumbnails } from './NotificationThumbnails';

interface Props extends Omit<NotificationItemModel, 'id'> {
  className?: string;
}

export const Notification = styled(
  ({
    className,
    sortKey,
    templateType,
    unread,
    profileIcon,
    profileImage,
    message,
    relativeTime,
    landingLink,
    contentsImageList,
    landingParameter,
  }: Props) => {
    const pressDimmedRef = useRef<HTMLDivElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const history = useHistory();
    const { isApp } = useDeviceDetect();
    const { openDialogToApp } = useMwebToAppDialog();
    const { logTabMessages, logTabProfileImage, logImpressionCampaignMessage, logTabCampaignMessage } = useLogService();

    const handleClick = () => {
      logTabMessages({ id: sortKey, type: templateType });

      // 캠페인 피드 클릭 로그
      if (templateType === TemplateTypes.CUSTOM && landingParameter.campaignId) {
        logTabCampaignMessage({ campaignId: landingParameter.campaignId });
      }

      // 앱인 경우 랜딩 링크 처리
      if (isApp) {
        window.location.href = landingLink.app;
        return;
      }

      /**
       * 모웹 앱 다운로드 유도 팝업 (알림피드 링크)
       * - 낙찰 상품 결제 실패인 경우 (TemplateTypes.AUCTION_PAYMENT_FAILED, TemplateTypes.AUCTION_PAYMENT_INFO)
       * - 리뷰 작성 알림인 경우 (TemplateTypes.WRITABLE_REVIEW)
       */
      if (
        [TemplateTypes.AUCTION_PAYMENT_FAILED, TemplateTypes.AUCTION_PAYMENT_INFO, TemplateTypes.WRITABLE_REVIEW].some(
          (type) => type === templateType,
        )
      ) {
        openDialogToApp(getAppLink(AppLinkTypes.NOTIFICATIONS));
        return;
      }

      // 드로우 당첨 축하 안내인 경우 외부URL이므로 새창 처리
      if (
        [TemplateTypes.DRAW_WINNER_INFO, TemplateTypes.DRAW_WINNER_TO_EXTERNAL].some((type) => type === templateType)
      ) {
        window.open(landingLink.web, '_blank');
        return;
      }

      /**
       * 모웹 커스텀 링크 처리
       * - 랜딩 타입이 DEEP_LINK인 경우 유도 팝업
       * - 랜딩 타입이 OUT_LINK인 경우 외부 링크 새창 처리
       */
      if (templateType === TemplateTypes.CUSTOM) {
        if (landingParameter.landingType === 'DEEP_LINK') {
          openDialogToApp(landingLink.app);
          return;
        }
        if (landingParameter.landingType === 'OUT_LINK') {
          window.open(landingLink.web, '_blank');
          return;
        }
      }

      history.push(landingLink.web);
    };

    const handleProfileIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      logTabProfileImage({ id: sortKey, type: templateType });
    };

    const handleTouchStart = () => {
      pressDimmedRef?.current?.setAttribute('style', 'opacity: 1;');
    };

    const handleTouchEnd = () => {
      pressDimmedRef?.current?.removeAttribute('style');
    };

    const onVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) {
        if (templateType === TemplateTypes.CUSTOM && landingParameter.campaignId) {
          logImpressionCampaignMessage({ campaignId: landingParameter.campaignId });
        }

        observer.disconnect();
      }
    };

    useEffect(() => {
      let observer: IntersectionObserver;

      if (container.current) {
        observer = new IntersectionObserver(onVisibility, { threshold: 0.3 });
        observer.observe(container.current);
      }

      return () => observer && observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={container}
        className={className}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="notification-pressed-dimmed" ref={pressDimmedRef} />

        {/* 읽음 여부 */}
        {unread && <NotificationBadge />}

        {/* 프로필 */}
        {(profileIcon || profileImage) && (
          <NotificationProfile
            profileIcon={profileIcon}
            profileImage={profileImage}
            landingParameter={landingParameter}
            onClick={handleProfileIconClick}
          />
        )}

        {/* 메시지 및 추가 정보 */}
        <NotificationInformation message={message} relativeTime={relativeTime} />

        {/* 썸네일 */}
        {contentsImageList && <NotificationThumbnails images={contentsImageList} />}
      </div>
    );
  },
)`
  display: flex;
  position: relative;
  z-index: 0;
  min-height: 7.6rem;
  background: ${({ theme }) => theme.color.surface};
  border: 0;
  padding: 1.6rem 2.4rem 1.6rem 1.8rem;
  justify-content: space-between;

  .notification-pressed-dimmed {
    ${({ theme }) => theme.absolute({ t: 0, r: 0, b: 0, l: 0 })};
    background: ${({ theme }) => theme.color.gray3};
    opacity: 0;
    transition: opacity 0.2s;
  }
`;
