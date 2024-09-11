import type { ContentType } from '@constants/content';
import type { DomainTypes, TemplateTypes } from '../constants';

// 프로필 이미지
export interface ProfileImageSchema {
  id: number;
  path: string;
  blurHash?: string | null;
  width?: number;
  height?: number;
  fileType?: 'IMAGE' | 'LOTTIE';
  extension?: string;
}

// 프로필 애니메이션
export interface ProfileAnimationSchema {
  type: 'NEW_ARRIVALS' | 'ON_AIR';
  backgroundColorCode?: string;
}

// 썸네일 이미지
export interface ThumbnailImageSchema {
  id: number;
  path: string;
  blurHash?: string | null;
  width: number;
  height: number;
}

// 랜딩 파라미터
export interface LandingParameterSchema {
  articleId: number | null;
  auctionId: number | null;
  campaignId: number | null;
  deepLink: string | null;
  goodsCode: string | null;
  goodsId: number | null;
  landingType: 'OUT_LINK' | 'DEEP_LINK' | null;
  liveId: number | null;
  liveRaffleItemId: number | null;
  orderId: number | null;
  orderItemOptionIdList: number[] | null;
  outLink: string | null;
  showRoomCode: string | null;
  showRoomId: number | null;
  storyCode: string | null;
  storyId: number | null;
  storyType: ContentType | null;
}

// 알림 아이템
export interface NotificationItemSchema {
  // PrimaryKey
  sortKey: number;
  // 도메인 유형
  domainType: DomainTypes;
  // 알림 유형
  templateType: TemplateTypes;
  /**
   * @summary v1 스펙 기준 버튼 노출 없는 상태로 정의됨
   * before: 'DEFAULT' | 'SINGLE_BUTTON' | 'DOUBLE_BUTTON'
   */
  layout: 'DEFAULT';
  // 프로필 이미지
  profileImage: ProfileImageSchema | null;
  // 프로필 애니메이션
  profileAnimation: ProfileAnimationSchema | null;
  // 썸네일 목록
  contentsImageList: ThumbnailImageSchema[] | null;
  // 알림 메시지
  message: string;
  // 전송일자
  sendDate: number;
  // 랜딩 파라미터
  landingParameter: LandingParameterSchema;
}

// 알림 목록
export interface NotificationListSchema {
  metadata: {
    // 마지막 알림 읽은 시간
    lastSeenDate: number | null;
  };
  content: NotificationItemSchema[];
  nextParameter: string | null;
}
