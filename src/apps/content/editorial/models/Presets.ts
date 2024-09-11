import { ContentType } from '@constants/content';
import { ImageFileType } from '@constants/file';
import {
  ContentsBackgroundType,
  MediaType,
  TextItemSizeType,
  PresetType,
  LandingActionType,
  PresetGroup,
  TypoItemSizeType,
} from '../constants';
import type { BlankComponentRefModel, BlankDisplayModel, BlankProps } from './PresetBlank';
import type { CtaComponentRefModel, CtaDisplayModel, CtaProps } from './PresetCta';
import type { DealListAComponentRefModel, DealListADisplayModel, DealListAProps } from './PresetDealListA';
import type { DealListBComponentRefModel, DealListBDisplayModel, DealListBProps } from './PresetDealListB';
import type { FooterComponentRefModel, FooterDisplayModel, FooterProps } from './PresetFooter';
import type { HeaderComponentRefModel, HeaderDisplayModel, HeaderProps } from './PresetHeader';
import type { ImageViewProps, ImageViewerComponentRefModel, ImageViewerDisplayModel } from './PresetImageViewer';
import type { MediaAComponentRefModel, MediaADisplayModel, MediaAProps } from './PresetMediaA';
import type { MediaBComponentRefModel, MediaBDisplayModel, MediaBProps } from './PresetMediaB';
import type { MediaViewerAComponentRefModel, MediaViewerADisplayModel, MediaViewerAProps } from './PresetMediaViewerA';
import type { MediaViewerBComponentRefModel, MediaViewerBDisplayModel, MediaViewerBProps } from './PresetMediaViewerB';
import type { ReplyComponentRefModel, ReplyDisplayModel, ReplyProps } from './PresetReply';
import type { TextAComponentRefModel, TextADisplayModel, TextAProps } from './PresetTextA';
import type { CouponDownComponentRefModel, CouponDownDisplayModel, CouponDownProps } from './PresetCouponDown';
import type { NavigationComponentRefModel, NavigationDisplayModel, NavigationProps } from './PresetNavigation';
import type { CouponFollowDisplayModel, CouponFollowProps } from './PresetCouponFollow';
import type { DrawADisplayModel, DrawAProps } from './PresetDrawA';
import type { PlayViewerDisplayModel, PlayViewerProps } from './PresetPlayViewer';
import type { VoteAComponentRefModel, VoteADisplayModel, VoteAProps } from './PresetVoteA';
import type { BannerComponentRefModel, BannerDisplayModel, BannerProps } from './PresetBanner';
import type {
  BenefitGoodsBDisplayModel,
  BenefitGoodsBComponentRefModel,
  BenefitGoodsBProps,
} from './PresetBenefitGoodsB';

export type ContentInfoModel = {
  contentId: number;
  contentName: string;
  contentCode: string;
  contentType: ContentType;
  contentIndex: number;
  presetType: PresetType;
};

/**
 * 쇼룸 정보
 */
export type ShowroomModel = {
  showroomId: number;
  showroomCode: string; // 쇼룸코드
  showroomName: string; // 쇼룸명
  showroomImage: ImageModel;
  brand: BrandModel;
  onAir: boolean;
  liveId: number;
  notice?: string; // 공지
  isFollow: boolean;
  backgroundColor?: string;
  contentColor?: string;
  textColor: string;
  tintColor: string;
};

export type BrandModel = {
  defaultShowRoomId: number;
  id: number;
  name: string;
  primaryImage: ImageModel;
};

export type GoodsItem = {
  goodsId: number;
  imageUrl: string;
  goodsName: string;
  price: number;
  consumerPrice: number;
  discountRate: number;
};

// 텍스트 공통 속성
export type TextType = {
  text: string;
  bold: boolean;
  color: string; // 텍스트별 컬러
};

// 타이틀 속성
export type TitleType = TextType & {
  sizeType: TextItemSizeType | '';
};

export type GoodsListItemModel = {
  brandId: number; // 브랜드 Id
  brandName: string; // 브랜드 명
  brandImage: ImageModel; // 브랜드 이미지
  goodsId: number; // 상품 ID
  goodsCode: string; // 상품 코드명
  goodsImage: ImageModel; // 상품 이미지
  goodsName: string; // 상품명
  discountRate: number; // 할인율
  consumerPrice: number; // 판매가
  price: number; // 정가
  color: string; // 상품 텍스트 컬러
};
/**
 * 이미지
 */
export type ImageModel = {
  id: number;
  path: string;
  blurHash?: string;
  width?: number;
  height?: number;
  fileType?: ImageFileType;
  extension?: string;
};

/**
 * 컨텐츠 내 백그라운드 타입 정보
 */
export type BackgroundInfoModel = {
  type: ContentsBackgroundType;
  color: string;
};

