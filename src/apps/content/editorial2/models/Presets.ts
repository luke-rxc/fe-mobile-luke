import type { HTMLAttributes } from 'react';
import {
  ContentsBackgroundType,
  MediaType,
  TextItemSizeType,
  LandingActionType,
  TypoItemSizeType,
  PresetKey,
  PresetType,
  PresetGroup,
} from '../constants';
import type { ContentInfoState } from '../stores';
import type { CouponModel, EventModel, GoodsModel, VoteModel } from './Content';

/**
 * 프리셋 공통 인터페이스
 */
export type PresetItemModel = {
  presetGroup: PresetGroup; // 프리셋 그룹
  presetType: PresetType; // 컴포프리셋넌트 타입
  presetId: number; // 프리셋 id - sortNumber를 기준으로 할당
  contents: string; // 디스플레이 요소 - string 타입으로 전달
  goodsList: GoodsModel[]; // 상품 리스트
  couponList: CouponModel[]; // 쿠폰 리스트
  eventList: EventModel[]; // 이벤트 리스트
  voteList: VoteModel[]; // 투표 리스트
  navigationList: PresetNavigationItemModel[]; // 네비게이션 리스트
  visible: boolean; // 노출 여부
  anchor: boolean; // 프리셋 앵커링 기능 여부
};

export type PresetNavigationItemModel = {
  id: number;
  label: string;
};

export type PresetSectionModel = {
  type: 'TAB' | 'NORMAL';
  items: PresetItemModel[];
};

export type PresetRefModel = HTMLDivElement;

export type PresetComponentModel = HTMLAttributes<HTMLDivElement> & {
  preset: PresetItemModel;
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
  [PresetKey.useDisplayDateTime]: boolean; // 노출기간 설정 사용여부
  [PresetKey.displayStartDateTime]: string; // 노출 시작 시간
  [PresetKey.displayEndDateTime]: string; // 노출 종료 시간
};

/**
 * 로깅 콘텐츠 정보
 */
export type ContentLogInfoModel = ContentInfoState & {
  presetId: number;
  presetType: PresetType;
};
