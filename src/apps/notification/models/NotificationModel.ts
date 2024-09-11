import { differenceInSeconds, differenceInDays, secondsToMinutes, secondsToHours, format, isAfter } from 'date-fns';
import { AppLinkTypes, UniversalLinkTypes } from '@constants/link';
import env from '@env';
import { getImageLink, getAppLink, getUniversalLink } from '@utils/link';
import { ProfileStatusType } from '@pui/profiles';
import { DomainTypes, TemplateTypes, ProfileIconTypes } from '../constants';
import type {
  ThumbnailImageSchema,
  NotificationItemSchema,
  NotificationListSchema,
  ProfileImageSchema,
  ProfileAnimationSchema,
  LandingParameterSchema,
} from '../schemas';

export interface NotificationItemModel
  extends Omit<NotificationItemSchema, 'sendDate' | 'profileImage' | 'profileAnimation'> {
  id: string;
  unread: boolean;
  profileIcon: ProfileIconTypes | null;
  profileImage: ProfileImageModel | null;
  relativeTime: string;
  landingLink: LandingLinkModel;
}

export type NotificationsModel = NotificationItemModel[];

/**
 * 알림 목록 UI Model
 */
export const toNotificationsModel = (
  { content }: NotificationListSchema,
  pageIndex: number,
  pages: NotificationListSchema[],
): NotificationsModel => {
  const [firstPage] = pages;

  // 첫번째 lastSeenDate를 기준으로 읽음 여부 비교
  const {
    metadata: { lastSeenDate },
  } = firstPage;

  return content.map(
    (
      {
        sendDate,
        contentsImageList,
        domainType,
        templateType,
        profileImage,
        profileAnimation,
        landingParameter,
        ...other
      },
      index,
    ) => ({
      // 페이지 기준 Unique ID
      id: `${pageIndex + 1}-${index + 1}`,
      // 알림 읽지 않음 여부
      unread: toUnread(lastSeenDate, sendDate),
      // 도메인 유형
      domainType,
      // 알림 유형
      templateType,
      // 프로필 아이콘
      profileIcon: toProfileIcon(domainType, templateType),
      // 프로필 이미지
      profileImage: toProfileImage(
        profileImage ?? generateCustomProfileImage(domainType, templateType),
        profileAnimation,
      ),
      // 썸네일 목록
      contentsImageList: toThumbnailsModel(contentsImageList),
      // 상대 시간 표기
      relativeTime: toRelativeTime(sendDate),
      // 랜딩 링크
      landingLink: toLandingLink(domainType, templateType, landingParameter),
      // 랜딩 파라미터
      landingParameter,
      // 기타 데이터
      ...other,
    }),
  );
};

/**
 * 읽음 여부 UI Model
 */
function toUnread(seenDate: number | null, sendDate: number): boolean {
  if (!seenDate) {
    return true;
  }

  // sendDate > seenDate
  return isAfter(sendDate, seenDate);
}

function toProfileIcon(domainType: DomainTypes, templateType: TemplateTypes) {
  let type: ProfileIconTypes | null = null;

  // 주문/배송 도메인 타입
  if (domainType === DomainTypes.ORDER_SHIPPING) {
    switch (templateType) {
      case TemplateTypes.SHIPPING_STARTED:
      case TemplateTypes.SHIPPING_COMPLETED:
        type = ProfileIconTypes.DELIVERY;
        break;
      case TemplateTypes.WRITABLE_REVIEW:
      case TemplateTypes.INPUT_FORM_DEADLINE:
      case TemplateTypes.INPUT_FORM_REMIND:
        type = ProfileIconTypes.EDIT;
        break;
      case TemplateTypes.CHECK_IN_SELECT:
      case TemplateTypes.CHECK_IN_BEFORE_N_DAYS:
      case TemplateTypes.CHECK_IN_BEFORE_1_DAY:
        type = ProfileIconTypes.ARROW_RIGHT;
        break;
      case TemplateTypes.CHECK_IN_BEFORE_1_DAY_BY_DATED:
        type = ProfileIconTypes.LUGGAGE;
        break;
      case TemplateTypes.RESERVATION_REQUEST:
      case TemplateTypes.RESERVATION_CONFIRMED:
        type = ProfileIconTypes.CHECKMARK;
        break;
      case TemplateTypes.RESERVATION_CANCEL:
        type = ProfileIconTypes.CLOSE;
        break;
      default:
        type = ProfileIconTypes.ORDER;
        break;
    }
  }

  // 클레임 도메인 타입
  if (domainType === DomainTypes.CLAIM) {
    type = ProfileIconTypes.CLAIM;
  }

  // 팔로잉 도메인 타입
  if (domainType === DomainTypes.FOLLOWING) {
    switch (templateType) {
      case TemplateTypes.SALES_GOODS:
      case TemplateTypes.REMIND_GOODS:
        type = ProfileIconTypes.TAG;
        break;
      default:
        break;
    }
  }

  // 쿠폰/적립금 도메인 타입
  if (domainType === DomainTypes.COUPON_POINT) {
    switch (templateType) {
      case TemplateTypes.WELCOME_COUPON:
      case TemplateTypes.REMIND_COUPON:
        type = ProfileIconTypes.COUPON;
        break;
      case TemplateTypes.INVITED_FRIEND_BENEFIT:
        type = ProfileIconTypes.PRICE;
        break;
      default:
        break;
    }
  }

  return type;
}