/**
 * 미디어(비디오. 이미지 정보)
 */
export type DisplayMediaModel = {
  id: number;
  type: MediaType;
  path: string;
  width: number;
  height: number;
  fileSize: number;
  extension: string;
  posterImage: string;
  blurHash: string;
  // 패럴럭스 이미지인 경우,
  /** 비디오 재생시간 */
  duration: number;
  /** 파일명 */
  fileName: string;
  /** 프레임 총 개수 */
  totalFrames: number;
  /** 파일 중간 path */
  middlePath: string;
};

/**
 * 텍스트 모델
 */
export type TextItemModel = {
  text: string; // 텍스트 내용
  bold: boolean; // bold 처리
  color: string; // 텍스트 컬러
  sizeType: TextItemSizeType; // 텍스트 사이즈
};

/**
 * 타이포 모델
 */
export type TypoItemModel = {
  text: string; // 텍스트 내용
  bold: boolean; // bold 처리
  color: string; // 텍스트 컬러
  sizeType: TypoItemSizeType; // 텍스트 사이즈
};
/**
 * 랜딩 액션
 */
export type LandingActionModel = {
  actionType: LandingActionType;
  value: string;
};

export type ComponentRefModel = {
  ref: HTMLDivElement;
};

export type PresetRefModel =
  | BannerComponentRefModel
  | BenefitGoodsBComponentRefModel
  | BlankComponentRefModel
  | CouponDownComponentRefModel
  | CtaComponentRefModel
  | DealListAComponentRefModel
  | DealListBComponentRefModel
  | FooterComponentRefModel
  | HeaderComponentRefModel
  | ImageViewerComponentRefModel
  | MediaAComponentRefModel
  | MediaBComponentRefModel
  | MediaViewerAComponentRefModel
  | MediaViewerBComponentRefModel
  | NavigationComponentRefModel
  | ReplyComponentRefModel
  | TextAComponentRefModel
  | VoteAComponentRefModel;

export type PresetModel<T> = {
  presetGroup: PresetGroup;
  presetType: PresetType;
  contents: T;
};
/**
 * display와 관련된 인터페이스
 */
export type PresetDisplayTypes =
  | BannerDisplayModel
  | BenefitGoodsBDisplayModel
  | BlankDisplayModel
  | CouponDownDisplayModel
  | CouponFollowDisplayModel
  | CtaDisplayModel
  | DealListADisplayModel
  | DealListBDisplayModel
  | DrawADisplayModel
  | FooterDisplayModel
  | HeaderDisplayModel
  | ImageViewerDisplayModel
  | MediaADisplayModel
  | MediaBDisplayModel
  | MediaViewerADisplayModel
  | MediaViewerBDisplayModel
  | NavigationDisplayModel
  | PlayViewerDisplayModel
  | ReplyDisplayModel
  | TextADisplayModel
  | VoteADisplayModel;

/**
 * display / display와 기타 데이터 조합한 인터페이스
 * ex)
 * display + 상품리스트
 * display + 쇼타임 라이브
 * display + 푸터
 */
export type PresetContents =
  | BannerProps
  | BenefitGoodsBProps
  | BlankProps
  | CouponDownProps
  | CouponFollowProps
  | CtaProps
  | DealListAProps
  | DealListBProps
  | DrawAProps
  | FooterProps
  | HeaderProps
  | ImageViewProps
  | MediaAProps
  | MediaBProps
  | MediaViewerAProps
  | MediaViewerBProps
  | NavigationProps
  | PlayViewerProps
  | ReplyProps
  | TextAProps
  | VoteAProps;

export const PresetKey = {
  /** 네비게이션 사용 여부 key */
  useNavigation: 'useNavigation',
  /** 네비게이션 라벨명 key */
  navigationLabel: 'navigationLabel',
  /** 컴포넌트 노출 여부 key */
  visible: 'visible',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PresetKey = typeof PresetKey[keyof typeof PresetKey];

/**
 * 컴포넌트내 네비게이션 사용 속성
 */
export type DisplayNavigationOptionModel = {
  [PresetKey.useNavigation]: boolean;
  [PresetKey.navigationLabel]: string;
};

/**
 * 컴포넌트 예약노출 사용 속성
 */
export type DisplayTimeOptionModel = {
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

export type ScrollTriggerModel = {
  /**
   * number: 0~1 - 0 : 요소가 뷰포트 "최상단"에 도달 시 트리거 1: 요소가 뷰포트 "하단"에서 노출 될때 트리거
   * array: [startRatio, endRatio] - 배열인 경우 해당 범위 시 트리거
   */
  viewRatio?: number | number[];
  /**
   *  viewRatio 기준으로 트리거 반복. false인 경우는 1번만 트리거
   */
  isToggle?: boolean;
};
