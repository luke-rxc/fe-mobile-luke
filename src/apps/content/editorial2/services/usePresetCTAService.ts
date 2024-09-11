import { useCallback } from 'react';
import env from '@env';
import { ContentType } from '@constants/content';
import { AppLinkTypes, UniversalLinkTypes } from '@constants/link';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { ReviewListType } from '@features/review/constants';
import { toReviewListLink } from '@features/review/utils';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLink } from '@hooks/useLink';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { getAppLink } from '@utils/link';
import { CTAButtonActionType } from '../constants';
import type { CtaButtonModel } from '../models';
import { useContentStoreService } from './useContentStoreService';

/**
 * CTA 컴포넌트 서비스
 */
export const usePresetCTAService = ({ deepLink }: { deepLink: string }) => {
  const { getIsLogin } = useAuth();
  const { openDialogToApp } = useMwebToAppDialog();
  const { getLink } = useLink();
  const { isApp } = useDeviceDetect();
  const { handleSignIn } = useContentStoreService();
  const { appLinkUrl } = env.app;

  /**
   * 링크 액션 제어
   */
  const handleAnchor = async (e: React.MouseEvent, button: CtaButtonModel) => {
    const { href } = e.target as HTMLAnchorElement;
    const { buttonActionType, value, isRequiredLogin } = button;

    // path가 딥링크 인 경우
    if (!isApp && buttonActionType === CTAButtonActionType.DEEP_LINK && `${href}`.includes(appLinkUrl)) {
      e.preventDefault();
      openDialogToApp(deepLink, {
        actionProps: {
          kind: AppPopupActionKind.CONTENT,
        },
      });
      return;
    }

    // 외부링크 타입
    if (isRequiredLogin && buttonActionType === CTAButtonActionType.EXTERNAL_WEB) {
      if (!getIsLogin()) {
        e.preventDefault();

        const signInResult = await handleSignIn();
        if (signInResult) {
          if (isApp) {
            window.location.href = href;
            return;
          }
          window.open(value);
        }
      }
    }
  };

  /**
   * 딥링크 타입인 경우, 모웹에서 앱 다운로드 다이얼로그 노출
   * 단, 콘텐츠/쇼룸/상품 상세 딥링크의 경우 유니버셜 링크로 적용 (#PRIZM-214)
   */
  const handleGetDeepLinkValue = useCallback((value: string) => {
    if (value.includes('/content/')) {
      // 컨텐츠 딥링크
      const [linkValue, query] = value.split('?');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [v = '', app = '', type, contentCode] = linkValue.split('/');
      const path = getLink(UniversalLinkTypes.CONTENT, {
        contentType: type.toLowerCase(),
        contentCode,
      });
      return `${path}${query ? `?${query}` : ''}`;
    }
    const showroomReg = /^(\/showroom\/)/; // '/showroom/..' 로 링크가시작 되는 경우 쇼룸랜딩으로 판단
    if (showroomReg.test(value)) {
      // 쇼룸 딥링크
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [app = '', showroomCode = ''] = value.split('/showroom/');
      return getLink(UniversalLinkTypes.SHOWROOM, {
        showroomCode,
      });
    }

    const goodsReg = /^(\/goods\/)/; // '/goods/..' 로 링크가시작 되는 경우 상품랜딩으로 판단
    if (goodsReg.test(value)) {
      // 상품 딥링크
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [app = '', goodsCode = ''] = value.split('/goods/');
      return getLink(UniversalLinkTypes.GOODS, { goodsCode });
    }

    const reviewReg = /^(\/reviewlist\/)/;
    if (isApp && reviewReg.test(value)) {
      // 리뷰 딥링크

      let linkURL = '';
      if (value.includes('/goods/')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [app = '', id = ''] = value.split('/reviewlist/goods/');
        linkURL = toReviewListLink(ReviewListType.GOODS, { id: +id });
      } else if (value.includes('/showroom/')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [app = '', id = ''] = value.split('/reviewlist/showroom/');
        linkURL = toReviewListLink(ReviewListType.SHOWROOM, { id: +id });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return linkURL;
    }
    return `${appLinkUrl}${value}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetButtonLink = useCallback(
    ({ buttonActionType, value }: Pick<CtaButtonModel, 'buttonActionType' | 'value'>) => {
      // 쇼룸 링크 타입
      if (buttonActionType === CTAButtonActionType.SHOWROOM) {
        return getLink(UniversalLinkTypes.SHOWROOM, {
          showroomCode: value,
        });
      }

      // 컨텐츠 스토리 링크 타입
      if (buttonActionType === CTAButtonActionType.CONTENT_STORY) {
        return getLink(UniversalLinkTypes.CONTENT, {
          contentType: ContentType.STORY.toLowerCase(),
          contentCode: value,
        });
      }

      // 컨텐츠 티저 링크 타입
      if (buttonActionType === CTAButtonActionType.CONTENT_TEASER) {
        return getLink(UniversalLinkTypes.CONTENT, {
          contentType: ContentType.TEASER.toLowerCase(),
          contentCode: value,
        });
      }

      // 외부링크
      if (buttonActionType === CTAButtonActionType.EXTERNAL_WEB) {
        return isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: value }) : value;
      }

      // 딥링크
      if (buttonActionType === CTAButtonActionType.DEEP_LINK) {
        return handleGetDeepLinkValue(value);
      }

      return undefined;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    handleAnchor,
    handleGetButtonLink,
  };
};