/**
 * 커스텀 프로필 이미지 생성
 */
function generateCustomProfileImage(domainType: DomainTypes, templateType: TemplateTypes): ProfileImageSchema | null {
  if (domainType !== DomainTypes.ETC || templateType !== TemplateTypes.CUSTOM) {
    return null;
  }

  return {
    // 커스텀 프로필 이미지 임의의 ID 값 0으로 지정
    id: 0,
    path: env.endPoint.baseUrl.concat('/static/image/service_profile_prizm.png'),
    width: 512,
    height: 512,
  };
}

interface ProfileImageModel extends ProfileImageSchema {
  status: ProfileStatusType;
}

/**
 * 프로필 이미지 UI Model
 */
function toProfileImage(
  profileImage: ProfileImageSchema | null,
  profileAnimation: ProfileAnimationSchema | null,
): ProfileImageModel | null {
  if (!profileImage) {
    return null;
  }

  return {
    ...profileImage,
    status: profileAnimation?.type === 'ON_AIR' ? ProfileStatusType.LIVE : ProfileStatusType.NONE,
    path: getImageLink(profileImage.path),
  };
}

/**
 * 상대 시간 표기 UI Model
 *
 * @see {@link https://www.notion.so/72c0abdc988f4a6aa2e9db4df0544cd1#1a8a6b393ac6427c83dd1d9d988fde00}
 */
function toRelativeTime(timestamp: number): string {
  const now = new Date();
  const base = new Date(timestamp);
  const diffSeconds = differenceInSeconds(now, base);
  const diffDays = differenceInDays(now, base);
  const diffMinutes = secondsToMinutes(diffSeconds);
  const diffHours = secondsToHours(diffSeconds);

  // ~ 59초 까지 표기
  if (diffMinutes < 1) {
    return '조금 전';
  }

  // 1분 ~ 59분 59초 까지 표기
  if (diffHours < 1) {
    return `${diffMinutes}분 전`;
  }

  // 60분 ~ 23시 59분 59초 까지 표기
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 24시간 ~ 6일 23시간 59분 59초 까지 표기
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  // 7일 ~ 표기
  return format(base, 'M월 d일');
}

/**
 * 썸네일 이미지 UI Model
 */
function toThumbnailsModel(contentsImageList: ThumbnailImageSchema[] | null) {
  return contentsImageList?.length
    ? contentsImageList.map(({ path, ...other }) => ({ path: getImageLink(path), ...other }))
    : null;
}

interface LandingLinkModel {
  web: string;
  app: string;
}

/**
 * 랜딩 링크 Model
 */
