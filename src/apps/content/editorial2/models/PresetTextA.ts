import { MediaViewerRatio, AlignType } from '../constants';
import type {
  BackgroundInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TypoItemModel,
} from './Presets';

/**
 * 텍스트 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type TextADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    align: AlignType; // 가로 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title1: TypoItemModel; // 타이틀1
    title2: TypoItemModel; // 타이틀2
    subTitle1: TypoItemModel; // 서브 타이틀1
    subTitle2: TypoItemModel; // 서브 타이틀2
    subTitle3: TypoItemModel; // 서브 타이틀3
    description: TypoItemModel[]; // 디스크립션
    useMedia: boolean; // 미디어 사용여부
    mediaViewRatio: MediaViewerRatio; // 미디어 노출 비율 정보
    isMediaRound: boolean; // 미디어 라운드 설정
    media: DisplayMediaModel; // 대표 미디어
    visibleMediaMute: boolean; // 음소거 버튼 노출 여부
    useBackground: boolean; // 백그라운드 사용여부
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    parallaxMode: boolean; // 패럴럭스 모드(sticky타입)
    isOverlay: boolean; // 백그라운드 딤드
    layoutMarginTop: boolean; // 레이아웃 상단 여백 설정
    layoutMarginBottom: boolean; // 레이아웃 하단 여백 설정
  };
