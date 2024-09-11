import type { HTMLAttributes } from 'react';
import type { AlignType, BenefitListAMediaRatio, BenefitListAOverlayColorTypes } from '../constants';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TypoItemModel,
} from './Presets';

/**
 * 혜택 리스트 A 컴포넌트 타입
 */
export type BenefitListAProps = BenefitListADisplayModel &
  Omit<HTMLAttributes<HTMLDivElement>, 'title'> &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type BenefitListADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    layoutMarginTop: boolean; // 레이아웃 상단 여백 설정
    layoutMarginBottom: boolean; // 레이아웃 하단 여백 설정
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 이미지 딤드
    textColor: string; // 텍스트 공통 색상
    align: AlignType; // 가로 정렬
    subTitle: TypoItemModel; // 서브 타이틀
    description: TypoItemModel; // 디스크립션
    detail: TypoItemModel; // 디테일
    useMedia: boolean; // 이미지/비디오 사용
    mediaList: DisplayMediaModel[];
    mediaViewRatio: BenefitListAMediaRatio; // 미디어 노출 비율 정보
    controller: BenefitListAMediaControllerModel; // 미디어 컨트롤러 설정
  };

type BenefitListAMediaControllerModel = {
  bulletColor: string; // 인디케이터 색상
  background: BenefitListAOverlayColorTypes; // 오버레이 색상타입
};

export type BenefitListAComponentRefModel = ComponentRefModel;