function toLandingLink(
  domainType: DomainTypes,
  templateType: TemplateTypes,
  landingParameter: LandingParameterSchema,
): LandingLinkModel {
  const {
    auctionId,
    deepLink,
    landingType,
    liveId,
    orderId,
    orderItemOptionIdList,
    outLink,
    articleId,
    storyType,
    storyCode,
    goodsCode,
  } = landingParameter;

  // 클레임 유형
  if (domainType === DomainTypes.CLAIM) {
    switch (templateType) {
      case TemplateTypes.CLAIM_QNA:
        return getUniversalLink(UniversalLinkTypes.CS_QNA_DETAIL, { requestId: articleId as number });
      default:
        return getUniversalLink(UniversalLinkTypes.ORDER_DETAIL, { orderId: orderId as number });
    }
  }

  // 팔로잉 유형
  if (domainType === DomainTypes.FOLLOWING) {
    switch (templateType) {
      case TemplateTypes.SHOWCASE_CONTENTS:
        return getUniversalLink(UniversalLinkTypes.CONTENT, {
          contentType: (storyType as string).toLowerCase(),
          contentCode: storyCode as string,
        });
      case TemplateTypes.LIVE_ON_AIR:
        return getUniversalLink(UniversalLinkTypes.LIVE, { liveId: liveId as number });
      case TemplateTypes.SALES_GOODS:
      case TemplateTypes.REMIND_GOODS:
        return getUniversalLink(UniversalLinkTypes.GOODS, { goodsCode: goodsCode as string });
      default:
        return { web: '#none', app: '#none' };
    }
  }

  // 라이브 유형
  if (domainType === DomainTypes.LIVE) {
    switch (templateType) {
      case TemplateTypes.AUCTION_PAYMENT_COMPLETED:
        return getUniversalLink(UniversalLinkTypes.ORDER_DETAIL, { orderId: orderId as number });
      case TemplateTypes.DRAW_WINNER_INFO:
      case TemplateTypes.DRAW_WINNER_TO_EXTERNAL:
        return { web: outLink || '#none', app: getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: outLink as string }) };
      case TemplateTypes.DRAW_WINNER_TO_GOODS:
        return getUniversalLink(UniversalLinkTypes.GOODS, { goodsCode: goodsCode as string });
      case TemplateTypes.DRAW_WINNER_TO_EVENT:
        return getUniversalLink(UniversalLinkTypes.CS_EVENT_LIST);
      default:
        return { web: '#none', app: getAppLink(AppLinkTypes.CHECKOUT_AUCTION, { auctionId: auctionId as number }) };
    }
  }

  // 주문/배송 유형
  if (domainType === DomainTypes.ORDER_SHIPPING) {
    switch (templateType) {
      case TemplateTypes.WRITABLE_REVIEW:
        return getReviewLandingLink(orderItemOptionIdList);
      case TemplateTypes.INPUT_FORM_DEADLINE:
      case TemplateTypes.INPUT_FORM_REMIND:
        return getUniversalLink(UniversalLinkTypes.ORDER_DETAIL, {
          orderId: orderId as number,
          section: 'additionalInfo',
        });
      default:
        return getUniversalLink(UniversalLinkTypes.ORDER_DETAIL, { orderId: orderId as number });
    }
  }

  // 쿠폰/적립금 유형
  if (domainType === DomainTypes.COUPON_POINT) {
    switch (templateType) {
      case TemplateTypes.WELCOME_COUPON:
      case TemplateTypes.REMIND_COUPON:
        return getUniversalLink(UniversalLinkTypes.COUPON);
      case TemplateTypes.INVITED_FRIEND_BENEFIT:
        return getUniversalLink(UniversalLinkTypes.POINT);
      default:
        return { web: '#none', app: '#none' };
    }
  }

  // 이벤트 유형
  if (domainType === DomainTypes.EVENT) {
    switch (templateType) {
      case TemplateTypes.ENTERED_EVENT:
        return getUniversalLink(UniversalLinkTypes.CONTENT, {
          contentType: (storyType as string).toLowerCase(),
          contentCode: storyCode as string,
        });
      default:
        return { web: '#none', app: '#none' };
    }
  }

  // 커스텀 유형
  if (domainType === DomainTypes.ETC && templateType === TemplateTypes.CUSTOM) {
    switch (landingType) {
      case 'DEEP_LINK':
        return { web: deepLink as string, app: deepLink as string };
      case 'OUT_LINK':
        return { web: outLink as string, app: getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: outLink as string }) };
      default:
        return { web: '#none', app: '#none' };
    }
  }

  return { web: '#none', app: '#none' };
}

/**
 * 리뷰 랜딩 링크
 */
function getReviewLandingLink(ids: LandingParameterSchema['orderItemOptionIdList']) {
  // 리뷰 작성 모달 (상품 1개인 경우)
  if (Array.isArray(ids) && ids.length === 1) {
    const [odrerItemOptionId] = ids;

    return { web: '#none', app: getAppLink(AppLinkTypes.REVIEW_WRITE, { odrerItemOptionId }) };
  }

  // orderItemOptionIdList 값이 올바르지 않은 경우 및 리뷰 상품 2개 이상인 경우 모두 Mypage로 랜딩
  return { web: '#none', app: getAppLink(AppLinkTypes.MYPAGE, { isReload: true.toString() }) };
}
