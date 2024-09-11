import { AlignType, MediaViewerRatio } from '../constants';
import type {
  BackgroundInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  LandingActionModel,
  TextItemModel,
} from './Presets';

/**
 * 미디어뷰어 B 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type MediaViewerBDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    align: AlignType; // 가로 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title: Omit<TextItemModel, 'sizeType'>; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보 //Omit<BackgroundType, 'VIDEO'>;
    isOverlay: boolean; // 백그라운드 이미지 딤드
    mediaViewRatio: MediaViewerRatio; // 미디어 노출 비율 정보
    isMediaRound: boolean; // 미디어 라운드 처리
    mediaLists: MediaViewerBCardItemModel[];
    useMediaText: boolean; // 미디어 텍스트 사용여부
    mediaTextColor: string; // 미디어 텍스트 컬러
  };

export type MediaViewerBCardItemModel = DisplayMediaModel & {
  title: string;
  subTitle: string;
  actions: LandingActionModel; // 랜딩 액션
};
